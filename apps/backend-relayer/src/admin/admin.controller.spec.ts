import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from '../../src/admin/admin.controller';
import { AdminService } from '../../src/admin/admin.service';
import type { Request } from 'express';
import { PrismaService } from '@prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ChainsService } from '../chains/chains.service';

describe('AdminController (unit)', () => {
  let controller: AdminController;
  let service: jest.Mocked<AdminService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        JwtService,
        {
          provide: AdminService,
          useValue: {
            login: jest.fn(),
            addAdmin: jest.fn(),
            createChain: jest.fn(),
            updateChain: jest.fn(),
            removeChain: jest.fn(),
          },
        },
        PrismaService,
        ChainsService,
      ],
    }).compile();

    controller = module.get(AdminController);
    service = module.get(AdminService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('POST /admin/login', () => {
    it('returns tokens from AdminService.login', async () => {
      const dto = { email: 'admin@x.com', password: 'Secret123!' };
      const mockTokens = {
        tokens: { access: 'jwt-access', refresh: 'jwt-refresh' },
      };
      const spy = jest
        .spyOn(service, 'login')
        .mockResolvedValueOnce(mockTokens);

      const res = await controller.login(dto);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(dto);
      expect(res).toEqual(mockTokens);
    });
  });

  describe('POST /admin/addAdmin', () => {
    it('delegates to AdminService.addAdmin with req + dto', async () => {
      // fake request with user (guard normally attaches this)
      const req = { user: { sub: 'admin-id' } } as unknown as Request;
      const dto = { email: 'new@x.com', password: 'GoodPass#1' };

      const spy = jest
        .spyOn(service, 'addAdmin')
        .mockResolvedValueOnce(undefined);

      const res = await controller.addAdmin(req, dto);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(req, dto);
      expect(res).toBeUndefined();
    });
  });

  it('create -> delegates to service', async () => {
    const dto = {
      name: 'Base',
      chainId: '8453',
      adManagerAddress: '0xAM',
      orderPortalAddress: '0xOP',
    };

    const mockRes = {
      id: 'uuid',
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const spy = jest
      .spyOn(service, 'createChain')
      .mockResolvedValueOnce(mockRes);
    const res = await controller.createChain(dto as any);
    expect(spy).toHaveBeenCalledWith(dto);
    expect(res).toEqual(mockRes);
  });

  it('update -> delegates to service', async () => {
    const dto = { name: 'New' };
    const mockRes = {
      id: 'uuid',
      chainId: '8453',
      adManagerAddress: '0xAM',
      orderPortalAddress: '0xOP',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...dto,
    };
    const spy = jest
      .spyOn(service, 'updateChain')
      .mockResolvedValueOnce(mockRes);
    const res = await controller.updateChain('uuid', dto as any);
    expect(spy).toHaveBeenCalledWith('uuid', dto);
    expect(res).toEqual(mockRes);
  });

  it('remove -> delegates to service', async () => {
    const spy = jest
      .spyOn(service, 'removeChain')
      .mockResolvedValueOnce(undefined);
    await controller.removeChain('uuid');
    expect(spy).toHaveBeenCalledWith('uuid');
  });
});
