/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { HealthResponse, HealthStatus } from '@libs/types';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}
  async health(): Promise<HealthResponse> {
    let dbStatus: 'ok' | 'error' = 'ok';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = 'error';
    }

    const status: HealthStatus = dbStatus === 'ok' ? 'ok' : 'degraded';

    return {
      status,
      uptimeSec: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
      checks: {
        liveness: 'ok',
        db: dbStatus,
      },
    };
  }
}
