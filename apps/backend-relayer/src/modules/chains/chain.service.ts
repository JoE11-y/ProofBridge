import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import {
  CreateChainDto,
  UpdateChainDto,
  QueryChainsDto,
} from './dto/chain.dto';
import { PublicChain } from '../../types';
import { Chain } from '@prisma/client';

@Injectable()
export class ChainService {
  constructor(private readonly prisma: PrismaService) {}

  async listChainsPublic(query: QueryChainsDto) {
    const data = await this.listChains(query);
    const rows = data.rows.map((c) => this.toPublic(c));
    return { rows, nextCursor: data.nextCursor };
  }

  async listChains(query: QueryChainsDto) {
    const take = query.limit ?? 25;
    const cursor = query.cursor ? { id: query.cursor } : undefined;

    const where: {
      name?: { contains: string; mode: 'insensitive' };
      chainId?: bigint;
    } = {};

    if (query.name) {
      where.name = { contains: query.name, mode: 'insensitive' };
    }
    if (query.chainId) {
      where.chainId = BigInt(query.chainId);
    }

    const rows = await this.prisma.chain.findMany({
      where,
      orderBy: { id: 'asc' },
      take: take + 1,
      ...(cursor ? { cursor, skip: 1 } : {}),
      select: {
        id: true,
        name: true,
        chainId: true,
        adManagerAddress: true,
        orderPortalAddress: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    let nextCursor: string | null = null;
    if (rows.length > take) {
      const next = rows.pop()!;
      nextCursor = next.id;
    }

    return { rows, nextCursor };
  }

  async getByChainId(chainId: string) {
    const chain = await this.prisma.chain.findUnique({
      where: { chainId: BigInt(chainId) },
      select: {
        id: true,
        name: true,
        chainId: true,
        adManagerAddress: true,
        orderPortalAddress: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!chain) throw new NotFoundException('Chain not found');

    return this.toPublic(chain);
  }

  async create(dto: CreateChainDto) {
    try {
      const created = await this.prisma.chain.create({
        data: {
          name: dto.name,
          chainId: BigInt(dto.chainId),
          adManagerAddress: dto.adManagerAddress,
          orderPortalAddress: dto.orderPortalAddress,
        },
        select: {
          id: true,
          name: true,
          chainId: true,
          adManagerAddress: true,
          orderPortalAddress: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      const response = {
        ...created,
        chainId: created.chainId.toString(),
      };

      return response;
    } catch (e: any) {
      if (e?.code === 'P2002')
        throw new ConflictException('Chain already exists');
      throw e;
    }
  }

  async update(id: string, dto: UpdateChainDto) {
    await this.ensureExists(id);

    try {
      const updated = await this.prisma.chain.update({
        where: { id },
        data: {
          ...(dto.name ? { name: dto.name } : {}),
          ...(dto.chainId ? { chainId: BigInt(dto.chainId) } : {}),
          ...(dto.adManagerAddress
            ? { adManagerAddress: dto.adManagerAddress }
            : {}),
          ...(dto.orderPortalAddress
            ? { orderPortalAddress: dto.orderPortalAddress }
            : {}),
        },
        select: {
          id: true,
          name: true,
          chainId: true,
          adManagerAddress: true,
          orderPortalAddress: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      const response = {
        ...updated,
        chainId: updated.chainId.toString(),
      };
      return response;
    } catch (e: any) {
      if (e?.code === 'P2002')
        throw new ConflictException('Chain already exists');
      throw e;
    }
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.chain.delete({ where: { id } });
  }

  private async ensureExists(id: string) {
    const exists = await this.prisma.chain.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException('Chain not found');
  }

  private toPublic(c: Chain): PublicChain {
    return {
      name: c.name,
      chainId: c.chainId.toString(),
      adManagerAddress: c.adManagerAddress,
      orderPortalAddress: c.orderPortalAddress,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    };
  }
}
