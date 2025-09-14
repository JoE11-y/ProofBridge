/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestingApp } from '../../test/utils/create-app';
import { Wallet } from 'ethers';
import { SiweMessage } from 'siwe';
import { env } from '@libs/configs';

interface PrepareResponse {
  nonce: string;
  address: string;
  expiresAt: string;
  domain: string;
  uri: string;
}

describe('SIWE E2E', () => {
  let app: INestApplication;
  const wallet = Wallet.createRandom();

  beforeAll(async () => {
    app = await createTestingApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should sign in with SIWE (prepare -> verify)', async () => {
    // get nonce bound to address
    const prep = await request(app.getHttpServer())
      .get('/auth/siwe/prepare')
      .query({ address: wallet.address })
      .expect(200);

    const body = prep.body as PrepareResponse;

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

    // sign and verify
    const signature = await wallet.signMessage(message);

    const verify = await request(app.getHttpServer())
      .post('/auth/siwe/verify')
      .send({ message, signature })
      .expect(201);

    expect(verify.body.user).toMatchObject({
      id: expect.any(String),
      username: expect.any(String),
    });
    expect(verify.body.tokens).toMatchObject({
      access: expect.any(String),
      refresh: expect.any(String),
    });
  });

  it('rejects wrong domain', async () => {
    const prep = await request(app.getHttpServer())
      .get('/auth/siwe/prepare')
      .query({ address: wallet.address })
      .expect(200);

    const body = prep.body as PrepareResponse;

    const bad = new SiweMessage({
      domain: 'evil.xyz', // wrong
      address: wallet.address,
      statement: 'Sign in',
      uri: body.uri,
      version: '1',
      chainId: 1,
      nonce: body.nonce,
      issuedAt: new Date().toISOString(),
      expirationTime: new Date(Date.now() + 5 * 60_000).toISOString(),
    });

    const message = bad.prepareMessage();
    const sig = await wallet.signMessage(message);

    await request(app.getHttpServer())
      .post('/auth/siwe/verify')
      .send({ message, signature: sig })
      .expect(400);
  });

  it('rejects expired message', async () => {
    const prep = await request(app.getHttpServer())
      .get('/auth/siwe/prepare')
      .query({ address: wallet.address })
      .expect(200);

    const body = prep.body as PrepareResponse;

    const now = new Date();

    // Set expiration in the past way behind the clock skew
    const expired = new Date(now.getTime() - 70000);

    const msg = new SiweMessage({
      domain: body.domain,
      address: wallet.address,
      statement: 'Sign in to ProofBridge',
      uri: body.uri,
      version: '1',
      chainId: 1,
      nonce: body.nonce,
      issuedAt: expired.toISOString(),
      expirationTime: expired.toISOString(),
    });

    const message = msg.prepareMessage();
    const signature = await wallet.signMessage(message);

    await request(app.getHttpServer())
      .post('/auth/siwe/verify')
      .send({ message, signature })
      .expect(400);
  });

  it('rejects invalid signature', async () => {
    const prep = await request(app.getHttpServer())
      .get('/auth/siwe/prepare')
      .query({ address: wallet.address })
      .expect(200);

    const body = prep.body as PrepareResponse;

    const msg = new SiweMessage({
      domain: body.domain,
      address: wallet.address,
      statement: 'Sign in to ProofBridge',
      uri: body.uri,
      version: '1',
      chainId: 1,
      nonce: body.nonce,
      issuedAt: new Date().toISOString(),
      expirationTime: new Date(Date.now() + 5 * 60_000).toISOString(),
    });

    const message = msg.prepareMessage();
    const invalidSignature = '0x1234'; // Invalid signature

    await request(app.getHttpServer())
      .post('/auth/siwe/verify')
      .send({ message, signature: invalidSignature })
      .expect(401);
  });

  it('rejects missing nonce', async () => {
    const msg = new SiweMessage({
      domain: env.appDomain,
      address: wallet.address,
      statement: 'Sign in to ProofBridge',
      uri: env.appUri,
      version: '1',
      chainId: 1,
      nonce: '30a30db69047450f8ca66f378f24102a',
      issuedAt: new Date().toISOString(),
      expirationTime: new Date(Date.now() + 5 * 60_000).toISOString(),
    });

    const message = msg.prepareMessage();
    const signature = await wallet.signMessage(message);

    await request(app.getHttpServer())
      .post('/auth/siwe/verify')
      .send({ message, signature })
      .expect(400);
  });

  it('POST /auth/refresh returns a fresh access token', async () => {
    const prep = await request(app.getHttpServer())
      .get('/auth/siwe/prepare')
      .query({ address: wallet.address })
      .expect(200);

    const body = prep.body as PrepareResponse;
    const nowIso = new Date().toISOString();

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
      expirationTime: body.expiresAt,
    });
    const message = msg.prepareMessage();
    const signature = await wallet.signMessage(message);

    const verifyResponse = await request(app.getHttpServer())
      .post('/auth/siwe/verify')
      .send({ message, signature })
      .expect(201);

    const { tokens } = verifyResponse.body;

    const res = await request(app.getHttpServer())
      .post('/auth/siwe/refresh')
      .send({ refresh: tokens.refresh })
      .expect(200);

    expect(res.body).toMatchObject({ access: expect.any(String) });
    const newAccess = res.body.access;
    expect(newAccess).not.toEqual(tokens.access);
  });

  it('rejects invalid refresh token', async () => {
    await request(app.getHttpServer())
      .post('/auth/siwe/refresh')
      .send({ refresh: 'not-a-jwt' })
      .expect(400);
  });
});
