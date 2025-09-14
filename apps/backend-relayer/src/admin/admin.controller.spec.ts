import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from '../../src/admin/admin.controller';
import { AdminService } from '../../src/admin/admin.service';
import type { Request } from 'express';
import { PrismaService } from '@prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

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
          },
        },
        PrismaService,
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
});
