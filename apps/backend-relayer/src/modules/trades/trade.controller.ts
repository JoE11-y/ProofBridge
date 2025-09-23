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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Trades')
@Controller('v1/trades')
export class TradesController {
  constructor(private readonly trades: TradesService) {}

  @Get('all')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns a list of trades based on query parameters',
    type: ListTradesResponseDto,
  })
  list(@Query() query: QueryTradesDto): Promise<ListTradesResponseDto> {
    return this.trades.list(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns trade details by trade ID',
    type: TradeResponseDto,
  })
  get(@Param('id', new ParseUUIDPipe()) id: string): Promise<TradeResponseDto> {
    return this.trades.getById(id);
  }

  @ApiBearerAuth()
  @Post(':id/lock')
  @UseGuards(UserJwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Locks a trade for order and returns the transaction data for blockchain execution',
    type: LockForOrderResponseDto,
  })
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
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:
      'Creates a new trade and returns the transaction data for blockchain execution',
    type: CreateTradeRequestContractResponseDto,
  })
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
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Unlocks a trade and returns the transaction data for blockchain execution',
    type: UnlockOrderResponseDto,
  })
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
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Confirms the unlock action on a trade and returns the transaction data for blockchain execution',
    type: ConfirmChainActionResponseDto,
  })
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Confirms a chain action for a trade',
    type: ConfirmChainActionResponseDto,
  })
  confirmChainAction(
    @Req() req: Request,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: ConfirmTradeActionDto,
  ): Promise<ConfirmChainActionResponseDto> {
    return this.trades.confirmChainAction(req, id, dto);
  }
}
