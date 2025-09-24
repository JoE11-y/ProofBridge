import { Test, TestingModule } from '@nestjs/testing';
import { AdsController } from './ad.controller';
import { AdsService } from './ad.service';
import { PrismaService } from '@prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('AdsController (unit)', () => {
  let controller: AdsController;
  let service: jest.Mocked<AdsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdsController],
      providers: [
        JwtService,
        {
          provide: AdsService,
          useValue: {
            list: jest.fn(),
            getById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            close: jest.fn(),
          },
        },
        PrismaService,
      ],
    }).compile();

    controller = module.get(AdsController);
    service = module.get(AdsService);
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
    const spy = jest
      .spyOn(service, 'getById')
      .mockResolvedValueOnce({ id: 'ad-1' } as any);
    const res = await controller.get('ad-1');
    expect(spy).toHaveBeenCalledWith('ad-1');
    expect(res).toEqual({ id: 'ad-1' });
  });

  it('create -> passes user from req.user', async () => {
    const dto = {
      routeId: 'r-1',
      creatorDstAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      poolAmount: '1000',
    };
    const req: any = { user: { sub: 'user_id' } };
    const created = { id: 'ad-1' };

    const spy = jest
      .spyOn(service, 'create')
      .mockResolvedValueOnce(created as any);

    const res = await controller.create(req, dto);
    expect(spy).toHaveBeenCalledWith({ user: { sub: 'user_id' } }, dto);
    expect(res).toEqual(created);
  });

  it('update -> passes user from req.user', async () => {
    const dto = { minAmount: '500' };
    const req: any = { user: { sub: 'user_id' } };
    const updated = { id: 'ad-1' };

    const spy = jest
      .spyOn(service, 'update')
      .mockResolvedValueOnce(updated as any);

    const res = await controller.update(req, 'ad-1', dto);

    expect(spy).toHaveBeenCalledWith({ user: { sub: 'user_id' } }, 'ad-1', dto);
    expect(res).toEqual(updated);
  });

  // it('close -> passes user from req.user', async () => {
  //   const dto = { to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' };
  //   const req: any = { user: { sub: 'user_id' } };

  //   const spy = jest.spyOn(service, 'close').mockResolvedValueOnce(undefined);

  //   await controller.close(req, 'ad-1', dto);

  //   expect(spy).toHaveBeenCalledWith({ user: { sub: 'user_id' } }, 'ad-1', dto);
  // });
});
