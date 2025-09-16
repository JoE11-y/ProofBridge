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
  ConfirmTradeDto,
  CreateTradeDto,
  QueryTradesDto,
} from './dto/trade.dto';
import type { Request } from 'express';
import { UserJwtGuard } from '../../common/guards/user-jwt.guard';

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

  @Post(':id/authorize')
  @UseGuards(UserJwtGuard)
  @HttpCode(HttpStatus.OK)
  authorizeLock(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: Request,
  ) {
    return this.trades.authorizeLock(req, id);
  }

  @Post()
  @UseGuards(UserJwtGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req: Request, @Body() dto: CreateTradeDto) {
    await this.trades.create(req, dto);
  }

  @Post(':id/confirm')
  @UseGuards(UserJwtGuard)
  @HttpCode(HttpStatus.OK)
  confirm(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: Request,
    @Body() dto: ConfirmTradeDto,
  ) {
    return this.trades.confirm(req, id, dto);
  }
}
