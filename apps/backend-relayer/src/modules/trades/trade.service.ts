/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import {
  ConfirmChainActionDto,
  ConfirmTradeDto,
  CreateTradeDto,
  QueryTradesDto,
} from './dto/trade.dto';
import { getAddress, isAddress } from 'ethers';
import { Request } from 'express';
import { Prisma } from '@prisma/client';
import { ViemService } from 'src/providers/viem/viem.service';

function toBI(s: string) {
  return BigInt(s);
}

@Injectable()
export class TradesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly viemService: ViemService,
  ) {}

  async getById(id: string) {
    const row = await this.prisma.trade.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        amount: true,
        adId: true,
        routeId: true,
        adCreatorAddress: true,
        bridgerAddress: true,
        participantSignatures: true,
        createdAt: true,
        updatedAt: true,
        ad: {
          select: { id: true, creatorAddress: true, routeId: true },
        },
        route: {
          select: {
            id: true,
            fromToken: {
              select: {
                id: true,
                symbol: true,
                chain: { select: { name: true } },
              },
            },
            toToken: {
              select: {
                id: true,
                symbol: true,
                chain: { select: { name: true } },
              },
            },
          },
        },
      },
    });
    if (!row) throw new NotFoundException('Trade not found');

    return row;
  }

  async list(q: QueryTradesDto) {
    const take = q.limit && q.limit > 0 && q.limit <= 100 ? q.limit : 25;
    const cursor = q.cursor ? { id: q.cursor } : undefined;

    const where: {
      routeId?: string;
      adId?: string;
      adCreatorAddress?: string;
      bridgerAddress?: string;
      route?: { fromTokenId?: string; toTokenId?: string };
      amount?: { gte?: string; lte?: string };
    } = {};

    if (q.routeId) where.routeId = q.routeId;
    if (q.adId) where.adId = q.adId;
    if (q.adCreatorAddress) where.adCreatorAddress = q.adCreatorAddress;
    if (q.bridgerAddress) where.bridgerAddress = q.bridgerAddress;

    if (q.fromTokenId)
      where.route = { ...(where.route ?? {}), fromTokenId: q.fromTokenId };
    if (q.toTokenId)
      where.route = { ...(where.route ?? {}), toTokenId: q.toTokenId };

    if (q.minAmount)
      where.amount = { ...(where.amount ?? {}), gte: q.minAmount };
    if (q.maxAmount)
      where.amount = { ...(where.amount ?? {}), lte: q.maxAmount };

    const rows = await this.prisma.trade.findMany({
      where,
      orderBy: { id: 'asc' },
      take: take + 1,
      ...(cursor ? { cursor, skip: 1 } : {}),
      select: {
        id: true,
        status: true,
        amount: true,
        adId: true,
        routeId: true,
        adCreatorAddress: true,
        bridgerAddress: true,
        ad: {
          select: { id: true, creatorAddress: true, routeId: true },
        },
        route: {
          select: {
            id: true,
            fromToken: {
              select: {
                id: true,
                symbol: true,
                chain: { select: { name: true } },
              },
            },
            toToken: {
              select: {
                id: true,
                symbol: true,
                chain: { select: { name: true } },
              },
            },
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    let nextCursor: string | null = null;
    if (rows.length > take) {
      const next = rows.pop()!;
      nextCursor = next.id;
    }

    return { data: rows, nextCursor };
  }

  // creates a new trade along with ad lock
  async create(req: Request, dto: CreateTradeDto) {
    const reqUser = req.user;

    if (!reqUser) throw new UnauthorizedException('Not authenticated');

    const user = await this.prisma.user.findUnique({
      where: { id: reqUser.sub },
    });

    if (!user) throw new UnauthorizedException('Unauthorized');

    if (!isAddress(dto.bridgerDstAddress)) {
      throw new BadRequestException('Invalid address');
    }

    const ad = await this.prisma.ad
      .findUnique({
        where: { id: dto.adId },
        select: {
          route: {
            select: {
              id: true,
              toToken: {
                select: {
                  address: true,
                  chain: {
                    select: { orderPortalAddress: true, chainId: true },
                  },
                },
              },
              fromToken: {
                select: {
                  address: true,
                  chain: { select: { adManagerAddress: true, chainId: true } },
                },
              },
            },
          },
          id: true,
          creatorAddress: true,
          creatorDstAddress: true,
          routeId: true,
          poolAmount: true,
          minAmount: true,
          maxAmount: true,
          status: true,
          adUpdateLog: true,
        },
      })
      .catch(() => null);

    if (!ad) {
      throw new NotFoundException('Ad not found');
    }

    if (ad.adUpdateLog) {
      throw new BadRequestException(
        'Ad has a pending update, please try again later',
      );
    }

    if (ad.status !== 'ACTIVE') {
      throw new BadRequestException(
        `Ad not ACTIVE, current status: ${ad.status}`,
      );
    }

    const amount = toBI(dto.amount);
    if (ad.minAmount && amount < ad.minAmount) {
      throw new BadRequestException('Amount below minAmount');
    }
    if (ad.maxAmount && amount > ad.maxAmount) {
      throw new BadRequestException('Amount above maxAmount');
    }

    // available = pool - sum(locks not released)
    const lockSum = await this.prisma.adLock.aggregate({
      where: { adId: ad.id, releasedAt: null },
      _sum: { amount: true },
    });
    const locked = lockSum._sum.amount ?? 0n;
    const available = ad.poolAmount - locked;
    if (amount > available)
      throw new BadRequestException('Insufficient liquidity');

    // Persist in a single transaction: then AdLock
    const result = await this.prisma.$transaction(async (tx) => {
      const trade = await tx.trade.create({
        data: {
          adId: ad.id,
          routeId: ad.route.id,
          amount: amount.toString(),
          adCreatorAddress: getAddress(ad.creatorAddress),
          adCreatorDstAddress: getAddress(ad.creatorDstAddress),
          bridgerAddress: getAddress(user.walletAddress),
          bridgerDstAddress: getAddress(dto.bridgerDstAddress),
        },
        select: { id: true, status: true },
      });

      const reqContractDetails =
        await this.viemService.getCreateOrderRequestContractDetails({
          orderChainId: ad.route.toToken.chain.chainId,
          orderParams: {
            orderChainToken: ad.route.toToken.address,
            adChainToken: ad.route.fromToken.address,
            amount: amount.toString(),
            bridger: getAddress(user.walletAddress),
            orderChainId: ad.route.toToken.chain.chainId.toString(),
            orderPortal: ad.route.toToken.chain.orderPortalAddress,
            orderRecipient: getAddress(dto.bridgerDstAddress),
            adChainId: ad.route.fromToken.chain.chainId.toString(),
            adManager: ad.route.fromToken.chain.adManagerAddress,
            adId: ad.id,
            adCreator: getAddress(ad.creatorAddress),
            adRecipient: getAddress(ad.creatorDstAddress),
            salt: trade.id,
          },
        });

      await tx.adLock.create({
        data: { adId: ad.id, tradeId: trade.id, amount: amount },
      });

      // create trade update log to make status active
      await tx.tradeUpdateLog.create({
        data: {
          tradeId: trade.id,
          origin: 'ORDER_PORTAL',
          signature: reqContractDetails.signature,
          reqHash: reqContractDetails.msgHash,
          log: {
            create: [
              {
                field: 'Status',
                oldValue: trade.status,
                newValue: 'ACTIVE',
              },
            ],
          },
        },
      });
      return { tradeId: trade.id, reqContractDetails };
    });

    return result;
  }

  async lockTrade(req: Request, tradeId: string) {
    const reqUser = req.user;
    if (!reqUser) throw new UnauthorizedException('Not authenticated');

    const user = await this.prisma.user.findUnique({
      where: { id: reqUser.sub },
    });

    if (!user) throw new UnauthorizedException('Unauthorized');

    const trade = await this.prisma.trade.findUnique({
      where: { id: tradeId, adCreatorAddress: getAddress(user.walletAddress) },
      select: {
        id: true,
        adId: true,
        amount: true,
        adLock: true,
        status: true,
        tradeUpdateLog: true,
        bridgerAddress: true,
        bridgerDstAddress: true,
        adCreatorDstAddress: true,
        adCreatorAddress: true,
        route: {
          select: {
            fromToken: {
              select: {
                address: true,
                chain: {
                  select: {
                    chainId: true,
                    adManagerAddress: true,
                  },
                },
              },
            },
            toToken: {
              select: {
                address: true,
                chain: {
                  select: {
                    chainId: true,
                    orderPortalAddress: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!trade) throw new NotFoundException('Trade not found');

    if (trade.tradeUpdateLog) {
      throw new BadRequestException(
        'Trade already has a pending update, please try again later',
      );
    }

    if (trade.status !== 'ACTIVE') {
      throw new BadRequestException(
        `Trade not ACTIVE, current status: ${trade.status}`,
      );
    }

    if (trade.adLock && trade.adLock.authorized) {
      return { authorized: true };
    }

    if (trade.adLock && trade.adLock.amount !== toBI(trade.amount.toString())) {
      throw new BadRequestException('AdLock amount mismatch');
    }

    const reqContractDetails =
      await this.viemService.getLockForOrderRequestContractDetails({
        adChainId: trade.route.fromToken.chain.chainId,
        orderParams: {
          orderChainToken: trade.route.toToken.address,
          adChainToken: trade.route.fromToken.address,
          amount: trade.amount.toString(),
          bridger: getAddress(user.walletAddress),
          orderChainId: trade.route.toToken.chain.chainId.toString(),
          orderPortal: trade.route.toToken.chain.orderPortalAddress,
          orderRecipient: getAddress(trade.bridgerDstAddress),
          adChainId: trade.route.fromToken.chain.chainId.toString(),
          adManager: trade.route.fromToken.chain.adManagerAddress,
          adId: trade.adId,
          adCreator: getAddress(trade.adCreatorAddress),
          adRecipient: getAddress(trade.adCreatorDstAddress),
          salt: trade.id,
        },
      });

    // create trade update log to make status locked
    await this.prisma.tradeUpdateLog.create({
      data: {
        tradeId: trade.id,
        origin: 'AD_MANAGER',
        signature: reqContractDetails.signature,
        reqHash: reqContractDetails.msgHash,
        log: {
          create: [
            {
              field: 'Status',
              oldValue: trade.status,
              newValue: 'LOCKED',
            },
            {
              field: 'AdLock',
              oldValue: 'false',
              newValue: 'true',
            },
          ],
        },
      },
    });

    return reqContractDetails;
  }

  async confirmChainAction(
    req: Request,
    tradeId: string,
    dto: ConfirmChainActionDto,
  ) {
    const reqUser = req.user;

    if (!reqUser) throw new ForbiddenException('Unauthorized');

    const user = await this.prisma.user.findUnique({
      where: { id: reqUser.sub },
    });

    if (!user) throw new ForbiddenException('Unauthorized');

    const tradeLogUpdate = await this.prisma.tradeUpdateLog.findUnique({
      where: { tradeId: tradeId, signature: dto.signature },
      include: { trade: true, log: true },
    });

    if (!tradeLogUpdate)
      throw new NotFoundException('Trade update log not found');

    if (
      tradeLogUpdate.trade.bridgerAddress !== user.walletAddress &&
      tradeLogUpdate.trade.adCreatorAddress !== user.walletAddress
    ) {
      throw new ForbiddenException('Unauthorized');
    }

    // get ad details
    const trade = await this.prisma.trade.findUnique({
      where: { id: tradeId },
      select: {
        route: {
          select: {
            fromToken: {
              select: {
                chain: { select: { adManagerAddress: true, chainId: true } },
              },
            },
            toToken: {
              select: {
                chain: { select: { orderPortalAddress: true, chainId: true } },
              },
            },
          },
        },
      },
    });

    if (!trade) throw new NotFoundException('Ad for Ad Id not found');

    if (tradeLogUpdate.origin === 'AD_MANAGER') {
      // verify adLog
      const isValidated = await this.viemService.validateAdManagerRequest({
        chainId: trade.route.fromToken.chain.chainId,
        contractAddress: trade.route.fromToken.chain
          .adManagerAddress as `0x${string}`,
        msgHash: tradeLogUpdate.reqHash as `0x${string}`,
      });

      if (!isValidated) {
        throw new BadRequestException('AdManager request not validated');
      }
    } else {
      // verify orderPortal
      const isValidated = await this.viemService.validateOrderPortalRequest({
        chainId: trade.route.toToken.chain.chainId,
        contractAddress: trade.route.toToken.chain
          .orderPortalAddress as `0x${string}`,
        msgHash: tradeLogUpdate.reqHash as `0x${string}`,
      });

      if (!isValidated) {
        throw new BadRequestException('OrderPortal request not validated');
      }
    }

    // apply the updates
    const data: any = {};

    tradeLogUpdate.log.forEach((entry) => {
      if (entry.field === 'Status') {
        data.status = entry.newValue;
      } else if (entry.field === 'AdLock') {
        data.adLock = { authorized: entry.newValue === 'true' };
      }
    });

    await this.prisma.trade.update({
      where: { id: tradeLogUpdate.tradeId },
      data,
    });

    // delete the log entry
    await this.prisma.tradeUpdateLog.delete({
      where: { id: tradeLogUpdate.id },
    });

    return {
      success: true,
    };
  }

  async authorize(req: Request, id: string, dto: ConfirmTradeDto) {
    const reqUser = req.user;
    if (!reqUser) throw new UnauthorizedException('Not authenticated');

    const user = await this.prisma.user.findUnique({
      where: { id: reqUser.sub },
    });

    if (!user) throw new UnauthorizedException('Unauthorized');

    const trade = await this.prisma.trade.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        bridgerAddress: true,
        adCreatorAddress: true,
        participantSignatures: true,
      },
    });

    if (!trade) throw new NotFoundException('Trade not found');

    const caller = getAddress(user.walletAddress);

    const isParty =
      caller === getAddress(trade.bridgerAddress) ||
      caller === getAddress(trade.adCreatorAddress);

    if (!isParty) throw new UnauthorizedException('Not a participant');

    // ensure that trade status is locked
    if (trade.status !== 'LOCKED') {
      throw new BadRequestException(
        `Trade status must be LOCKED to confirm, got ${trade.status}`,
      );
    }

    // check if caller has already submitted signature
    if (
      trade.participantSignatures &&
      trade.participantSignatures[caller] === dto.encodedSignature
    ) {
      return {
        status: trade.status,
        participantSignatures: trade.participantSignatures,
      };
    }

    // update the signature for caller
    const sigs: Prisma.JsonObject = JSON.parse(
      JSON.stringify(trade.participantSignatures || {}),
    ) as Prisma.JsonObject;

    sigs[caller] = dto.encodedSignature;

    const hasBridgerSig = !!sigs[getAddress(trade.bridgerAddress)];
    const hasCreatorSig = !!sigs[getAddress(trade.adCreatorAddress)];

    const newStatus = hasBridgerSig && hasCreatorSig ? 'AUTH_BOTH' : 'LOCKED';

    const updated = await this.prisma.trade.update({
      where: { id: trade.id },
      data: { participantSignatures: sigs, status: newStatus },
      select: { status: true, participantSignatures: true },
    });

    return {
      status: updated.status,
      participantSignatures: updated.participantSignatures,
    };
  }
}
