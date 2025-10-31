import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { ViemService } from '../../providers/viem/viem.service';
import { RequestFaucetDto, FaucetResponseDto } from './dto/faucet.dto';
import { Request, Response } from 'express';
import { ErrorService } from '@libs/error.service';
import { ResponseService } from '@libs/response.service';

@Injectable()
export class FaucetService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly viemService: ViemService,
    private readonly responseService: ResponseService,
    private readonly errorService: ErrorService,
  ) {}

  async requestFaucet(
    req: Request,
    res: Response,
    dto: RequestFaucetDto,
  ): Promise<FaucetResponseDto | undefined> {
    try {
      const reqUser = req.user;

      if (!reqUser) throw new UnauthorizedException('Not authenticated');

      const user = await this.prisma.user.findUnique({
        where: { id: reqUser.sub },
      });

      if (!user) throw new UnauthorizedException('Unauthorized');

      const token = await this.prisma.token.findUnique({
        where: { id: dto.tokenId },
        select: {
          id: true,
          symbol: true,
          address: true,
          chain: {
            select: {
              chainId: true,
            },
          },
        },
      });

      if (!token) {
        throw new NotFoundException(`Token with ID ${dto.tokenId} not found`);
      }

      // Check user's token balance
      const balance = await this.viemService.checkTokenBalance({
        chainId: token.chain.chainId.toString(),
        tokenAddress: token.address as `0x${string}`,
        account: user.walletAddress as `0x${string}`,
      });

      // Define threshold (e.g., 10,000 tokens)
      const BALANCE_THRESHOLD = '10000000000000000000000'; // 100k tokens with 18 decimals

      if (BigInt(balance) >= BigInt(BALANCE_THRESHOLD)) {
        throw new BadRequestException(
          `Balance threshold exceeded. Current balance: ${balance}`,
        );
      }

      const result = await this.viemService.mintToken({
        chainId: token.chain.chainId.toString(),
        tokenAddress: token.address as `0x${string}`,
        receiver: user.walletAddress as `0x${string}`,
      });

      return {
        txHash: result.txHash,
        symbol: token.symbol,
        chainId: token.chain.chainId.toString(),
        amount: '1000000',
      };
    } catch (err) {
      this.errorService.handleServerError(res, err, 'Faucet request failed');
    }
  }
}
