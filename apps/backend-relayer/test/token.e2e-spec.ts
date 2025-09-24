/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { createTestingApp } from './setups/create-app';
import { loginAsAdmin, randomAddress, seedChain } from './setups/utils';
import { getAddress } from 'ethers';

describe('Tokens E2E', () => {
  let app: INestApplication;
  const prisma = new PrismaClient();
  let chain: { id: string; name: string; chainId: bigint };

  beforeAll(async () => {
    app = await createTestingApp();
    chain = await seedChain(prisma);
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('POST /v1/admin/tokens/create requires admin auth', async () => {
    await request(app.getHttpServer())
      .post('/v1/admin/tokens/create')
      .send({
        chainUid: 'not-used',
        symbol: 'ETH',
        name: 'Ether',
        address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        decimals: 18,
        kind: 'NATIVE',
      })
      .expect(403);
  });

  it('creates a token (POST /v1/tokens)', async () => {
    const access = await loginAsAdmin(app);
    const address = randomAddress();
    const res = await request(app.getHttpServer())
      .post('/v1/admin/tokens/create')
      .set('Authorization', `Bearer ${access}`)
      .send({
        chainUid: chain.id,
        symbol: 'ETH',
        name: 'Ether',
        address: address,
        decimals: 18,
        kind: 'NATIVE',
      })
      .expect(201);

    expect(res.body).toMatchObject({
      id: expect.any(String),
      symbol: 'ETH',
      name: 'Ether',
      decimals: 18,
      kind: 'NATIVE',
      address: getAddress(address),
      chain: {
        id: chain.id,
        name: chain.name,
        chainId: chain.chainId.toString(),
      },
    });
  });

  it('gets a token by id (GET /v1/tokens/:id)', async () => {
    const access = await loginAsAdmin(app);
    const create = await request(app.getHttpServer())
      .post('/v1/admin/tokens/create')
      .set('Authorization', `Bearer ${access}`)
      .send({
        chainUid: chain.id,
        symbol: 'ETH',
        name: 'Ether',
        address: randomAddress(),
        decimals: 18,
        kind: 'NATIVE',
      })
      .expect(201);

    const tokId = create.body.id as string;

    const byId = await request(app.getHttpServer())
      .get(`/v1/tokens/${tokId}`)
      .expect(200);
    expect(byId.body.id).toBe(tokId);
  });

  it('lists by chain ID (GET /v1/tokens?chainId=)', async () => {
    const access = await loginAsAdmin(app);
    const ids: string[] = [];

    for (let i = 0; i < 2; i++) {
      const r = await request(app.getHttpServer())
        .post('/v1/admin/tokens/create')
        .set('Authorization', `Bearer ${access}`)
        .send({
          chainUid: chain.id,
          symbol: `ETH${i + 1}`,
          name: `Ether ${i + 1}`,
          address: randomAddress(),
          decimals: 18,
          kind: 'NATIVE',
        })
        .expect(201);
      ids.push(r.body.id);
    }

    const list = await request(app.getHttpServer())
      .get('/v1/tokens')
      .query({ chainUid: chain.id })
      .expect(200);

    const returnedIds = list.body.data.map((t: any) => t.id);
    expect(returnedIds).toEqual(expect.arrayContaining(ids));
  });

  it('lists by symbol (GET /v1/tokens?symbol=)', async () => {
    const access = await loginAsAdmin(app);
    const wanted = await request(app.getHttpServer())
      .post('/v1/admin/tokens/create')
      .set('Authorization', `Bearer ${access}`)
      .send({
        chainUid: chain.id,
        symbol: 'ETH',
        name: 'Ether',
        address: randomAddress(),
        decimals: 18,
        kind: 'NATIVE',
      })
      .expect(201);

    const list = await request(app.getHttpServer())
      .get('/v1/tokens')
      .query({ symbol: 'eth' }) // case-insensitive contains
      .expect(200);

    const ids = list.body.data.map((t: any) => t.id);
    expect(ids).toContain(wanted.body.id);
  });

  it('lists by address (GET /v1/tokens?address=)', async () => {
    const access = await loginAsAdmin(app);
    const address = randomAddress();
    const created = await request(app.getHttpServer())
      .post('/v1/admin/tokens/create')
      .set('Authorization', `Bearer ${access}`)
      .send({
        chainUid: chain.id,
        symbol: 'ETH',
        name: 'Ether',
        address,
        decimals: 18,
        kind: 'NATIVE',
      })
      .expect(201);

    const list = await request(app.getHttpServer())
      .get('/v1/tokens')
      .query({ address })
      .expect(200);

    const ids = list.body.data.map((t: any) => t.id);
    expect(ids).toContain(created.body.id);
  });

  it('updates a token (PATCH /v1/admin/tokens/:id)', async () => {
    const access = await loginAsAdmin(app);
    const create = await request(app.getHttpServer())
      .post('/v1/admin/tokens/create')
      .set('Authorization', `Bearer ${access}`)
      .send({
        chainUid: chain.id,
        symbol: 'ETH',
        name: 'Ether',
        address: randomAddress(),
        decimals: 18,
        kind: 'NATIVE',
      })
      .expect(201);

    const tokId = create.body.id as string;

    const updated = await request(app.getHttpServer())
      .patch(`/v1/admin/tokens/${tokId}`)
      .set('Authorization', `Bearer ${access}`)
      .send({ name: 'Ether Main' })
      .expect(200);

    expect(updated.body.name).toBe('Ether Main');
  });

  it('deletes a token (DELETE /v1/admin/tokens/:id) and then 404 on GET', async () => {
    const access = await loginAsAdmin(app);
    const create = await request(app.getHttpServer())
      .post('/v1/admin/tokens/create')
      .set('Authorization', `Bearer ${access}`)
      .send({
        chainUid: chain.id,
        symbol: 'ETH',
        name: 'Ether',
        address: randomAddress(),
        decimals: 18,
        kind: 'NATIVE',
      })
      .expect(201);
    const tokId = create.body.id as string;

    await request(app.getHttpServer())
      .delete(`/v1/admin/tokens/${tokId}`)
      .set('Authorization', `Bearer ${access}`)
      .expect(204);

    await request(app.getHttpServer()).get(`/v1/tokens/${tokId}`).expect(404);
  });
});
