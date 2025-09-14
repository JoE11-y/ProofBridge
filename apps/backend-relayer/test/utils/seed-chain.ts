import { PrismaClient } from '@prisma/client';
export const seedChain = async (
  prisma: PrismaClient,
  params?: Partial<{
    name: string;
    onchainId: bigint;
    ad: string;
    op: string;
  }>,
) => {
  const name = params?.name ?? 'Hedera';
  const onchainId = params?.onchainId ?? 246n;
  const ad = params?.ad ?? '0xAdManager000000000000000000000000001234';
  const op = params?.op ?? '0xOrderPortal00000000000000000000000001234';
  return prisma.chain.create({
    data: {
      name,
      chainId: onchainId,
      adManagerAddress: ad,
      orderPortalAddress: op,
    },
    select: { id: true, name: true, chainId: true },
  });
};
