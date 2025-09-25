import { PrismaClient } from '@prisma/client';
import { ChainData, seedAdmin, seedChain, seedToken } from './utils';

export const seedDB = async (
  ethContracts: ChainData,
  hederaContracts: ChainData,
) => {
  const prisma = new PrismaClient();

  try {
    await prisma.$connect();

    await seedAdmin(prisma, 'admin@x.com', 'ChangeMe123!');

    const chain1 = await seedChain(prisma, {
      name: ethContracts.name,
      chainId: BigInt(ethContracts.chainId),
      ad: ethContracts.adManagerAddress,
      op: ethContracts.orderPortalAddress,
    });

    const chain2 = await seedChain(prisma, {
      name: hederaContracts.name,
      chainId: BigInt(hederaContracts.chainId),
      ad: hederaContracts.adManagerAddress,
      op: hederaContracts.orderPortalAddress,
    });

    const token1 = await seedToken(
      prisma,
      chain1.id,
      ethContracts.tokenName,
      ethContracts.tokenSymbol,
      ethContracts.tokenAddress,
    );

    const token2 = await seedToken(
      prisma,
      chain2.id,
      hederaContracts.tokenName,
      hederaContracts.tokenSymbol,
      hederaContracts.tokenAddress,
    );

    // Create route in both directions
    await prisma.route.createMany({
      data: [
        {
          adTokenId: token1.id,
          orderTokenId: token2.id,
        },
        {
          adTokenId: token2.id,
          orderTokenId: token1.id,
        },
      ],
    });

    await prisma.$disconnect();

    console.log('Seeding completed.');
  } catch (error) {
    console.error('Error seeding db:', error);
  } finally {
    await prisma.$disconnect();
  }
};
