import { Prisma } from '@prisma/client';

export type HealthStatus = 'ok' | 'degraded' | 'error';
export interface HealthResponse {
  status: HealthStatus;
  uptimeSec: number;
  timestamp: string;
  checks: {
    liveness: 'ok';
    db: 'ok' | 'error';
  };
}

type PublicChain = {
  name: string;
  chainId: string;
  adManagerAddress: string;
  orderPortalAddress: string;
  createdAt: string;
  updatedAt: string;
};

type TokenRow = {
  id: string;
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  kind: string;
  createdAt: Date;
  updatedAt: Date;
  chain: { id: string; name: string; chainId: bigint };
};

type RouteRow = {
  id: string;
  metadata: Prisma.JsonValue | null;
  createdAt: Date;
  updatedAt: Date;
  fromToken: {
    id: string;
    symbol: string;
    name: string;
    address: string;
    decimals: number;
    kind: string;
    chain: { id: string; name: string; chainId: bigint };
  };
  toToken: {
    id: string;
    symbol: string;
    name: string;
    address: string;
    decimals: number;
    kind: string;
    chain: { id: string; name: string; chainId: bigint };
  };
};
