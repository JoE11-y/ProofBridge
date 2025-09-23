import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TradesService } from './trade.service';
import {
  ConfirmChainActionResponseDto,
  ConfirmTradeActionDto,
  CreateTradeDto,
  CreateTradeRequestContractResponseDto,
  ListTradesResponseDto,
  LockForOrderResponseDto,
  QueryTradesDto,
  TradeResponseDto,
  UnlockOrderResponseDto,
  UnlockTradeDto,
} from './dto/trade.dto';
import type { Request } from 'express';
import { UserJwtGuard } from '../../common/guards/user-jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Trades')
@Controller('v1/trades')
export class TradesController {
  constructor(private readonly trades: TradesService) {}

  @Get('all')
  @HttpCode(HttpStatus.OK)
  list(@Query() query: QueryTradesDto): Promise<ListTradesResponseDto> {
    return this.trades.list(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  get(@Param('id', new ParseUUIDPipe()) id: string): Promise<TradeResponseDto> {
    return this.trades.getById(id);
  }

  @ApiBearerAuth()
  @Post(':id/lock')
  @UseGuards(UserJwtGuard)
  @HttpCode(HttpStatus.OK)
  lock(
    @Req() req: Request,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<LockForOrderResponseDto> {
    return this.trades.lockTrade(req, id);
  }

  @ApiBearerAuth()
  @Post('create')
  @UseGuards(UserJwtGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() req: Request,
    @Body() dto: CreateTradeDto,
  ): Promise<CreateTradeRequestContractResponseDto> {
    return this.trades.create(req, dto);
  }

  @ApiBearerAuth()
  @Post(':id/unlock')
  @UseGuards(UserJwtGuard)
  @HttpCode(HttpStatus.OK)
  unlock(
    @Req() req: Request,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UnlockTradeDto,
  ): Promise<UnlockOrderResponseDto> {
    return this.trades.unlock(req, id, dto);
  }

  @ApiBearerAuth()
  @Post(':id/unlock/confirm')
  @UseGuards(UserJwtGuard)
  @HttpCode(HttpStatus.OK)
  confirmUnlockChainAction(
    @Req() req: Request,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: ConfirmTradeActionDto,
  ): Promise<ConfirmChainActionResponseDto> {
    return this.trades.confirmUnlockChainAction(req, id, dto);
  }

  @ApiBearerAuth()
  @Post(':id/confirm')
  @UseGuards(UserJwtGuard)
  @HttpCode(HttpStatus.OK)
  confirmChainAction(
    @Req() req: Request,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: ConfirmTradeActionDto,
  ): Promise<ConfirmChainActionResponseDto> {
    return this.trades.confirmChainAction(req, id, dto);
  }
}
