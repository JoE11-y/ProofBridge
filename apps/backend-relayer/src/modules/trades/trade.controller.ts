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
  AuthorizeTradeDto,
  ConfirmTradeActionDto,
  CreateTradeDto,
  QueryTradesDto,
} from './dto/trade.dto';
import type { Request } from 'express';
import { UserJwtGuard } from '../../common/guards/user-jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Trades')
@Controller('v1/trades')
export class TradesController {
  constructor(private readonly trades: TradesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  list(@Query() query: QueryTradesDto) {
    return this.trades.list(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  get(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.trades.getById(id);
  }

  @ApiBearerAuth()
  @Post(':id/lock')
  @UseGuards(UserJwtGuard)
  @HttpCode(HttpStatus.OK)
  lock(@Param('id', new ParseUUIDPipe()) id: string, @Req() req: Request) {
    return this.trades.lockTrade(req, id);
  }

  @ApiBearerAuth()
  @Post()
  @UseGuards(UserJwtGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req: Request, @Body() dto: CreateTradeDto) {
    return this.trades.create(req, dto);
  }

  @ApiBearerAuth()
  @Post(':id/authorize')
  @UseGuards(UserJwtGuard)
  @HttpCode(HttpStatus.OK)
  confirm(
    @Req() req: Request,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: AuthorizeTradeDto,
  ) {
    return this.trades.authorize(req, id, dto);
  }

  @ApiBearerAuth()
  @Post(':id/authorize/confirm')
  @UseGuards(UserJwtGuard)
  @HttpCode(HttpStatus.OK)
  confirmAuthorization(
    @Req() req: Request,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: ConfirmTradeActionDto,
  ) {
    return this.trades.confirmAuthorizeAction(req, id, dto);
  }

  @ApiBearerAuth()
  @Post(':id/confirm')
  @UseGuards(UserJwtGuard)
  @HttpCode(HttpStatus.OK)
  confirmChainAction(
    @Req() req: Request,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: ConfirmTradeActionDto,
  ) {
    return this.trades.confirmChainAction(req, id, dto);
  }
}
