/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestingApp } from './setups/create-app';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { seedAdmin } from './setups/seed';

interface ChainResponse {
  id: string;
  name: string;
  chainId: string;
  adManagerAddress: string;
  orderPortalAddress: string;
}

describe('Chains E2E', () => {
  let app: INestApplication;
  const prisma = new PrismaClient();

  beforeAll(async () => {
    app = await createTestingApp();
    await seedAdmin('admin@x.com', 'ChangeMe123!', prisma);
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  const loginAsAdmin = async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/admin/login')
      .send({ email: 'admin@x.com', password: 'ChangeMe123!' })
      .expect(200);
    return res.body.tokens.access as string;
  };

  it('POST /v1/chains requires auth', async () => {
    await request(app.getHttpServer())
      .post('/v1/admin/chains/create')
      .send({
        name: 'Base',
        chainId: '8453',
        adManagerAddress: '0xAM',
        orderPortalAddress: '0xOP',
      })
      .expect(403);
  });

  describe('Chain CRUD operations', () => {
    let token: string;
    const chainId: string = '8453';
    let chainUUID: string;

    beforeEach(async () => {
      token = await loginAsAdmin();
    });

    it('creates a new chain', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/admin/chains/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Base',
          chainId: '8453',
          adManagerAddress: '0xAdMgr',
          orderPortalAddress: '0xOrderPortal',
        })
        .expect(201);

      const created = res.body as ChainResponse;
      chainUUID = created.id;

      expect(created).toMatchObject({
        id: expect.any(String),
        name: 'Base',
        chainId: '8453',
        adManagerAddress: '0xAdMgr',
        orderPortalAddress: '0xOrderPortal',
      });
    });

    it('gets chain by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/v1/chains/${chainId}`)
        .expect(200);
      expect(res.body).toMatchObject({ chainId: chainId, name: 'Base' });
    });

    it('lists chains with chainId filter', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/chains')
        .query({ chainId: '8453' })
        .expect(200);
      expect(res.body.rows).toEqual(
        expect.arrayContaining([expect.objectContaining({ chainId: chainId })]),
      );
    });

    it('updates chain details', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/v1/admin/chains/${chainUUID}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ adManagerAddress: '0xAdMgrUpdated' })
        .expect(200);
      expect(res.body.adManagerAddress).toBe('0xAdMgrUpdated');
    });

    it('fails to update chain without auth', async () => {
      await request(app.getHttpServer())
        .patch(`/v1/admin/chains/${chainUUID}`)
        .send({ adManagerAddress: '0xAdMgrUpdated' })
        .expect(403);
    });

    it('fails to update non-existent chain', async () => {
      const fakeUUID = randomUUID();
      await request(app.getHttpServer())
        .patch(`/v1/admin/chains/${fakeUUID}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ adManagerAddress: '0xAdMgrUpdated' })
        .expect(404);
    });

    it('deletes a chain', async () => {
      await request(app.getHttpServer())
        .delete(`/v1/admin/chains/${chainUUID}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);

      await request(app.getHttpServer())
        .get(`/v1/chains/${chainId}`)
        .expect(404);
    });

    it('fails to delete non-existent chain', async () => {
      const fakeUUID = randomUUID();
      await request(app.getHttpServer())
        .delete(`/v1/admin/chains/${fakeUUID}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});
