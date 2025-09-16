import { Test, TestingModule } from '@nestjs/testing';
import { RoutesController } from './route.controller';
import { RoutesService } from './route.service';
import { randomUUID } from 'crypto';

describe('RoutesController (unit)', () => {
  let controller: RoutesController;
  let service: jest.Mocked<RoutesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoutesController],
      providers: [
        {
          provide: RoutesService,
          useValue: {
            list: jest.fn(),
            getById: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(RoutesController);
    service = module.get(RoutesService);
  });

  afterEach(() => jest.resetAllMocks());

  it('list -> delegates to service.list', async () => {
    const mock = { data: [], nextCursor: null };
    const spy = jest.spyOn(service, 'list').mockResolvedValueOnce(mock);
    const res = await controller.list({ limit: 10 } as any);
    expect(spy).toHaveBeenCalledWith({ limit: 10 });
    expect(res).toBe(mock);
  });

  it('get -> delegates to service.getById', async () => {
    const routeId = randomUUID();
    const spy = jest
      .spyOn(service, 'getById')
      .mockResolvedValueOnce({ id: routeId } as any);
    const res = await controller.get(routeId);
    expect(spy).toHaveBeenCalledWith(routeId);
    expect(res).toEqual({ id: routeId });
  });
});
