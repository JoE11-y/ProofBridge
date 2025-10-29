/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { createTestingApp } from '../setups/create-app';
import { Wallet } from 'ethers';
import { seedChain, seedToken, seedRoute, loginUser } from '../setups/utils';
import { randomUUID } from 'crypto';

describe('Ads E2E', () => {
  let app: INestApplication;
  const prisma = new PrismaClient();
  const userWallet = Wallet.createRandom();

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

  it('POST /v1/ads requires auth', async () => {
    await request(app.getHttpServer())
      .post('/v1/ads/create')
      .send({ routeId: 'r', poolAmount: '100' })
      .expect(403);
  });

  it('creates an ad, then fetches it', async () => {
    // seed chains/tokens/route (same symbol, cross-chain)
    const c1 = await seedChain(prisma);
    const c2 = await seedChain(prisma);
    const t1 = await seedToken(prisma, c1.id, 'ETH');
    const t2 = await seedToken(prisma, c2.id, 'ETH');
    const route = await seedRoute(prisma, t1.id, t2.id);

    // login
    const access = await loginUser(app, userWallet.privateKey as `0x${string}`);

    // create
    const create = await request(app.getHttpServer())
      .post('/v1/ads/create')
      .set('Authorization', `Bearer ${access}`)
      .send({
        routeId: route.id,
        creatorDstAddress: userWallet.address,
        fundAmount: '1000000000000000000',
      }) // 1 ETH
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
    const access = await loginUser(app, userWallet.privateKey as `0x${string}`);

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

  it('makes top-up request', async () => {
    const c1 = await seedChain(prisma);
    const c2 = await seedChain(prisma);
    const t1 = await seedToken(prisma, c1.id, 'ETH');
    const t2 = await seedToken(prisma, c2.id, 'ETH');
    const route = await seedRoute(prisma, t1.id, t2.id);

    // login
    const access = await loginUser(app, userWallet.privateKey as `0x${string}`);

    const create = await request(app.getHttpServer())
      .post('/v1/ads/create')
      .set('Authorization', `Bearer ${access}`)
      .send({ routeId: route.id, creatorDstAddress: userWallet.address })
      .expect(201);

    const adId = create.body.id as string;

    // top-up pool
    const topup = await request(app.getHttpServer())
      .patch(`/v1/ads/${adId}/fund`)
      .set('Authorization', `Bearer ${access}`)
      .send({ poolAmountTopUp: '500' })
      .expect(200);

    // returns a topup request
    expect(topup.body).toMatchObject({
      contractAddress: expect.any(String),
      signature: expect.any(String),
      authToken: expect.any(String),
      timeToExpire: expect.any(Number),
      adId: expect.any(String),
      amount: expect.any(String),
      reqHash: expect.any(String),
    });
  });

  it('updates minAmount and maxAmount', async () => {
    const c1 = await seedChain(prisma);
    const c2 = await seedChain(prisma);
    const t1 = await seedToken(prisma, c1.id, 'ETH');
    const t2 = await seedToken(prisma, c2.id, 'ETH');
    const route = await seedRoute(prisma, t1.id, t2.id);

    // login
    const access = await loginUser(app, userWallet.privateKey as `0x${string}`);

    const create = await request(app.getHttpServer())
      .post('/v1/ads/create')
      .set('Authorization', `Bearer ${access}`)
      .send({ routeId: route.id, creatorDstAddress: userWallet.address })
      .expect(201);

    const adId = create.body.id as string;

    // pause
    const update = await request(app.getHttpServer())
      .patch(`/v1/ads/${adId}/update`)
      .set('Authorization', `Bearer ${access}`)
      .send({ minAmount: '1000', maxAmount: '100000' })
      .expect(200);

    expect(update.body.minAmount).toBe('1000');
    expect(update.body.maxAmount).toBe('100000');
  });

  it('close (DELETE) marks ad CLOSED and GET shows it', async () => {
    const c1 = await seedChain(prisma);
    const c2 = await seedChain(prisma);
    const t1 = await seedToken(prisma, c1.id, 'ETH');
    const t2 = await seedToken(prisma, c2.id, 'ETH');
    const route = await seedRoute(prisma, t1.id, t2.id);

    // login
    const access = await loginUser(app, userWallet.privateKey as `0x${string}`);

    const create = await request(app.getHttpServer())
      .post('/v1/ads')
      .set('Authorization', `Bearer ${access}`)
      .send({ routeId: route.id, poolAmount: '1' })
      .expect(201);

    const adId = create.body.id as string;

    await request(app.getHttpServer())
      .post(`/v1/ads/${adId}/close`)
      .set('Authorization', `Bearer ${access}`)
      .send({ to: userWallet.address })
      .expect(200);

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
