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
