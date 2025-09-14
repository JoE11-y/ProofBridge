/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { HealthResponse } from '@libs/types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @HttpCode(HttpStatus.OK)
  async getHealth(): Promise<HealthResponse> {
    const health = await this.appService.health();

    // if (health.checks.db === 'error') {
    //   throw new ServiceUnavailableException(health);
    // }

    return health;
  }
}
