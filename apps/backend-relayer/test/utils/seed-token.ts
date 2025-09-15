import { PrismaClient } from '@prisma/client';
import { ethers } from 'ethers';

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
