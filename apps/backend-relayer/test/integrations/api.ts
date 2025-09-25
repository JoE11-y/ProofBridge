import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { parseEther } from 'viem';

export const getRoutes = (
  app: INestApplication,
  fromId: string,
  toId: string,
) =>
  request(app.getHttpServer())
    .get('/v1/routes')
    .query({ adChainId: fromId, orderChainId: toId });

export const apiCreateAd = (
  app: INestApplication,
  access: string,
  routeId: string,
  dst: `0x${string}`,
) =>
  request(app.getHttpServer())
    .post('/v1/ads/create')
    .set('Authorization', `Bearer ${access}`)
    .send({ routeId, creatorDstAddress: dst });

export const apiConfirm = (
  app: INestApplication,
  adId: string,
  access: string,
  txHash: `0x${string}`,
) =>
  request(app.getHttpServer())
    .post(`/v1/ads/${adId}/confirm`)
    .set('Authorization', `Bearer ${access}`)
    .send({ txHash });

export const apiFundAd = (
  app: INestApplication,
  adId: string,
  access: string,
  amtEth: string,
) =>
  request(app.getHttpServer())
    .post(`/v1/ads/${adId}/fund`)
    .set('Authorization', `Bearer ${access}`)
    .send({ poolAmountTopUp: parseEther(amtEth).toString() });

export const apiWithdraw = (
  app: INestApplication,
  adId: string,
  access: string,
  amtEth: string,
  to: `0x${string}`,
) =>
  request(app.getHttpServer())
    .post(`/v1/ads/${adId}/withdraw`)
    .set('Authorization', `Bearer ${access}`)
    .send({ poolAmountWithdraw: parseEther(amtEth).toString(), to });

export const apiUpdateAd = (
  app: INestApplication,
  adId: string,
  access: string,
  body: any,
) =>
  request(app.getHttpServer())
    .patch(`/v1/ads/${adId}/update`)
    .set('Authorization', `Bearer ${access}`)
    .send(body);

export const apiGetAd = (app: INestApplication, adId: string) =>
  request(app.getHttpServer()).get(`/v1/ads/${adId}`);

export const apiCloseAd = (
  app: INestApplication,
  adId: string,
  access: string,
  body: any,
) =>
  request(app.getHttpServer())
    .post(`/v1/ads/${adId}/close`)
    .set('Authorization', `Bearer ${access}`)
    .send(body);

export const apiCreateOrder = (
  app: INestApplication,
  access: string,
  body: any,
) =>
  request(app.getHttpServer())
    .post('/v1/trades/create')
    .set('Authorization', `Bearer ${access}`)
    .send(body);

export const apiGetTrade = (app: INestApplication, tradeId: string) =>
  request(app.getHttpServer()).get(`/v1/trades/${tradeId}`);

export const apiTradeConfirm = (
  app: INestApplication,
  tradeId: string,
  access: string,
  txHash: `0x${string}`,
) =>
  request(app.getHttpServer())
    .post(`/v1/trades/${tradeId}/confirm`)
    .set('Authorization', `Bearer ${access}`)
    .send({ txHash });

export const apiLockOrder = (
  app: INestApplication,
  access: string,
  tradeId: string,
) =>
  request(app.getHttpServer())
    .post(`/v1/trades/${tradeId}/lock`)
    .set('Authorization', `Bearer ${access}`)
    .send();

export const apiTradeParams = (
  app: INestApplication,
  access: string,
  tradeId: string,
) =>
  request(app.getHttpServer())
    .get(`/v1/trades/${tradeId}/params`)
    .set('Authorization', `Bearer ${access}`);

export const apiUnlockOrder = (
  app: INestApplication,
  access: string,
  tradeId: string,
  signature: string,
) =>
  request(app.getHttpServer())
    .post(`/v1/trades/${tradeId}/unlock`)
    .set('Authorization', `Bearer ${access}`)
    .send({
      signature,
    });

export const apiTradeUnlockConfirm = (
  app: INestApplication,
  access: string,
  tradeId: string,
  txHash: string,
) =>
  request(app.getHttpServer())
    .post(`/v1/trades/${tradeId}/unlock/confirm`)
    .set('Authorization', `Bearer ${access}`)
    .send({
      txHash,
    });
