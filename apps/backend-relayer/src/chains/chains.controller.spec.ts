import { Test, TestingModule } from '@nestjs/testing';
import { ChainsController } from './chains.controller';
import { ChainsService } from './chains.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@prisma/prisma.service';

describe('ChainsController (unit)', () => {
  let controller: ChainsController;
  let service: jest.Mocked<ChainsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChainsController],
      providers: [
        JwtService,
        {
          provide: ChainsService,
          useValue: {
            listChains: jest.fn(),
            getByChainId: jest.fn(),
          },
        },
        PrismaService,
      ],
    }).compile();
    controller = module.get(ChainsController);
    service = module.get(ChainsService);
  });

  afterEach(() => jest.resetAllMocks());

  it('list -> delegates to service', async () => {
    const mock = { data: [], nextCursor: null };
    const spy = jest.spyOn(service, 'listChains').mockResolvedValueOnce(mock);
    const res = await controller.listChains({ limit: 10 } as any);
    expect(spy).toHaveBeenCalledWith({ limit: 10 });
    expect(res).toBe(mock);
  });

  it('get -> delegates to service', async () => {
    const mockChain = {
      name: 'Base',
      chainId: '8453',
      adManagerAddress: '0xAM',
      orderPortalAddress: '0xOP',
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
    };
    const spy = jest
      .spyOn(service, 'getByChainId')
      .mockResolvedValueOnce(mockChain);
    const res = await controller.getChain('uuid');
    expect(spy).toHaveBeenCalledWith('uuid');
    expect(res).toEqual(mockChain);
  });
});
