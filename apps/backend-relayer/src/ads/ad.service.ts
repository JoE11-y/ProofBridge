/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateAdDto, QueryAdsDto, UpdateAdDto } from '../dto/ad.dto';
import { getAddress } from 'ethers';
import { Prisma } from '@prisma/client';
import { Request } from 'express';

function toBI(s?: string): bigint | undefined {
  return typeof s === 'string' ? BigInt(s) : undefined;
}

@Injectable()
export class AdsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: QueryAdsDto) {
    const take =
      query.limit && query.limit > 0 && query.limit <= 100 ? query.limit : 25;
    const cursor = query.cursor ? { id: query.cursor } : undefined;

    const where: any = {};
    if (query.routeId) where.routeId = query.routeId;
    if (query.creatorAddress) where.creatorAddress = query.creatorAddress;
    if (query.status) where.status = query.status;

    const items = await this.prisma.ad.findMany({
      where,
      orderBy: { id: 'asc' },
      take: take + 1,
      ...(cursor ? { cursor, skip: 1 } : {}),
      select: {
        id: true,
        creatorAddress: true,
        routeId: true,
        fromTokenId: true,
        toTokenId: true,
        poolAmount: true,
        minAmount: true,
        maxAmount: true,
        status: true,
        metadata: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // compute locksums for all returned ads
    const ids = items.map((i) => i.id);
    const lockSums = ids.length
      ? await this.prisma.adLock.groupBy({
          by: ['adId'],
          where: { adId: { in: ids }, releasedAt: null },
          _sum: { amount: true },
        })
      : [];

    const sumMap = new Map<string, bigint>();
    lockSums.forEach((row) => {
      sumMap.set(row.adId, row._sum.amount ?? 0n);
    });

    let nextCursor: string | null = null;
    if (items.length > take) {
      const next = items.pop()!;
      nextCursor = next.id;
    }

    const data = items.map((i) => {
      const locked = sumMap.get(i.id) ?? 0n;
      const available = i.poolAmount - locked;
      const effectiveStatus =
        i.status === 'CLOSED'
          ? 'CLOSED'
          : available === 0n
            ? 'EXHAUSTED'
            : i.status;

      return {
        id: i.id,
        creatorAddress: i.creatorAddress,
        routeId: i.routeId,
        fromTokenId: i.fromTokenId,
        toTokenId: i.toTokenId,
        poolAmount: i.poolAmount.toString(),
        availableAmount: available.toString(),
        minAmount: i.minAmount ? i.minAmount.toString() : null,
        maxAmount: i.maxAmount ? i.maxAmount.toString() : null,
        status: effectiveStatus,
        metadata: i.metadata ?? null,
        createdAt: i.createdAt.toISOString(),
        updatedAt: i.updatedAt.toISOString(),
      };
    });

    return { data, nextCursor };
  }

  async getById(id: string) {
    const ad = await this.prisma.ad.findUnique({
      where: { id },
      select: {
        id: true,
        creatorAddress: true,
        routeId: true,
        fromTokenId: true,
        toTokenId: true,
        poolAmount: true,
        minAmount: true,
        maxAmount: true,
        status: true,
        metadata: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!ad) throw new NotFoundException('Ad not found');

    const lockSum = await this.prisma.adLock.aggregate({
      where: { adId: ad.id, releasedAt: null },
      _sum: { amount: true },
    });

    const locked = lockSum._sum.amount ?? 0n;
    const available = ad.poolAmount - locked;
    const effectiveStatus =
      ad.status === 'CLOSED'
        ? 'CLOSED'
        : available === 0n
          ? 'EXHAUSTED'
          : ad.status;

    return {
      id: ad.id,
      creatorAddress: ad.creatorAddress,
      routeId: ad.routeId,
      fromTokenId: ad.fromTokenId,
      toTokenId: ad.toTokenId,
      poolAmount: ad.poolAmount.toString(),
      availableAmount: available.toString(),
      minAmount: ad.minAmount ? ad.minAmount.toString() : null,
      maxAmount: ad.maxAmount ? ad.maxAmount.toString() : null,
      status: effectiveStatus,
      metadata: ad.metadata ?? null,
      createdAt: ad.createdAt.toISOString(),
      updatedAt: ad.updatedAt.toISOString(),
    };
  }

  /* ---------- Creator actions ---------- */

  async create(req: Request, dto: CreateAdDto) {
    const reqUser = req.user;

    if (!reqUser) throw new ForbiddenException('Unauthorized');

    const user = await this.prisma.user.findUnique({
      where: { id: reqUser.sub },
    });

    if (!user) throw new ForbiddenException('Unauthorized');

    // Pull route + tokens to validate same-symbol & cross-chain
    const route = await this.prisma.route.findUnique({
      where: { id: dto.routeId },
      select: {
        id: true,
        fromToken: {
          select: {
            id: true,
            symbol: true,
            chain: { select: { chainId: true } },
          },
        },
        toToken: {
          select: {
            id: true,
            symbol: true,
            chain: { select: { chainId: true } },
          },
        },
      },
    });
    if (!route) throw new NotFoundException('Route not found');

    const fromChainId = route.fromToken.chain.chainId;
    const toChainId = route.toToken.chain.chainId;

    if (fromChainId === toChainId) {
      throw new BadRequestException('Route must be cross-chain');
    }

    const poolBI = BigInt(dto.poolAmount);
    const minBI = toBI(dto.minAmount);
    const maxBI = toBI(dto.maxAmount);
    if (minBI && minBI <= 0n)
      throw new BadRequestException('minAmount must be > 0');
    if (maxBI && maxBI <= 0n)
      throw new BadRequestException('maxAmount must be > 0');
    if (minBI && maxBI && minBI > maxBI)
      throw new BadRequestException('minAmount > maxAmount');

    const jsonData: Prisma.JsonObject = JSON.parse(
      JSON.stringify(dto.metadata || {}),
    ) as Prisma.JsonObject;

    const created = await this.prisma.ad.create({
      data: {
        creatorAddress: getAddress(user.walletAddress), // checksummed
        routeId: route.id,
        fromTokenId: route.fromToken.id,
        toTokenId: route.toToken.id,
        poolAmount: poolBI,
        minAmount: minBI,
        maxAmount: maxBI,
        metadata: jsonData,
        status: 'ACTIVE',
      },
      select: {
        id: true,
        creatorAddress: true,
        routeId: true,
        fromTokenId: true,
        toTokenId: true,
        poolAmount: true,
        minAmount: true,
        maxAmount: true,
        status: true,
        metadata: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // available == pool at creation (no locks yet)
    return {
      id: created.id,
      creatorAddress: created.creatorAddress,
      routeId: created.routeId,
      fromTokenId: created.fromTokenId,
      toTokenId: created.toTokenId,
      poolAmount: created.poolAmount.toString(),
      availableAmount: created.poolAmount.toString(),
      minAmount: created.minAmount ? created.minAmount.toString() : null,
      maxAmount: created.maxAmount ? created.maxAmount.toString() : null,
      status: created.status,
      metadata: created.metadata ?? null,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    };
  }

  async update(req: Request, id: string, dto: UpdateAdDto) {
    const reqUser = req.user;

    if (!reqUser) throw new ForbiddenException('Unauthorized');

    const user = await this.prisma.user.findUnique({
      where: { id: reqUser.sub },
    });

    if (!user) throw new ForbiddenException('Unauthorized');

    const ad = await this.prisma.ad.findUnique({
      where: { id },
      select: {
        id: true,
        creatorAddress: true,
        status: true,
      },
    });
    if (!ad) throw new NotFoundException('Ad not found');

    // Build data
    const data: any = {};
    if (dto.poolAmountTopUp) {
      const topUp = BigInt(dto.poolAmountTopUp);
      if (topUp <= 0n)
        throw new BadRequestException('poolAmountTopUp must be > 0');
      data.poolAmount = { increment: topUp };
    }
    if (dto.minAmount !== undefined) data.minAmount = toBI(dto.minAmount);
    if (dto.maxAmount !== undefined) data.maxAmount = toBI(dto.maxAmount);
    if (dto.metadata !== undefined) data.metadata = dto.metadata;
    if (dto.status) data.status = dto.status;

    const updated = await this.prisma.ad.update({
      where: { id },
      data,
      select: {
        id: true,
        creatorAddress: true,
        routeId: true,
        fromTokenId: true,
        toTokenId: true,
        poolAmount: true,
        minAmount: true,
        maxAmount: true,
        status: true,
        metadata: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const lockSum = await this.prisma.adLock.aggregate({
      where: { adId: id, releasedAt: null },
      _sum: { amount: true },
    });

    const locked = lockSum._sum.amount ?? 0n;
    const available = updated.poolAmount - locked;

    const effectiveStatus =
      updated.status === 'CLOSED'
        ? 'CLOSED'
        : available === 0n
          ? 'EXHAUSTED'
          : updated.status;

    if (effectiveStatus !== updated.status) {
      await this.prisma.ad.update({
        where: { id },
        data: { status: effectiveStatus },
        select: { id: true },
      });
    }

    return {
      id: updated.id,
      creatorAddress: updated.creatorAddress,
      routeId: updated.routeId,
      fromTokenId: updated.fromTokenId,
      toTokenId: updated.toTokenId,
      poolAmount: updated.poolAmount.toString(),
      availableAmount: available.toString(),
      minAmount: updated.minAmount ? updated.minAmount.toString() : null,
      maxAmount: updated.maxAmount ? updated.maxAmount.toString() : null,
      status: effectiveStatus,
      metadata: updated.metadata ?? null,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  async close(req: Request, id: string) {
    const reqUser = req.user;

    if (!reqUser) throw new ForbiddenException('Unauthorized');

    const user = await this.prisma.user.findUnique({
      where: { id: reqUser.sub },
    });

    if (!user) throw new ForbiddenException('Unauthorized');

    const ad = await this.prisma.ad.findUnique({
      where: { id },
      select: { id: true, creatorAddress: true, status: true },
    });
    if (!ad) throw new NotFoundException('Ad not found');

    await this.prisma.ad.update({
      where: { id },
      data: { status: 'CLOSED' },
      select: { id: true },
    });
  }
}
