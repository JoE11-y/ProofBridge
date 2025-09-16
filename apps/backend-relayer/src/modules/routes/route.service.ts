import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateRouteDto, QueryRoutesDto } from './dto/route.dto';
import { Prisma } from '@prisma/client';
import { RouteRow } from '../../types';

@Injectable()
export class RoutesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: QueryRoutesDto) {
    const take = query.limit ?? 25;
    const cursor = query.cursor ? { id: query.cursor } : undefined;

    const where: {
      fromTokenId?: string;
      toTokenId?: string;
      fromToken?: {
        chain?: { chainId: bigint };
        symbol?: { equals: string; mode: 'insensitive' };
      };
      toToken?: {
        chain?: { chainId: bigint };
        symbol?: { equals: string; mode: 'insensitive' };
      };
      OR?: Array<{
        fromToken?: { symbol: { equals: string; mode: 'insensitive' } };
        toToken?: { symbol: { equals: string; mode: 'insensitive' } };
      }>;
    } = {};

    if (query.fromTokenId) where.fromTokenId = query.fromTokenId;
    if (query.toTokenId) where.toTokenId = query.toTokenId;

    if (!query.fromTokenId && !query.toTokenId) {
      const hasChainFilters = query.fromChainId && query.toChainId;
      if (hasChainFilters) {
        where.fromToken = {
          chain: { chainId: BigInt(query.fromChainId!) },
          ...(query.symbol
            ? { symbol: { equals: query.symbol, mode: 'insensitive' } }
            : {}),
        };
        where.toToken = {
          chain: { chainId: BigInt(query.toChainId!) },
          ...(query.symbol
            ? { symbol: { equals: query.symbol, mode: 'insensitive' } }
            : {}),
        };
      } else if (query.symbol) {
        // If only symbol supplied, match either side containing symbol
        where.OR = [
          {
            fromToken: {
              symbol: { equals: query.symbol, mode: 'insensitive' },
            },
          },
          {
            toToken: { symbol: { equals: query.symbol, mode: 'insensitive' } },
          },
        ];
      }
    }

    const rows = await this.prisma.route.findMany({
      where,
      orderBy: { id: 'asc' },
      take: take + 1,
      ...(cursor ? { cursor, skip: 1 } : {}),
      select: {
        id: true,
        metadata: true,
        createdAt: true,
        updatedAt: true,
        fromToken: {
          select: {
            id: true,
            symbol: true,
            name: true,
            address: true,
            decimals: true,
            kind: true,
            chain: { select: { id: true, name: true, chainId: true } },
          },
        },
        toToken: {
          select: {
            id: true,
            symbol: true,
            name: true,
            address: true,
            decimals: true,
            kind: true,
            chain: { select: { id: true, name: true, chainId: true } },
          },
        },
      },
    });

    let nextCursor: string | null = null;
    if (rows.length > take) {
      const next = rows.pop()!;
      nextCursor = next.id;
    }

    return { data: rows.map((r) => this.serialize(r)), nextCursor };
  }

  async getById(id: string) {
    const row = await this.prisma.route.findUnique({
      where: { id },
      select: {
        id: true,
        metadata: true,
        createdAt: true,
        updatedAt: true,
        fromToken: {
          select: {
            id: true,
            symbol: true,
            name: true,
            address: true,
            decimals: true,
            kind: true,
            chain: { select: { id: true, name: true, chainId: true } },
          },
        },
        toToken: {
          select: {
            id: true,
            symbol: true,
            name: true,
            address: true,
            decimals: true,
            kind: true,
            chain: { select: { id: true, name: true, chainId: true } },
          },
        },
      },
    });
    if (!row) throw new NotFoundException('Route not found');
    return this.serialize(row as RouteRow);
  }

  async create(dto: CreateRouteDto) {
    if (dto.fromTokenId === dto.toTokenId) {
      throw new BadRequestException('Self-routes are not allowed');
    }

    // Ensure tokens exist
    const [fromExists, toExists] = await Promise.all([
      this.prisma.token.findUnique({
        where: { id: dto.fromTokenId },
        select: { id: true },
      }),
      this.prisma.token.findUnique({
        where: { id: dto.toTokenId },
        select: { id: true },
      }),
    ]);

    if (!fromExists || !toExists) {
      throw new NotFoundException('Token not found');
    }

    const jsonData: Prisma.JsonObject = JSON.parse(
      JSON.stringify(dto.metadata || {}),
    ) as Prisma.JsonObject;

    try {
      const row = await this.prisma.route.create({
        data: {
          fromTokenId: dto.fromTokenId,
          toTokenId: dto.toTokenId,
          metadata: jsonData,
        },
        select: {
          id: true,
          metadata: true,
          createdAt: true,
          updatedAt: true,
          fromToken: {
            select: {
              id: true,
              symbol: true,
              name: true,
              address: true,
              decimals: true,
              kind: true,
              chain: { select: { id: true, name: true, chainId: true } },
            },
          },
          toToken: {
            select: {
              id: true,
              symbol: true,
              name: true,
              address: true,
              decimals: true,
              kind: true,
              chain: { select: { id: true, name: true, chainId: true } },
            },
          },
        },
      });
      return this.serialize(row as RouteRow);
    } catch (e: any) {
      // P2002 = unique (fromTokenId, toTokenId)
      if (e?.code === 'P2002')
        throw new ConflictException('Route already exists');
      // P2003 = FK failure
      if (e?.code === 'P2003') throw new NotFoundException('Token not found');
      throw e;
    }
  }

  async remove(id: string) {
    const exists = await this.prisma.route.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException('Route not found');
    await this.prisma.route.delete({ where: { id } });
  }

  private serialize(row: RouteRow) {
    const payload = row.metadata ? (row.metadata as Prisma.JsonObject) : {};
    return {
      id: row.id,
      metadata: payload,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      fromToken: {
        id: row.fromToken.id,
        symbol: row.fromToken.symbol,
        name: row.fromToken.name,
        address: row.fromToken.address,
        decimals: row.fromToken.decimals,
        kind: row.fromToken.kind,
        chain: {
          id: row.fromToken.chain.id,
          name: row.fromToken.chain.name,
          chainId: row.fromToken.chain.chainId.toString(),
        },
      },
      toToken: {
        id: row.toToken.id,
        symbol: row.toToken.symbol,
        name: row.toToken.name,
        address: row.toToken.address,
        decimals: row.toToken.decimals,
        kind: row.toToken.kind,
        chain: {
          id: row.toToken.chain.id,
          name: row.toToken.chain.name,
          chainId: row.toToken.chain.chainId.toString(),
        },
      },
    };
  }
}
