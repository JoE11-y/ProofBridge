/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { createTestingApp } from '../../test/utils/create-app';
import { HDNodeWallet, Wallet } from 'ethers';
import { seedChain, seedToken, seedRoute } from '../../test/utils/seed';
import { randomUUID } from 'crypto';
import { SiweMessage } from 'siwe';

interface ChallengeResponse {
  nonce: string;
  address: string;
  expiresAt: string;
  domain: string;
  uri: string;
}

describe('Ads E2E', () => {
  let app: INestApplication;
  const prisma = new PrismaClient();
  const userWallet = Wallet.createRandom();

  // login to get access token
  const loginUser = async (wallet: HDNodeWallet) => {
    // make challenge request
    const challenge = await request(app.getHttpServer())
      .post('/v1/auth/challenge')
      .send({ address: wallet.address })
      .expect(200);

    const body = challenge.body as ChallengeResponse;

    const nowIso = new Date().toISOString();
    const expIso = new Date(Date.now() + 5 * 60_000).toISOString();

    // build SIWE message
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

    // sign message with wallet
    const signature = await wallet.signMessage(message);

    // send to login
    const res = await request(app.getHttpServer())
      .post('/v1/auth/login')
      .send({ message, signature })
      .expect(201);

    return res.body.tokens.access as string;
  };

  beforeAll(async () => {
    // Secrets for tests (align with your env loader)
    app = await createTestingApp();

    // clean tables
    await prisma.adLock.deleteMany({});
    await prisma.ad.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('GET /v1/ads returns empty initially', async () => {
    const res = await request(app.getHttpServer()).get('/v1/ads').expect(200);

    expect(res.body).toEqual({ data: [], nextCursor: null });
  });

  it('POST /v1/ads requires auth', async () => {
    await request(app.getHttpServer())
      .post('/v1/ads')
      .send({ routeId: 'r', poolAmount: '100' })
      .expect(403);
  });

  it('creates an ad, then fetches it', async () => {
    // seed chains/tokens/route (same symbol, cross-chain)
    const base = await seedChain(prisma, { name: 'Basers', chainId: 845334n });
    const eth = await seedChain(prisma, { name: 'Ethereum89', chainId: 165n });
    const tBase = await seedToken(prisma, base.id, 'ETH');
    const tEth = await seedToken(prisma, eth.id, 'ETH');
    const route = await seedRoute(prisma, tBase.id, tEth.id);

    // login
    const access = await loginUser(userWallet);

    // create
    const create = await request(app.getHttpServer())
      .post('/v1/ads')
      .set('Authorization', `Bearer ${access}`)
      .send({ routeId: route.id, poolAmount: '1000000000000000000' }) // 1 ETH
      .expect(201);

    expect(create.body).toMatchObject({
      id: expect.any(String),
      creatorAddress: userWallet.address,
      routeId: route.id,
      poolAmount: '1000000000000000000',
      availableAmount: '1000000000000000000',
      status: 'ACTIVE',
    });

    const adId = create.body.id as string;

    // get by id
    const byId = await request(app.getHttpServer())
      .get(`/v1/ads/${adId}`)
      .expect(200);

    expect(byId.body.id).toBe(adId);
    expect(byId.body.availableAmount).toBe('1000000000000000000');
  });

  it('lists by routeId/creatorAddress filters', async () => {
    const base = await seedChain(prisma, { name: 'Base29', chainId: 80454n });
    const eth = await seedChain(prisma, { name: 'Ethereum29', chainId: 25n });
    const tBase = await seedToken(prisma, base.id, 'ETH');
    const tEth = await seedToken(prisma, eth.id, 'ETH');
    const route = await seedRoute(prisma, tBase.id, tEth.id);

    // login
    const access = await loginUser(userWallet);

    // create ad
    const created = await request(app.getHttpServer())
      .post('/v1/ads')
      .set('Authorization', `Bearer ${access}`)
      .send({ routeId: route.id, poolAmount: '250' })
      .expect(201);

    // filter by routeId
    const byRoute = await request(app.getHttpServer())
      .get('/v1/ads')
      .query({ routeId: route.id })
      .expect(200);
    expect(byRoute.body.data.map((a: any) => a.id)).toContain(created.body.id);

    // filter by creator
    const byCreator = await request(app.getHttpServer())
      .get('/v1/ads')
      .query({ creatorAddress: userWallet.address })
      .expect(200);
    expect(byCreator.body.data.map((a: any) => a.id)).toContain(
      created.body.id,
    );
  });

  it('updates (top-up) and pauses an ad', async () => {
    const base = await seedChain(prisma, { name: 'Base33', chainId: 845532n });
    const eth = await seedChain(prisma, { name: 'Ethereum32', chainId: 32n });
    const tBase = await seedToken(prisma, base.id, 'ETH');
    const tEth = await seedToken(prisma, eth.id, 'ETH');
    const route = await seedRoute(prisma, tBase.id, tEth.id);

    // login
    const access = await loginUser(userWallet);

    const create = await request(app.getHttpServer())
      .post('/v1/ads')
      .set('Authorization', `Bearer ${access}`)
      .send({ routeId: route.id, poolAmount: '1000' })
      .expect(201);

    const adId = create.body.id as string;

    // top-up pool
    const topup = await request(app.getHttpServer())
      .patch(`/v1/ads/${adId}`)
      .set('Authorization', `Bearer ${access}`)
      .send({ poolAmountTopUp: '500' })
      .expect(200);

    expect(topup.body.poolAmount).toBe('1500');
    expect(topup.body.availableAmount).toBe('1500');

    // pause
    const paused = await request(app.getHttpServer())
      .patch(`/v1/ads/${adId}`)
      .set('Authorization', `Bearer ${access}`)
      .send({ status: 'PAUSED' })
      .expect(200);

    expect(paused.body.status).toBe('PAUSED');

    // list by status
    const listPaused = await request(app.getHttpServer())
      .get('/v1/ads')
      .query({ status: 'PAUSED' })
      .expect(200);
    expect(listPaused.body.data.map((a: any) => a.id)).toContain(adId);
  });

  it('close (DELETE) marks ad CLOSED and GET shows it', async () => {
    const base = await seedChain(prisma, { name: 'Base43', chainId: 844532n });
    const eth = await seedChain(prisma, { name: 'Ethereum42', chainId: 432n });
    const tBase = await seedToken(prisma, base.id, 'ETH');
    const tEth = await seedToken(prisma, eth.id, 'ETH');
    const route = await seedRoute(prisma, tBase.id, tEth.id);

    // login
    const access = await loginUser(userWallet);

    const create = await request(app.getHttpServer())
      .post('/v1/ads')
      .set('Authorization', `Bearer ${access}`)
      .send({ routeId: route.id, poolAmount: '1' })
      .expect(201);

    const adId = create.body.id as string;

    await request(app.getHttpServer())
      .delete(`/v1/ads/${adId}`)
      .set('Authorization', `Bearer ${access}`)
      .expect(204);

    const byId = await request(app.getHttpServer())
      .get(`/v1/ads/${adId}`)
      .expect(200);
    expect(byId.body.status).toBe('CLOSED');
  });

  it('404 on unknown ad id', async () => {
    const randomUid = randomUUID();
    await request(app.getHttpServer()).get(`/v1/ads/${randomUid}`).expect(404);
  });
});
