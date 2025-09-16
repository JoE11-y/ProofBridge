import { Test, TestingModule } from '@nestjs/testing';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';

describe('TokensController (unit)', () => {
  let controller: TokenController;
  let service: jest.Mocked<TokenService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokenController],
      providers: [
        {
          provide: TokenService,
          useValue: {
            list: jest.fn(),
            getById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(TokenController);
    service = module.get(TokenService);
  });

  afterEach(() => jest.resetAllMocks());

  it('list() -> delegates to service', async () => {
    const mockResult = { data: [], nextCursor: null };

    const spy = jest.spyOn(service, 'list').mockResolvedValueOnce(mockResult);
    const res = await controller.list({ limit: 10 } as any);

    expect(spy).toHaveBeenCalledWith({ limit: 10 });
    expect(res).toBe(mockResult);
  });

  it('getById() -> delegates to service', async () => {
    const spy = jest.spyOn(service, 'getById').mockResolvedValueOnce({
      id: 'tok-1',
    } as any);

    const res = await controller.get('tok-1');

    expect(spy).toHaveBeenCalledWith('tok-1');
    expect(res).toEqual({ id: 'tok-1' });
  });
});
