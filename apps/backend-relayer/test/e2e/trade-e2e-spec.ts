import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { createTestingApp } from '../setups/create-app';
import { seedAd, seedChain, seedRoute, seedToken } from '../setups/utils';
import { HDNodeWallet, TypedDataDomain, Wallet } from 'ethers';
import { SiweMessage } from 'siwe';

interface ChallengeResponse {
  nonce: string;
  address: string;
  expiresAt: string;
  domain: string;
  uri: string;
}

describe('Trades E2E ', () => {
  let app: INestApplication;
  const prisma = new PrismaClient();

  // --- helpers ---------------------------------------------------------

  const loginUser = async (wallet: HDNodeWallet) => {
    const challenge = await request(app.getHttpServer())
      .post('/v1/auth/challenge')
      .send({ address: wallet.address })
      .expect(200);

    const body = challenge.body as ChallengeResponse;

    const nowIso = new Date().toISOString();
    const expIso = new Date(Date.now() + 5 * 60_000).toISOString();

    const msg = new SiweMessage({
      domain: body.domain,
      address: wallet.address,
      statement: 'Sign in to ProofBridge',
      uri: body.uri,
      version: '1',
      chainId: 1,
      nonce: body.nonce,
      issuedAt: nowIso,
      expirationTime: expIso,
    });

    const message = msg.prepareMessage();
    const signature = await wallet.signMessage(message);

    const res = await request(app.getHttpServer())
      .post('/v1/auth/login')
      .send({ message, signature })
      .expect(201);

    return res.body.tokens.access as string;
  };

  const buildTypedData = (adChainId: bigint) =>
    ({
      name: 'ProofBridge',
      version: '1',
      chainId: Number(adChainId),
      verifyingContract: '0x0000000000000000000000000000000000000000',
    }) as TypedDataDomain;

  const types = {
    TradeIntent: [
      { name: 'routeId', type: 'string' },
      { name: 'adId', type: 'string' },
      { name: 'amount', type: 'uint256' },
      { name: 'adChainId', type: 'uint256' },
      { name: 'orderChainId', type: 'uint256' },
      { name: 'symbol', type: 'string' },
      { name: 'bridger', type: 'address' },
      { name: 'creator', type: 'address' },
      { name: 'idemKey', type: 'string' },
    ],
  } as const;

  const seedFixture = async () => {
    // unique-ish chain ids per test run to avoid collisions
    const base = await seedChain(prisma, {
      name: `Base_${Date.now()}`,
      chainId: BigInt(800000 + Math.floor(Math.random() * 1000)),
    });
    const eth = await seedChain(prisma, {
      name: `Ethereum_${Date.now()}`,
      chainId: BigInt(100 + Math.floor(Math.random() * 1000)),
    });
    const tBase = await seedToken(prisma, base.id, 'ETH');
    const tEth = await seedToken(prisma, eth.id, 'ETH');
    const route = await seedRoute(prisma, tBase.id, tEth.id);

    const creatorWallet = Wallet.createRandom();
    const bridgerWallet = Wallet.createRandom();
    const ad = await seedAd(
      prisma,
      creatorWallet.address,
      route.id,
      tBase.id,
      tEth.id,
      10_000,
    );

    const access = await loginUser(bridgerWallet);

    const domain = buildTypedData(base.chainId);
    const idem = 'idem-' + Math.random().toString(16).slice(2);
    const message = {
      routeId: route.id,
      adId: ad.id,
      amount: '1000',
      adChainId: base.chainId.toString(),
      orderChainId: eth.chainId.toString(),
      symbol: 'ETH',
      bridger: bridgerWallet.address,
      creator: creatorWallet.address,
      idemKey: idem,
    };

    const sigCreator = await creatorWallet.signTypedData(
      domain,
      types as any,
      message,
    );
    const sigBridger = await bridgerWallet.signTypedData(
      domain,
      types as any,
      message,
    );

    return {
      base,
      eth,
      route,
      ad,
      creatorWallet,
      bridgerWallet,
      access,
      idem,
      message,
      sigCreator,
      sigBridger,
    };
  };

  beforeAll(async () => {
    app = await createTestingApp();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  // --- tests -----------------------------------------------------------

  it('creates a trade (happy path)', async () => {
    const f = await seedFixture();

    const res = await request(app.getHttpServer())
      .post('/v1/trades')
      .set('Authorization', `Bearer ${f.access}`)
      .set('Idempotency-Key', f.idem)
      .send({
        adId: f.ad.id,
        routeId: f.route.id,
        amount: f.message.amount,
        adCreatorAddress: f.creatorWallet.address,
        bridgerAddress: f.bridgerWallet.address,
      })
      .expect(201);

    expect(res.body).toMatchObject({
      idempotentHit: false,
      trade: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        id: expect.any(String),
        status: 'CREATED',
        amount: '1000',
        adId: f.ad.id,
        routeId: f.route.id,
        adCreatorAddress: f.creatorWallet.address,
        bridgerAddress: f.bridgerWallet.address,
        participantSignatures: null,
        ad: {
          id: f.ad.id,
          creatorAddress: f.creatorWallet.address,
          routeId: f.route.id,
        },
        route: {
          id: f.route.id,
        },
      },
    });
  });

  it('replays with the same Idempotency-Key and returns the same trade', async () => {
    const f = await seedFixture();

    const first = await request(app.getHttpServer())
      .post('/v1/trades')
      .set('Authorization', `Bearer ${f.access}`)
      .send({
        adId: f.ad.id,
        routeId: f.route.id,
        amount: f.message.amount,
        adCreatorAddress: f.creatorWallet.address,
        bridgerAddress: f.bridgerWallet.address,
      })
      .expect(201);

    const tradeId = first.body.id as string;

    const replay = await request(app.getHttpServer())
      .post('/v1/trades')
      .set('Authorization', `Bearer ${f.access}`)
      .send({
        adId: f.ad.id,
        routeId: f.route.id,
        amount: f.message.amount,
        adCreatorAddress: f.creatorWallet.address,
        bridgerAddress: f.bridgerWallet.address,
      })
      .expect((res) => [200, 201].includes(res.status));

    expect(replay.body.id).toBe(tradeId);
  });

  it('lists trades with filters', async () => {
    const f = await seedFixture();

    const create = await request(app.getHttpServer())
      .post('/v1/trades')
      .set('Authorization', `Bearer ${f.access}`)
      .set('Idempotency-Key', f.idem)
      .send({
        adId: f.ad.id,
        routeId: f.route.id,
        amount: f.message.amount,
        adCreatorAddress: f.creatorWallet.address,
        bridgerAddress: f.bridgerWallet.address,
      })
      .expect(201);

    const tradeId = create.body.trade.id as string;

    const list = await request(app.getHttpServer())
      .get('/v1/trades')
      .query({
        routeId: f.route.id,
        adId: f.ad.id,
        bridgerAddress: f.bridgerWallet.address,
      })
      .expect(200);

    expect(list.body.data.map((t: any) => t.id)).toContain(tradeId);
  });

  it('gets a trade by id', async () => {
    const f = await seedFixture();

    const create = await request(app.getHttpServer())
      .post('/v1/trades')
      .set('Authorization', `Bearer ${f.access}`)
      .set('Idempotency-Key', f.idem)
      .send({
        adId: f.ad.id,
        routeId: f.route.id,
        amount: f.message.amount,
        adCreatorAddress: f.creatorWallet.address,
        bridgerAddress: f.bridgerWallet.address,
      })
      .expect(201);

    const tradeId = create.body.trade.id as string;

    const byId = await request(app.getHttpServer())
      .get(`/v1/trades/${tradeId}`)
      .expect(200);

    expect(byId.body.id).toBe(tradeId);
  });
});
