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
            challenge: jest.fn(),
            login: jest.fn(),
            refresh: jest.fn(),
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

  describe('GET /v1/auth/challenge', () => {
    it('should call AuthService.challenge with the address and return payload', async () => {
      const address = '0x1234567890abcdef1234567890abcdef12345678';
      const mockPayload = {
        nonce: 'abc123',
        address,
        expiresAt: new Date(Date.now() + 300_000).toISOString(),
        domain: 'proofbridge.xyz',
        uri: 'https://proofbridge.xyz',
      };

      const spy = jest
        .spyOn(service, 'challenge')
        .mockResolvedValueOnce(mockPayload);

      const res = await controller.challenge(address);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(address);

      expect(res).toEqual(mockPayload);
    });

    it('should propagate service errors', async () => {
      const address = '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef';

      const spy = jest
        .spyOn(service, 'challenge')
        .mockRejectedValueOnce(new Error('boom'));

      await expect(controller.challenge(address)).rejects.toThrow('boom');
      expect(spy).toHaveBeenCalledWith(address);
    });
  });

  describe('POST /v1/auth/refresh', () => {
    it('should call AuthService.refresh and return new tokens', async () => {
      const dto = { refresh: 'valid-refresh-token' };
      const mockResult = {
        tokens: { access: 'new-jwt-access', refresh: 'new-jwt-refresh' },
      };

      const spy = jest
        .spyOn(service, 'refresh')
        .mockResolvedValueOnce(mockResult);

      const res = await controller.refresh(dto);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(dto.refresh);
      expect(res).toEqual(mockResult);
    });

    it('should handle invalid refresh token', async () => {
      const dto = { refresh: 'invalid-token' };

      const spy = jest
        .spyOn(service, 'refresh')
        .mockRejectedValueOnce(new Error('Invalid refresh token'));

      await expect(controller.refresh(dto)).rejects.toThrow(
        'Invalid refresh token',
      );
      expect(spy).toHaveBeenCalledWith(dto.refresh);
    });
  });

  describe('POST /v1/auth/login', () => {
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
        .spyOn(service, 'login')
        .mockResolvedValueOnce(mockResult);

      const res = await controller.login(dto);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(dto.message, dto.signature);
      expect(res).toEqual(mockResult);
    });

    it('should propagate service errors (e.g., invalid signature)', async () => {
      const dto = { message: 'bad', signature: '0x00' };

      const spy = jest
        .spyOn(service, 'login')
        .mockRejectedValueOnce(new Error('Unauthorized'));

      await expect(controller.login(dto)).rejects.toThrow('Unauthorized');
      expect(spy).toHaveBeenCalledWith(dto.message, dto.signature);
    });
  });
});
