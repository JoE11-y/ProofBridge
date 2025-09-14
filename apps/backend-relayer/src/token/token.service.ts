import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import {
  CreateTokenDto,
  QueryTokensDto,
  UpdateTokenDto,
} from '../dto/token.dto';
import { TokenRow } from '../types';

@Injectable()
export class TokenService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: QueryTokensDto) {
    const take = query.limit ?? 100;
    const cursor = query.cursor ? { id: query.cursor } : undefined;
    const where: {
      name?: { contains: string; mode: 'insensitive' };
      chainUid?: string;
      symbol?: { contains: string; mode: 'insensitive' };
      address?: { contains: string; mode: 'insensitive' } | { equals: string };
    } = {};

    if (query.chainUid) {
      where.chainUid = query.chainUid;
    }

    if (query.chainId) {
      const chain = await this.prisma.chain.findFirst({
        where: { chainId: BigInt(query.chainId) },
        select: { id: true },
      });
      if (chain) {
        where.chainUid = chain.id;
      }
    }

    if (query.symbol) {
      where.symbol = { contains: query.symbol, mode: 'insensitive' };
    }
    if (query.address) {
      where.address = { equals: query.address.toLowerCase() };
    }

    const rows = await this.prisma.token.findMany({
      where,
      orderBy: { id: 'asc' },
      take: take + 1,
      ...(cursor ? { cursor, skip: 1 } : {}),
      select: {
        id: true,
        symbol: true,
        name: true,
        address: true,
        decimals: true,
        kind: true,
        createdAt: true,
        updatedAt: true,
        chain: { select: { id: true, name: true, chainId: true } },
      },
    });

    let nextCursor: string | null = null;
    if (rows.length > take) {
      const next = rows.pop()!;
      nextCursor = next.id;
    }

    return { data: rows.map((c) => this.serialize(c)), nextCursor };
  }

  async getById(id: string) {
    const row = await this.prisma.token.findUnique({
      where: { id },
      select: {
        id: true,
        symbol: true,
        name: true,
        address: true,
        decimals: true,
        kind: true,
        createdAt: true,
        updatedAt: true,
        chain: { select: { id: true, name: true, chainId: true } },
      },
    });
    if (!row) throw new NotFoundException('Token not found');
    return this.serialize(row as TokenRow);
  }

  async create(dto: CreateTokenDto) {
    try {
      const created = await this.prisma.token.create({
        data: {
          chainUid: dto.chainUid,
          symbol: dto.symbol,
          name: dto.name,
          address: dto.address.toLowerCase(),
          decimals: dto.decimals,
          kind: dto.kind,
        },
        select: {
          id: true,
          symbol: true,
          name: true,
          address: true,
          decimals: true,
          kind: true,
          createdAt: true,
          updatedAt: true,
          chain: { select: { id: true, name: true, chainId: true } },
        },
      });
      return this.serialize(created);
    } catch (e: any) {
      if (e?.code === 'P2003') {
        throw new NotFoundException('Chain not found');
      }
      if (e?.code === 'P2002') {
        throw new ConflictException('Token already exists for this chain');
      }
      throw e;
    }
  }

  async update(id: string, dto: UpdateTokenDto) {
    const exists = await this.prisma.token.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException('Token not found');

    try {
      const updated = await this.prisma.token.update({
        where: { id },
        data: {
          ...(dto.chainUid ? { chainUid: dto.chainUid } : {}),
          ...(dto.symbol ? { symbol: dto.symbol } : {}),
          ...(dto.name ? { name: dto.name } : {}),
          ...(dto.address ? { address: dto.address.toLowerCase() } : {}),
          ...(dto.decimals !== undefined ? { decimals: dto.decimals } : {}),
          ...(dto.kind ? { kind: dto.kind } : {}),
        },
        select: {
          id: true,
          symbol: true,
          name: true,
          address: true,
          decimals: true,
          kind: true,
          createdAt: true,
          updatedAt: true,
          chain: { select: { id: true, name: true, chainId: true } },
        },
      });
      return this.serialize(updated);
    } catch (e: any) {
      if (e?.code === 'P2003') throw new NotFoundException('Chain not found');
      if (e?.code === 'P2002')
        throw new ConflictException('Token already exists for this chain');
      throw e;
    }
  }

  async remove(id: string) {
    const exists = await this.prisma.token.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException('Token not found');
    await this.prisma.token.delete({ where: { id } });
  }

  private serialize(row: TokenRow) {
    return {
      id: row.id,
      symbol: row.symbol,
      name: row.name,
      address: row.address,
      decimals: row.decimals,
      kind: row.kind,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      chain: {
        id: row.chain.id,
        name: row.chain.name,
        chainId: row.chain.chainId.toString(),
      },
    };
  }
}
