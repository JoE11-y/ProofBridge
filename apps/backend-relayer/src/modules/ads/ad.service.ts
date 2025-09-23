import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import {
  CreateAdDto,
  FundAdDto,
  QueryAdsDto,
  UpdateAdDto,
  WithdrawalAdDto,
  ConfirmAdActionDto,
  CloseAdDto,
} from './dto/ad.dto';
import { getAddress, isAddress } from 'ethers';
import { AdStatus, Prisma } from '@prisma/client';
import { Request } from 'express';
import { ViemService } from '../../providers/viem/viem.service';

function toBI(s?: string): bigint | undefined {
  return typeof s === 'string' ? BigInt(s) : undefined;
}

function sameSymbol(a: string, b: string) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

type AdQueryInput = {
  routeId?: string;
  creatorAddress?: string;
  status?: AdStatus;
};

type AdUpdateInput = {
  minAmount?: bigint | undefined;
  maxAmount?: bigint | undefined;
  metadata?: any;
  status?: AdStatus;
};

type AdUpdateLogInput = {
  poolAmount?: bigint;
  status?: AdStatus;
};

@Injectable()
export class AdsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly viemService: ViemService,
  ) {}

  async list(query: QueryAdsDto) {
    const take =
      query.limit && query.limit > 0 && query.limit <= 100 ? query.limit : 25;
    const cursor = query.cursor ? { id: query.cursor } : undefined;

    const where: AdQueryInput = {};

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

    if (isAddress(dto.creatorDstAddress)) {
      throw new BadRequestException('Invalid address');
    }

    // Pull route + tokens to validate same-symbol & cross-chain
    const route = await this.prisma.route.findUnique({
      where: { id: dto.routeId },
      select: {
        id: true,
        fromToken: {
          select: {
            id: true,
            symbol: true,
            chain: { select: { chainId: true, adManagerAddress: true } },
            address: true,
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

    if (sameSymbol(route.fromToken.symbol, route.toToken.symbol)) {
      throw new BadRequestException('Route tokens must have different symbols');
    }

    const jsonData: Prisma.JsonObject = JSON.parse(
      JSON.stringify(dto.metadata || {}),
    ) as Prisma.JsonObject;

    const requestDetails = await this.prisma.$transaction(async (prisma) => {
      const ad = await prisma.ad.create({
        data: {
          creatorAddress: getAddress(user.walletAddress),
          creatorDstAddress: getAddress(dto.creatorDstAddress),
          routeId: route.id,
          fromTokenId: route.fromToken.id,
          toTokenId: route.toToken.id,
          metadata: jsonData,
          status: 'INACTIVE',
        },
        select: {
          id: true,
          creatorDstAddress: true,
          status: true,
        },
      });

      const reqContractDetails =
        await this.viemService.getCreateAdRequestContractDetails({
          adChainId: route.fromToken.chain.chainId,
          adContractAddress: route.fromToken.chain
            .adManagerAddress as `0x${string}`,
          adId: ad.id,
          orderChainId: route.toToken.chain.chainId,
          adToken: route.fromToken.address as `0x${string}`,
          adRecipient: ad.creatorDstAddress as `0x${string}`,
        });

      await prisma.adUpdateLog.create({
        data: {
          adId: ad.id,
          signature: reqContractDetails.signature,
          reqHash: reqContractDetails.reqHash,
          log: {
            create: [
              {
                field: 'Status',
                oldValue: ad.status,
                newValue: 'ACTIVE',
              },
            ],
          },
        },
      });

      return reqContractDetails;
    });

    return requestDetails;
  }

  async fund(req: Request, id: string, dto: FundAdDto) {
    const reqUser = req.user;

    if (!reqUser) throw new ForbiddenException('Unauthorized');

    const user = await this.prisma.user.findUnique({
      where: { id: reqUser.sub },
    });

    if (!user) throw new ForbiddenException('Unauthorized');

    const ad = await this.prisma.ad.findUnique({
      where: { id, creatorAddress: getAddress(user.walletAddress) },
      select: {
        id: true,
        creatorAddress: true,
        status: true,
        poolAmount: true,
        route: {
          select: {
            fromToken: {
              select: {
                chain: { select: { adManagerAddress: true, chainId: true } },
              },
            },
          },
        },
        adUpdateLog: true,
      },
    });

    if (!ad) throw new NotFoundException('Ad not found');

    if (ad.adUpdateLog) {
      throw new BadRequestException(
        'Ad has pending update; please wait a few minutes and try again',
      );
    }

    const poolBI = BigInt(dto.poolAmountTopUp);

    if (poolBI <= 0n)
      throw new BadRequestException('poolAmountTopUp must be > 0');

    const effectiveStatus = ad.status == 'EXHAUSTED' ? 'ACTIVE' : ad.status;

    const reqContractDetails =
      await this.viemService.getFundAdRequestContractDetails({
        adContractAddress: ad.route.fromToken.chain
          .adManagerAddress as `0x${string}`,
        adChainId: ad.route.fromToken.chain.chainId,
        adId: ad.id,
        amount: poolBI.toString(),
      });

    await this.prisma.$transaction(async (prisma) => {
      const entry = await prisma.adUpdateLog.create({
        data: {
          adId: ad.id,
          signature: reqContractDetails.signature,
          reqHash: reqContractDetails.reqHash,
          log: {
            create: [
              {
                field: 'PoolAmount',
                oldValue: ad.poolAmount.toString(),
                newValue: (ad.poolAmount + poolBI).toString(),
              },
              {
                field: 'Status',
                oldValue: ad.status,
                newValue: effectiveStatus,
              },
            ],
          },
        },
      });

      // mark ad as PAUSED if ad is active as log is pending
      if (ad.status === 'ACTIVE') {
        await prisma.ad.update({
          where: { id: ad.id },
          data: { status: 'PAUSED' },
        });
      }

      return entry;
    });

    return reqContractDetails;
  }

  async withdraw(req: Request, id: string, dto: WithdrawalAdDto) {
    const reqUser = req.user;

    if (!reqUser) throw new ForbiddenException('Unauthorized');

    const user = await this.prisma.user.findUnique({
      where: { id: reqUser.sub },
    });

    if (!user) throw new ForbiddenException('Unauthorized');

    const ad = await this.prisma.ad.findUnique({
      where: { id, creatorAddress: getAddress(user.walletAddress) },
      select: {
        id: true,
        creatorAddress: true,
        status: true,
        poolAmount: true,
        route: {
          select: {
            fromToken: {
              select: {
                chain: { select: { adManagerAddress: true, chainId: true } },
              },
            },
          },
        },
        adUpdateLog: true,
      },
    });

    if (!ad) throw new NotFoundException('Ad not found');

    if (ad.adUpdateLog) {
      throw new BadRequestException(
        'Ad has pending update; please wait a few minutes and try again',
      );
    }

    const poolBI = BigInt(dto.poolAmountWithdraw);

    if (poolBI <= 0n)
      throw new BadRequestException('poolAmountWithdraw must be > 0');

    // get locksum
    const lockSum = await this.prisma.adLock.aggregate({
      where: { adId: ad.id, releasedAt: null },
      _sum: { amount: true },
    });

    const locked = lockSum._sum.amount ?? 0n;
    const available = ad.poolAmount - locked;

    if (poolBI > available)
      throw new BadRequestException('Insufficient available balance');

    const effectiveStatus = available - poolBI === 0n ? 'EXHAUSTED' : ad.status;

    const reqContractDetails =
      await this.viemService.getWithdrawFromAdRequestContractDetails({
        adContractAddress: ad.route.fromToken.chain
          .adManagerAddress as `0x${string}`,
        adChainId: ad.route.fromToken.chain.chainId,
        adId: ad.id,
        amount: poolBI.toString(),
        to: dto.to as `0x${string}`,
      });

    await this.prisma.$transaction(async (prisma) => {
      await prisma.adUpdateLog.create({
        data: {
          adId: ad.id,
          signature: reqContractDetails.signature,
          reqHash: reqContractDetails.reqHash,
          log: {
            create: [
              {
                field: 'PoolAmount',
                oldValue: ad.poolAmount.toString(),
                newValue: (ad.poolAmount - poolBI).toString(),
              },
              {
                field: 'Status',
                oldValue: ad.status,
                newValue: effectiveStatus,
              },
            ],
          },
        },
      });

      // mark ad as PAUSED if it was ACTIVE as log is pending
      if (ad.status === 'ACTIVE') {
        await prisma.ad.update({
          where: { id: ad.id },
          data: { status: 'PAUSED' },
        });
      }
    });

    return reqContractDetails;
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

    const data: AdUpdateInput = {};

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
        minAmount: true,
        maxAmount: true,
        status: true,
        metadata: true,
      },
    });

    return {
      id: updated.id,
      creatorAddress: updated.creatorAddress,
      minAmount: updated.minAmount ? updated.minAmount.toString() : null,
      maxAmount: updated.maxAmount ? updated.maxAmount.toString() : null,
      metadata: updated.metadata ?? null,
    };
  }

  async close(req: Request, id: string, dto: CloseAdDto) {
    const reqUser = req.user;

    if (!reqUser) throw new ForbiddenException('Unauthorized');

    const user = await this.prisma.user.findUnique({
      where: { id: reqUser.sub },
    });

    if (!user) throw new ForbiddenException('Unauthorized');

    const ad = await this.prisma.ad.findFirst({
      where: { id, creatorAddress: getAddress(user.walletAddress) },
      select: {
        id: true,
        creatorAddress: true,
        status: true,
        poolAmount: true,
        route: {
          select: {
            fromToken: {
              select: {
                chain: { select: { adManagerAddress: true, chainId: true } },
              },
            },
          },
        },
        adUpdateLog: true,
      },
    });
    if (!ad) throw new NotFoundException('Ad not found');

    if (ad.adUpdateLog) {
      throw new BadRequestException(
        'Ad has pending update; please wait a few minutes and try again',
      );
    }

    // get locksum and ensure none are active
    const lockSum = await this.prisma.adLock.aggregate({
      where: { adId: ad.id, releasedAt: null },
      _sum: { amount: true },
    });

    const locked = lockSum._sum.amount ?? 0n;

    if (locked > 0n)
      throw new BadRequestException('Ad has active locks and cannot be closed');

    if (ad.status === 'CLOSED') {
      throw new BadRequestException('Ad is already closed');
    }

    const reqContractDetails =
      await this.viemService.getCloseAdRequestContractDetails({
        adContractAddress: ad.route.fromToken.chain
          .adManagerAddress as `0x${string}`,
        adChainId: ad.route.fromToken.chain.chainId,
        adId: ad.id,
        to: dto.to as `0x${string}`,
      });

    await this.prisma.$transaction(async (prisma) => {
      await prisma.adUpdateLog.create({
        data: {
          adId: ad.id,
          signature: reqContractDetails.signature,
          reqHash: reqContractDetails.reqHash,
          log: {
            create: [
              {
                field: 'PoolAmount',
                oldValue: ad.poolAmount.toString(),
                newValue: (0).toString(),
              },
              {
                field: 'Status',
                oldValue: ad.status,
                newValue: 'CLOSED',
              },
            ],
          },
        },
      });

      // mark ad as PAUSED if it was ACTIVE as log is pending
      if (ad.status === 'ACTIVE') {
        await prisma.ad.update({
          where: { id: ad.id },
          data: { status: 'PAUSED' },
        });
      }
    });

    return reqContractDetails;
  }

  async confirmChainAction(
    req: Request,
    adId: string,
    dto: ConfirmAdActionDto,
  ) {
    const reqUser = req.user;

    if (!reqUser) throw new ForbiddenException('Unauthorized');

    const user = await this.prisma.user.findUnique({
      where: { id: reqUser.sub },
    });

    if (!user) throw new ForbiddenException('Unauthorized');

    const adLogUpdate = await this.prisma.adUpdateLog.findUnique({
      where: { adId },
      include: { ad: true, log: true },
    });

    if (!adLogUpdate) throw new NotFoundException('Ad update log not found');

    if (
      getAddress(adLogUpdate.ad.creatorAddress) !==
      getAddress(user.walletAddress)
    ) {
      throw new ForbiddenException('Unauthorized');
    }

    // get ad details
    const ad = await this.prisma.ad.findUnique({
      where: { id: adId },
      select: {
        route: {
          select: {
            fromToken: {
              select: {
                chain: { select: { adManagerAddress: true, chainId: true } },
              },
            },
          },
        },
      },
    });

    if (!ad) throw new NotFoundException('Ad for Ad Id not found');

    // // verify adLog
    const isValidated = await this.viemService.validateAdManagerRequest({
      chainId: ad.route.fromToken.chain.chainId,
      contractAddress: ad.route.fromToken.chain
        .adManagerAddress as `0x${string}`,
      reqHash: adLogUpdate.reqHash as `0x${string}`,
    });

    if (!isValidated)
      throw new BadRequestException('Invalid request; please try again');

    // apply the updates
    const data: AdUpdateLogInput = {};

    adLogUpdate.log.forEach((entry) => {
      if (entry.field === 'PoolAmount') {
        data.poolAmount = BigInt(entry.newValue);
      } else if (entry.field === 'Status') {
        data.status = entry.newValue as AdStatus;
      }
    });

    await this.prisma.ad.update({
      where: { id: adLogUpdate.adId },
      data,
    });

    // delete the log entry
    await this.prisma.adUpdateLog.delete({ where: { id: adLogUpdate.id } });

    console.log(dto);

    return {
      success: true,
    };
  }
}
