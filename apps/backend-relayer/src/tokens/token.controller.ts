import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TokenService } from './token.service';
import { QueryTokensDto } from '../dto/token.dto';

@Controller('v1/tokens')
export class TokenController {
  constructor(private readonly tokens: TokenService) {}

  // GET /v1/tokens?chainId=<number>&symbol&address&limit&cursor
  @Get()
  @HttpCode(HttpStatus.OK)
  list(@Query() query: QueryTokensDto) {
    return this.tokens.list(query);
  }

  // GET /v1/tokens/:id (token UUID)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  get(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.tokens.getById(id);
  }
}
