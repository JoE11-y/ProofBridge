import { PrismaClient } from '@prisma/client';
import { ethers } from 'ethers';
import * as argon2 from '@node-rs/argon2';

export const seedRoute = async (
  prisma: PrismaClient,
  fromTokenId: string,
  toTokenId: string,
) => {
  return prisma.route.create({
    data: { fromTokenId, toTokenId },
    select: { id: true },
  });
};

export const seedToken = async (
  prisma: PrismaClient,
  chainUuid: string,
  symbol = 'ETH',
) => {
  const wallet = ethers.Wallet.createRandom();
  return prisma.token.create({
    data: {
      chainUid: chainUuid,
      symbol,
      name: symbol === 'ETH' ? 'Ether' : symbol,
      address: wallet.address,
      decimals: 18,
      kind: 'NATIVE',
    },
    select: { id: true, symbol: true, chain: true },
  });
};

export const seedChain = async (
  prisma: PrismaClient,
  params?: Partial<{
    name: string;
    chainId: bigint;
    ad: string;
    op: string;
  }>,
) => {
  const name = params?.name ?? 'Hedera';
  const chainId = params?.chainId ?? 246n;
  const ad = params?.ad ?? '0xAdManager000000000000000000000000001234';
  const op = params?.op ?? '0xOrderPortal00000000000000000000000001234';
  return prisma.chain.create({
    data: {
      name,
      chainId: chainId,
      adManagerAddress: ad,
      orderPortalAddress: op,
    },
    select: { id: true, name: true, chainId: true },
  });
};

export const seedAdmin = async (
  email: string,
  password: string,
  prisma: PrismaClient,
) => {
  const passwordHash = await argon2.hash(password);
  return prisma.admin.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });
};

export const seedAd = async (
  prisma: PrismaClient,
  creator: string,
  routeId: string,
  fromTokenId: string,
  toTokenId: string,
  pool = 1_000_000n,
) =>
  prisma.ad.create({
    data: {
      creatorAddress: creator,
      routeId,
      fromTokenId,
      toTokenId,
      poolAmount: pool,
      status: 'ACTIVE',
    },
    select: { id: true, creatorAddress: true, routeId: true },
  });
