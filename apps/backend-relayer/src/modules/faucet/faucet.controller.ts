import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FaucetService } from './faucet.service';
import { RequestFaucetDto, FaucetResponseDto } from './dto/faucet.dto';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
import { UserJwtGuard } from '../../common/guards/user-jwt.guard';
import type { Request, Response } from 'express';

@ApiTags('Faucet')
@Controller('v1/faucet')
export class FaucetController {
  constructor(private readonly faucetService: FaucetService) {}

  @ApiBearerAuth()
  @Post('request')
  @UseGuards(UserJwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Request faucet tokens',
    description:
      'Mint faucet tokens for a given token ID and send to receiver address',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully minted and sent faucet tokens',
    type: FaucetResponseDto,
  })
  async requestFaucet(
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: RequestFaucetDto,
  ) {
    return this.faucetService.requestFaucet(req, res, dto);
  }
}
