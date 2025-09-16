import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { createTestingApp } from './setups/create-app';
import { seedAdmin, seedChain, seedToken } from './setups/seed';
import { randomUUID } from 'crypto';

describe('Routes E2E', () => {
  let app: INestApplication;
  const prisma = new PrismaClient();

  const loginAsAdmin = async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/admin/login')
      .send({ email: 'admin@x.com', password: 'ChangeMe123!' })
      .expect(200);
    return res.body.tokens.access as string;
  };

  beforeAll(async () => {
    app = await createTestingApp();
    await seedAdmin('admin@x.com', 'ChangeMe123!', prisma);
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('POST /v1/routes requires admin auth', async () => {
    await request(app.getHttpServer())
      .post('/v1/admin/routes/create')
      .send({ fromTokenId: 't1', toTokenId: 't2' })
      .expect(403);
  });

  it('creates a route, fetches it, lists by token ids', async () => {
    const access = await loginAsAdmin();

    const base = await seedChain(prisma, { name: 'Base2', chainId: 84532n });
    const main = await seedChain(prisma, { name: 'Ethereum13', chainId: 13n });

    const tBase = await seedToken(prisma, base.id, 'ETH');
    const tMain = await seedToken(prisma, main.id, 'ETH');

    // create
    const create = await request(app.getHttpServer())
      .post('/v1/admin/routes/create')
      .set('Authorization', `Bearer ${access}`)
      .send({
        fromTokenId: tBase.id,
        toTokenId: tMain.id,
      })
      .expect(201);

    expect(create.body).toMatchObject({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      id: expect.any(String),
      fromToken: {
        id: tBase.id,
        symbol: 'ETH',
        chain: { chainId: base.chainId.toString() },
      },
      toToken: {
        id: tMain.id,
        symbol: 'ETH',
        chain: { chainId: main.chainId.toString() },
      },
    });

    const routeId = create.body.id as string;

    // get by id
    const byId = await request(app.getHttpServer())
      .get(`/v1/routes/${routeId}`)
      .expect(200);
    expect(byId.body.id).toBe(routeId);

    // list by direct token ids
    const list = await request(app.getHttpServer())
      .get('/v1/routes')
      .query({ fromTokenId: tBase.id, toTokenId: tMain.id })
      .expect(200);
    expect(list.body.data.map((r: any) => r.id)).toContain(routeId);
  });

  it('lists by chain onchain ids + symbol', async () => {
    const base = await seedChain(prisma, { name: 'Base2', chainId: 18454n });
    const main = await seedChain(prisma, { name: 'Ethereum12', chainId: 12n });
    const tBase = await seedToken(prisma, base.id, 'ETH');
    const tMain = await seedToken(prisma, main.id, 'ETH');

    const access = await loginAsAdmin();
    const created = await request(app.getHttpServer())
      .post('/v1/admin/routes/create')
      .set('Authorization', `Bearer ${access}`)
      .send({ fromTokenId: tBase.id, toTokenId: tMain.id })
      .expect(201);

    const list = await request(app.getHttpServer())
      .get('/v1/routes')
      .query({
        fromChainId: base.chainId.toString(),
        toChainId: main.chainId.toString(),
        symbol: 'ETH',
      })
      .expect(200);

    expect(list.body.data.map((r: any) => r.id)).toContain(created.body.id);
  });

  it('rejects creation of self-route (400)', async () => {
    const access = await loginAsAdmin();
    const ch = await seedChain(prisma, { name: 'ChainX', chainId: 12345n });
    const tok = await seedToken(prisma, ch.id, 'ETH');

    await request(app.getHttpServer())
      .post('/v1/admin/routes/create')
      .set('Authorization', `Bearer ${access}`)
      .send({ fromTokenId: tok.id, toTokenId: tok.id })
      .expect(400);
  });

  it('rejects duplicate route (409)', async () => {
    const access = await loginAsAdmin();
    const c1 = await seedChain(prisma, { name: 'C1', chainId: 7000n });
    const c2 = await seedChain(prisma, { name: 'C2', chainId: 7001n });
    const t1 = await seedToken(prisma, c1.id, 'ETH');
    const t2 = await seedToken(prisma, c2.id, 'ETH');

    await request(app.getHttpServer())
      .post('/v1/admin/routes/create')
      .set('Authorization', `Bearer ${access}`)
      .send({ fromTokenId: t1.id, toTokenId: t2.id })
      .expect(201);

    await request(app.getHttpServer())
      .post('/v1/admin/routes/create')
      .set('Authorization', `Bearer ${access}`)
      .send({ fromTokenId: t1.id, toTokenId: t2.id })
      .expect(409);
  });

  it('DELETE /v1/routes/:id requires admin auth', async () => {
    const random = randomUUID();
    await request(app.getHttpServer())
      .delete(`/v1/admin/routes/${random}`)
      .expect(403);
  });

  it('deletes a route then 404 on get', async () => {
    const access = await loginAsAdmin();
    const c1 = await seedChain(prisma, { name: 'D1', chainId: 8100n });
    const c2 = await seedChain(prisma, { name: 'D2', chainId: 8101n });
    const t1 = await seedToken(prisma, c1.id, 'ETH');
    const t2 = await seedToken(prisma, c2.id, 'ETH');

    const created = await request(app.getHttpServer())
      .post('/v1/admin/routes/create')
      .set('Authorization', `Bearer ${access}`)
      .send({ fromTokenId: t1.id, toTokenId: t2.id })
      .expect(201);

    const id = created.body.id as string;

    await request(app.getHttpServer())
      .delete(`/v1/admin/routes/${id}`)
      .set('Authorization', `Bearer ${access}`)
      .expect(204);

    await request(app.getHttpServer()).get(`/v1/routes/${id}`).expect(404);
  });
});
