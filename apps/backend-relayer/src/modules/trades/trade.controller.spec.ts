import { Test, TestingModule } from '@nestjs/testing';
import { TradesController } from './trade.controller';
import { TradesService } from './trade.service';
import { PrismaService } from '@prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('TradesController (unit)', () => {
  let controller: TradesController;
  let service: jest.Mocked<TradesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TradesController],
      providers: [
        {
          provide: TradesService,
          useValue: {
            list: jest.fn(),
            getById: jest.fn(),
            create: jest.fn(),
            confirm: jest.fn(),
          },
        },
        PrismaService,
        JwtService,
      ],
    }).compile();

    controller = module.get(TradesController);
    service = module.get(TradesService);
  });

  afterEach(() => jest.resetAllMocks());

  it('list delegates to service', async () => {
    const mock = { data: [], nextCursor: null };
    const spy = jest.spyOn(service, 'list').mockResolvedValueOnce(mock as any);
    const res = await controller.list({ limit: 10 } as any);
    expect(spy).toHaveBeenCalledWith({ limit: 10 });
    expect(res).toBe(mock);
  });

  it('get delegates to service', async () => {
    const spy = jest
      .spyOn(service, 'getById')
      .mockResolvedValueOnce({ id: 'tr-1' } as any);
    const res = await controller.get('tr-1');
    expect(spy).toHaveBeenCalledWith('tr-1');
    expect(res).toEqual({ id: 'tr-1' });
  });

  it('create passes user + idem key', async () => {
    const req: any = {
      user: { sub: '0xB' },
      headers: { 'idempotency-key': 'abc' },
    };

    const dto: any = {
      adId: 'ad1',
      routeId: 'r1',
      amount: '1',
      adCreatorAddress: '0xA',
      bridgerAddress: '0xB',
      participantAddresses: ['0xA', '0xB'],
      participantSignatures: {},
    };

    const spy = jest.spyOn(service, 'create').mockResolvedValueOnce({
      trade: { id: 'tr-1' },
      idempotentHit: false,
    } as any);

    const res = await controller.create(req, dto);
    expect(spy).toHaveBeenCalledWith(req, dto);
    expect(res.trade).toEqual({ id: 'tr-1' });
  });

  it('confirm delegates to service', async () => {
    const req: any = { user: { sub: '0xB' } };

    const spy = jest
      .spyOn(service, 'confirm')
      .mockResolvedValueOnce({ status: 'PROOF_READY' } as any);

    const res = await controller.confirm(req, 'tr-1', {
      encodedSignature: '0x01',
    });

    expect(spy).toHaveBeenCalledWith(req, 'tr-1', {
      encodedSignature: '0x01',
    });
    expect(res).toEqual({ status: 'PROOF_READY' });
  });
});
