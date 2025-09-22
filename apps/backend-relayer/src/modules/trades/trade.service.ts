import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import {
  AuthorizeTradeDto,
  ConfirmTradeActionDto,
  CreateTradeDto,
  QueryTradesDto,
} from './dto/trade.dto';
import { getAddress, isAddress } from 'ethers';
import { Request } from 'express';
import { ViemService } from '../../providers/viem/viem.service';
import { MMRService } from '../mmr/mmr.service';
import { ProofService } from '../../providers/noir/proof.service';
import { randomUUID } from 'crypto';
import { Prisma, TradeStatus } from '@prisma/client';
import { EncryptionService } from '@libs/encryption.service';

function toBI(s: string) {
  return BigInt(s);
}

@Injectable()
export class TradesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly viemService: ViemService,
    private readonly merkleService: MMRService,
    private readonly proofService: ProofService,
    private readonly encryptionService: EncryptionService,
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

    const where: Prisma.TradeWhereInput = {};

    if (q.routeId) where.routeId = q.routeId;
    if (q.adId) where.adId = q.adId;
    if (q.adCreatorAddress)
      where.adCreatorAddress = getAddress(q.adCreatorAddress);
    if (q.bridgerAddress) where.bridgerAddress = getAddress(q.bridgerAddress);

    if (q.fromTokenId || q.toTokenId) {
      where.route = {
        ...(q.fromTokenId && { fromTokenId: q.fromTokenId }),
        ...(q.toTokenId && { toTokenId: q.toTokenId }),
      };
    }

    if (q.minAmount || q.maxAmount) {
      where.amount = {
        ...(q.minAmount ? { gte: q.minAmount } : {}),
        ...(q.maxAmount ? { lte: q.maxAmount } : {}),
      } as Prisma.DecimalFilter;
    }

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
                    select: {
                      orderPortalAddress: true,
                      chainId: true,
                      mmrId: true,
                    },
                  },
                },
              },
              fromToken: {
                select: {
                  address: true,
                  chain: {
                    select: {
                      adManagerAddress: true,
                      chainId: true,
                    },
                  },
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

    const secret = this.proofService.generateSecret();
    const tradeId = randomUUID();
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
          salt: tradeId,
        },
      });

    // Persist in a single transaction: then AdLock
    const result = await this.prisma.$transaction(async (tx) => {
      const trade = await tx.trade.create({
        data: {
          id: tradeId,
          adId: ad.id,
          routeId: ad.route.id,
          amount: amount.toString(),
          adCreatorAddress: getAddress(ad.creatorAddress),
          adCreatorDstAddress: getAddress(ad.creatorDstAddress),
          bridgerAddress: getAddress(user.walletAddress),
          bridgerDstAddress: getAddress(dto.bridgerDstAddress),
          orderHash: reqContractDetails.orderHash,
        },
        select: { id: true, status: true },
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
          reqHash: reqContractDetails.reqHash,
          ctx: 'CREATEORDER',
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

      const encrypted = await this.encryptionService.encryptSecret(secret);

      await tx.secret.create({
        data: {
          tradeId: trade.id,
          iv: encrypted.iv,
          secretCipherText: encrypted.ciphertext,
          secretHash: encrypted.secretHash,
          authTag: encrypted.authTag,
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

    const trade = await this.prisma.trade.findFirst({
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
                    mmrId: true,
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
          bridger: getAddress(trade.bridgerAddress),
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
        reqHash: reqContractDetails.reqHash,
        ctx: 'LOCKORDER',
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

  async authorize(req: Request, id: string, dto: AuthorizeTradeDto) {
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
        adId: true,
        status: true,
        bridgerAddress: true,
        adCreatorAddress: true,
        bridgerDstAddress: true,
        adCreatorDstAddress: true,
        orderHash: true,
        amount: true,
        adCreatorClaimed: true,
        bridgerClaimed: true,
        route: {
          select: {
            fromToken: {
              select: {
                address: true,
                chain: {
                  select: {
                    adManagerAddress: true,
                    chainId: true,
                    mmrId: true,
                  },
                },
              },
            },
            toToken: {
              select: {
                address: true,
                chain: {
                  select: {
                    orderPortalAddress: true,
                    chainId: true,
                    mmrId: true,
                  },
                },
              },
            },
          },
        },
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

    const isAuthorized = this.viemService.verifyOrderSignature(
      caller as `0x${string}`,
      trade.orderHash as `0x${string}`,
      dto.signature as `0x${string}`,
    );

    if (!isAuthorized) {
      throw new BadRequestException('Invalid User Signature');
    }

    const isAdCreator = caller === getAddress(trade.adCreatorAddress);

    if (trade.adCreatorClaimed && isAdCreator) {
      throw new BadRequestException('Ad Creator has already authorized');
    }

    if (trade.bridgerClaimed && !isAdCreator) {
      throw new BadRequestException('Bridger has already authorized');
    }

    // get the secret
    const tradeSecret = await this.prisma.secret.findUnique({
      where: { tradeId: trade.id },
    });

    if (!tradeSecret) {
      throw new NotFoundException('Secret not found for trade');
    }

    let mmrId: string;
    if (isAdCreator) {
      mmrId = trade.route.toToken.chain.mmrId as string;
    } else {
      mmrId = trade.route.fromToken.chain.mmrId as string;
    }

    // get merkle proof
    const merkleProof = await this.merkleService.getMerkleProof(
      mmrId,
      trade.orderHash,
    );

    const localRoot = await this.merkleService.getRoot(mmrId);

    const onChainRoot = await this.viemService.fetchOnChainRoot(isAdCreator, {
      chainId: isAdCreator
        ? (trade.route.toToken.chain.chainId as bigint)
        : (trade.route.fromToken.chain.chainId as bigint),
      contractAddress: isAdCreator
        ? (trade.route.toToken.chain.mmrId as `0x${string}`)
        : (trade.route.fromToken.chain.mmrId as `0x${string}`),
    });

    if (onChainRoot.toLowerCase() !== localRoot.toLowerCase()) {
      throw new BadRequestException(
        'MMR root mismatch - chain is not up to date',
      );
    }

    const secret = this.encryptionService.decryptSecret({
      iv: tradeSecret.iv as string,
      ciphertext: tradeSecret.secretCipherText as string,
      authTag: tradeSecret.authTag as string,
    });

    const { proof } = await this.proofService.generateProof({
      merkleProof,
      orderHash: trade.orderHash as string,
      secret: secret,
      isAdCreator,
      targetRoot: onChainRoot,
    });

    const nullifierHash = await this.proofService.generateNullifierHash(
      secret,
      isAdCreator,
      trade.orderHash,
    );

    const requestContractDetails =
      await this.viemService.getUnlockOrderContractDetails({
        chainId: isAdCreator
          ? (trade.route.toToken.chain.chainId as bigint)
          : (trade.route.fromToken.chain.chainId as bigint),
        contractAddress: isAdCreator
          ? (trade.route.toToken.chain.orderPortalAddress as `0x${string}`)
          : (trade.route.fromToken.chain.adManagerAddress as `0x${string}`),
        isAdCreator,
        orderParams: {
          orderChainToken: trade.route.toToken.address as `0x${string}`,
          adChainToken: trade.route.fromToken.address as `0x${string}`,
          amount: trade.amount.toString(),
          bridger: getAddress(trade.bridgerAddress),
          orderChainId: trade.route.toToken.chain.chainId.toString() as string,
          orderPortal: trade.route.toToken.chain
            .orderPortalAddress as `0x${string}`,
          orderRecipient: getAddress(trade.bridgerDstAddress),
          adChainId: trade.route.fromToken.chain.chainId.toString() as string,
          adManager: trade.route.fromToken.chain
            .adManagerAddress as `0x${string}`,
          adId: trade.adId,
          adCreator: getAddress(trade.adCreatorAddress),
          adRecipient: getAddress(trade.adCreatorDstAddress),
          salt: trade.id,
        },
        nullifierHash: nullifierHash,
        targetRoot: onChainRoot,
        proof,
      });

    // create authorization log for tracking
    await this.prisma.authorizationLog.create({
      data: {
        origin: isAdCreator ? 'ORDER_PORTAL' : 'AD_MANAGER',
        tradeId: trade.id,
        userAddress: caller,
        signature: dto.signature,
        reqHash: requestContractDetails.reqHash,
      },
    });

    return requestContractDetails;
  }

  async confirmChainAction(
    req: Request,
    tradeId: string,
    dto: ConfirmTradeActionDto,
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
      getAddress(tradeLogUpdate.trade.bridgerAddress) !==
        getAddress(user.walletAddress) &&
      getAddress(tradeLogUpdate.trade.adCreatorAddress) !==
        getAddress(user.walletAddress)
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
                chain: {
                  select: {
                    adManagerAddress: true,
                    chainId: true,
                    mmrId: true,
                  },
                },
              },
            },
            toToken: {
              select: {
                chain: {
                  select: {
                    orderPortalAddress: true,
                    chainId: true,
                    mmrId: true,
                  },
                },
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

    if (tradeLogUpdate.ctx == 'LOCKORDER') {
      await this.merkleService.append(
        trade.route.fromToken.chain.mmrId,
        tradeLogUpdate.reqHash,
      );
    } else if (tradeLogUpdate.ctx == 'CREATEORDER') {
      await this.merkleService.append(
        trade.route.toToken.chain.mmrId,
        tradeLogUpdate.reqHash,
      );
    }

    let status: TradeStatus | undefined = undefined;
    let adLockAuthorized: boolean | undefined = undefined;

    tradeLogUpdate.log.forEach((entry) => {
      if (entry.field === 'Status') {
        status = entry.newValue as TradeStatus;
      } else if (entry.field === 'AdLock') {
        adLockAuthorized = entry.newValue === 'true';
      }
    });

    await this.prisma.trade.update({
      where: { id: tradeLogUpdate.tradeId },
      data: {
        status,
        adLock: adLockAuthorized
          ? { update: { authorized: adLockAuthorized } }
          : undefined,
      },
    });

    // delete the log entry
    await this.prisma.tradeUpdateLog.delete({
      where: { id: tradeLogUpdate.id },
    });

    return {
      success: true,
    };
  }

  async confirmAuthorizeAction(
    req: Request,
    tradeId: string,
    dto: ConfirmTradeActionDto,
  ) {
    const reqUser = req.user;

    if (!reqUser) throw new ForbiddenException('Unauthorized');

    const user = await this.prisma.user.findUnique({
      where: { id: reqUser.sub },
    });

    if (!user) throw new ForbiddenException('Unauthorized');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const authorizationLog = await this.prisma.authorizationLog.findFirst({
      where: {
        tradeId: tradeId,
        userAddress: getAddress(user.walletAddress),
      },
      orderBy: { createdAt: 'desc' },
      include: { trade: true },
    });

    if (!authorizationLog)
      throw new NotFoundException('Authorization log not found');

    if (
      getAddress(authorizationLog.trade.bridgerAddress) !==
        getAddress(user.walletAddress) &&
      getAddress(authorizationLog.trade.adCreatorAddress) !==
        getAddress(user.walletAddress)
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
                chain: {
                  select: {
                    adManagerAddress: true,
                    chainId: true,
                  },
                },
              },
            },
            toToken: {
              select: {
                chain: {
                  select: {
                    orderPortalAddress: true,
                    chainId: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!trade) throw new NotFoundException('Ad for Ad Id not found');

    if (authorizationLog.origin === 'AD_MANAGER') {
      // verify log
      const isValidated = await this.viemService.validateAdManagerRequest({
        chainId: trade.route.fromToken.chain.chainId,
        contractAddress: trade.route.fromToken.chain
          .adManagerAddress as `0x${string}`,
        msgHash: authorizationLog.reqHash as `0x${string}`,
      });

      if (!isValidated) {
        throw new BadRequestException('AdManager request not validated');
      }
    } else {
      // verify log
      const isValidated = await this.viemService.validateOrderPortalRequest({
        chainId: trade.route.toToken.chain.chainId,
        contractAddress: trade.route.toToken.chain
          .orderPortalAddress as `0x${string}`,
        msgHash: authorizationLog.reqHash as `0x${string}`,
      });

      if (!isValidated) {
        throw new BadRequestException('OrderPortal request not validated');
      }
    }

    const caller = getAddress(user.walletAddress);

    const isAdCreator =
      caller === getAddress(authorizationLog.trade.adCreatorAddress);

    await this.prisma.trade.update({
      where: { id: authorizationLog.tradeId as string },
      data: {
        adCreatorClaimed: isAdCreator
          ? (true as boolean)
          : (authorizationLog.trade.adCreatorClaimed as boolean),
        bridgerClaimed: !isAdCreator
          ? (true as boolean)
          : (authorizationLog.trade.bridgerClaimed as boolean),
      },
    });

    // delete the log entry
    await this.prisma.authorizationLog.delete({
      where: { id: authorizationLog.id as string },
    });

    console.log(dto);

    return {
      success: true,
    };
  }
}
