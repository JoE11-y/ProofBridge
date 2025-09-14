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

export interface VersionResponse {
  name: string;
  version: string;
  env: string;
  commit?: string; // optional: set via env (GIT_COMMIT)
  buildTime?: string; // optional: set via env (BUILD_TIME)
}
