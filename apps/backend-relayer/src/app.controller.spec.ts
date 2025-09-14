import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthResponse } from './types';

describe('AppController (health)', () => {
  let appController: AppController;
  let appService: jest.Mocked<AppService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            health: jest.fn(),
            version: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get(AppService);
  });

  describe('GET /health', () => {
    it('should return health status from AppService', async () => {
      const mockHealth: HealthResponse = {
        status: 'ok',
        uptimeSec: 42,
        timestamp: new Date().toISOString(),
        checks: {
          liveness: 'ok',
          db: 'ok',
        },
      };

      const spy = jest
        .spyOn(appService, 'health')
        .mockResolvedValueOnce(mockHealth);

      const result = await appController.getHealth();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockHealth);
    });
  });
});
