import { INestApplication } from '@nestjs/common';
import { ethers } from 'ethers';
import request from 'supertest';
import { SiweMessage } from 'siwe';
import { PrismaClient } from '@prisma/client';
import { hash } from '@node-rs/argon2';
import { privateKeyToAddress, signMessage } from 'viem/accounts';
import {
  createPublicClient,
  createWalletClient,
  http,
  PublicClient,
} from 'viem';
import { parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { ethLocalnet } from '../../src/providers/viem/localnet';
import { hederaTestnet } from 'viem/chains';

export type AddressLike = `0x${string}`;

export interface ChainData {
  adManagerAddress: AddressLike;
  orderPortalAddress: AddressLike;
  merkleManagerAddress: AddressLike;
  verifierAddress: AddressLike;
  chainId: string;
  name: string;
  tokenName: string;
  tokenSymbol: string;
  tokenAddress: AddressLike;
}

export interface ChallengeResponse {
  nonce: string;
  address: AddressLike;
  expiresAt: string;
  domain: string;
  uri: string;
}

export const loginUser = async (
  app: INestApplication<any>,
  privateKey: `0x${string}`,
) => {
  const address = privateKeyToAddress(privateKey);

  // make challenge request
  const challenge = await request(app.getHttpServer())
    .post('/v1/auth/challenge')
    .send({ address })
    .expect(200);

  const body = challenge.body as ChallengeResponse;

  const nowIso = new Date().toISOString();
  const expIso = new Date(Date.now() + 5 * 60_000).toISOString();

  // build SIWE message
  const msg = new SiweMessage({
    domain: body.domain,
    address: address,
    statement: 'Sign in to ProofBridge',
    uri: body.uri,
    version: '1',
    chainId: 1,
    nonce: body.nonce,
    issuedAt: nowIso,
    expirationTime: expIso,
  });

  const message = msg.prepareMessage();

  // sign message with wallet
  const signature = await signMessage({ message, privateKey });

  // send to login
  const res = await request(app.getHttpServer())
    .post('/v1/auth/login')
    .send({ message, signature })
    .expect(201);

  return res.body.tokens.access as string;
};

export const loginAsAdmin = async (app: INestApplication<any>) => {
  const res = await request(app.getHttpServer())
    .post('/v1/admin/login')
    .send({ email: 'admin@x.com', password: 'ChangeMe123!' })
    .expect(200);
  return res.body.tokens.access as string;
};

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
  name: string = 'Ether',
  symbol = 'ETH',
  address?: string,
) => {
  return prisma.token.create({
    data: {
      chainUid: chainUuid,
      symbol,
      name: name,
      address: address ?? randomAddress(),
      decimals: 18,
      kind: 'ERC20',
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
  const name = params?.name ?? `Chain-${Math.floor(Math.random() * 10000)}`;
  const chainId = params?.chainId ?? BigInt(Math.floor(Math.random() * 10000));
  const ad = params?.ad ?? randomAddress();
  const op = params?.op ?? randomAddress();

  return prisma.chain.create({
    data: {
      name,
      chainId: chainId,
      adManagerAddress: ad,
      orderPortalAddress: op,
      mmr: {
        create: {
          chainId: chainId.toString(),
        },
      },
    },
    select: { id: true, name: true, chainId: true },
  });
};

export const seedAdmin = async (
  prisma: PrismaClient,
  email: string,
  password: string,
) => {
  const passwordHash = await hash(password);
  return prisma.admin.create({
    data: { email, passwordHash },
  });
};

export const seedAd = async (
  prisma: PrismaClient,
  creator: string,
  routeId: string,
  fromTokenId: string,
  toTokenId: string,
  pool = 1_000_000,
) =>
  prisma.ad.create({
    data: {
      creatorAddress: creator,
      routeId,
      fromTokenId,
      toTokenId,
      poolAmount: pool,
      status: 'INACTIVE',
      creatorDstAddress: creator,
    },
    select: { id: true, creatorAddress: true, routeId: true },
  });

export function randomAddress() {
  const wallet = ethers.Wallet.createRandom();
  return wallet.address;
}

export const makeEthClient = () =>
  createPublicClient({ chain: ethLocalnet, transport: http() });

export const makeHederaClient = () =>
  createPublicClient({ chain: hederaTestnet, transport: http() });

async function tryTopUpViaRpc(addr: AddressLike, hexWei: string) {
  const ethRpc = process.env.ETHEREUM_RPC_URL ?? 'http://localhost:9545';

  const provider = new ethers.JsonRpcProvider(ethRpc);
  try {
    await provider.send('anvil_setBalance', [addr, hexWei]);
    return true;
  } catch {
    // ignore
  }

  try {
    await provider.send('hardhat_setBalance', [addr, hexWei]);
    return true;
  } catch {
    // ignore
  }

  return false;
}

export async function fundEthAddress(
  client: PublicClient,
  to: AddressLike,
  minBalanceEther = '1.0',
): Promise<void> {
  const needed = parseEther(minBalanceEther);
  const current = await client.getBalance({ address: to });
  if (current >= needed) return;

  const funderKey = process.env.FUNDER_KEY as `0x${string}` | undefined;

  if (funderKey) {
    const wallet = createWalletClient({
      chain: client.chain ?? ethLocalnet,
      transport: http(),
      account: privateKeyToAccount(funderKey),
    });

    const hash = await wallet.sendTransaction({
      to,
      value: parseEther('10'), // send 10 ETH
    });
    await client.waitForTransactionReceipt({ hash });
    return;
  }

  // No FUNDER_KEY; attempt node-specific balance set
  const ok = await tryTopUpViaRpc(to, '0x8AC7230489E80000'); // 10 ETH
  if (!ok) {
    throw new Error(
      'Unable to fund address. Set FUNDER_KEY in env, or run against Anvil/Hardhat and allow *_setBalance.',
    );
  }
}

export async function fundHBar(
  client: PublicClient,
  to: AddressLike,
  minBalanceEther = '3.0',
): Promise<void> {
  const needed = parseEther(minBalanceEther);

  const current = await client.getBalance({ address: to });
  if (current >= needed) return;

  const managerKey = process.env.MANAGER_KEY as `0x${string}` | undefined;

  if (!managerKey) {
    throw new Error('Manager address not set');
  }

  console.log('funding with hbar', to);

  const wallet = createWalletClient({
    chain: client.chain ?? hederaTestnet,
    transport: http(),
    account: privateKeyToAccount(managerKey),
  });

  const hash = await wallet.sendTransaction({
    to,
    value: parseEther('10'), // send 10 ETH
  });

  await client.waitForTransactionReceipt({ hash });
}

export const expectObject = (
  obj: any,
  fields: Partial<Record<string, any>>,
) => {
  for (const [k, v] of Object.entries(fields)) expect(obj[k]).toEqual(v);
};
