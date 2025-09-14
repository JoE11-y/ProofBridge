import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            prepare: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get(AuthService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /auth/siwe/prepare', () => {
    it('should call AuthService.prepare with the address and return payload', async () => {
      const address = '0x1234567890abcdef1234567890abcdef12345678';
      const mockPayload = {
        nonce: 'abc123',
        address,
        expiresAt: new Date(Date.now() + 300_000).toISOString(),
        domain: 'proofbridge.xyz',
        uri: 'https://proofbridge.xyz',
      };

      const spy = jest
        .spyOn(service, 'prepare')
        .mockResolvedValueOnce(mockPayload);

      const res = await controller.prepare(address);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(address);

      expect(res).toEqual(mockPayload);
    });

    it('should propagate service errors', async () => {
      const address = '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef';

      const spy = jest
        .spyOn(service, 'prepare')
        .mockRejectedValueOnce(new Error('boom'));

      await expect(controller.prepare(address)).rejects.toThrow('boom');
      expect(spy).toHaveBeenCalledWith(address);
    });
  });

  describe('POST /auth/siwe/verify', () => {
    it('should call AuthService.verify and return payload', async () => {
      const dto = {
        message:
          'service.xyz wants you to sign in with your Ethereum account:\n...',
        signature: '0xsignature',
      };
      const mockResult = {
        user: { id: 'u1', username: 'dummy_abcd' },
        tokens: { access: 'jwt-access', refresh: 'jwt-refresh' },
      };

      const spy = jest
        .spyOn(service, 'verify')
        .mockResolvedValueOnce(mockResult);

      const res = await controller.verify(dto);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(dto.message, dto.signature);
      expect(res).toEqual(mockResult);
    });

    it('should propagate service errors (e.g., invalid signature)', async () => {
      const dto = { message: 'bad', signature: '0x00' };

      const spy = jest
        .spyOn(service, 'verify')
        .mockRejectedValueOnce(new Error('Unauthorized'));

      await expect(controller.verify(dto)).rejects.toThrow('Unauthorized');
      expect(spy).toHaveBeenCalledWith(dto.message, dto.signature);
    });
  });
});
