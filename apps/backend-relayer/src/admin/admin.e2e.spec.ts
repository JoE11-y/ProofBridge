/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestingApp } from '../../test/utils/create-app';
import { PrismaClient } from '@prisma/client';
import * as argon2 from '@node-rs/argon2';

describe('Admin E2E', () => {
  let app: INestApplication;
  const prisma = new PrismaClient();

  const seedAdmin = async (email: string, password: string) => {
    const passwordHash = await argon2.hash(password);
    return prisma.admin.upsert({
      where: { email },
      update: { passwordHash },
      create: { email, passwordHash },
    });
  };

  beforeAll(async () => {
    app = await createTestingApp();
    // Seed an initial admin for login
    await seedAdmin('admin@x.com', 'ChangeMe123!');
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('POST /v1/admin/login -> returns tokens for valid credentials', async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/admin/login')
      .send({ email: 'admin@x.com', password: 'ChangeMe123!' })
      .expect(200);

    expect(res.body).toMatchObject({
      tokens: { access: expect.any(String), refresh: expect.any(String) },
    });
  });

  it('POST /v1/admin/login -> 400 for missing fields or invalid ones', async () => {
    await request(app.getHttpServer())
      .post('/v1/admin/login')
      .send({ email: '', password: 'NoEmail#1' })
      .expect(400);

    // cannot set password < 8 chars
    await request(app.getHttpServer())
      .post('/v1/admin/login')
      .send({ email: 'admin@x.com', password: 'short' })
      .expect(400);
  });

  it('POST /v1/admin/login -> 401 for invalid credentials', async () => {
    await request(app.getHttpServer())
      .post('/v1/admin/login')
      .send({ email: 'admin@x.com', password: 'Wrong!98787' })
      .expect(401);
  });

  it('POST /v1/admin/addAdmin -> requires auth, creates new admin', async () => {
    // get an access token
    const login = await request(app.getHttpServer())
      .post('/v1/admin/login')
      .send({ email: 'admin@x.com', password: 'ChangeMe123!' })
      .expect(200);

    const access = login.body.tokens.access as string;

    // call protected endpoint with Authorization header
    await request(app.getHttpServer())
      .post('/v1/admin/addAdmin')
      .set('Authorization', `Bearer ${access}`)
      .send({ email: 'new@x.com', password: 'GoodPass#1' })
      .expect(201);

    // verify it actually exists in DB
    const created = await prisma.admin.findUnique({
      where: { email: 'new@x.com' },
    });
    expect(created).toBeTruthy();
    expect(created?.passwordHash).toEqual(expect.any(String));
  });

  it('POST /v1/admin/addAdmin -> 403 without token', async () => {
    await request(app.getHttpServer())
      .post('/v1/admin/addAdmin')
      .send({ email: 'noauth@x.com', password: 'Whatever#1' })
      .expect(403);
  });

  it('POST /v1/admin/addAdmin -> 403 with invalid token', async () => {
    await request(app.getHttpServer())
      .post('/v1/admin/addAdmin')
      .set('Authorization', 'Bearer not-a-jwt')
      .send({ email: 'badtoken@x.com', password: 'Whatever#1' })
      .expect(403);
  });
});
