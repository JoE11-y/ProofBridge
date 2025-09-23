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
import {
  ListTokenResponseDto,
  QueryTokensDto,
  TokenDataResponseDto,
} from './dto/token.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Tokens')
@Controller('v1/tokens')
export class TokenController {
  constructor(private readonly tokens: TokenService) {}

  // GET /v1/tokens?chainId=<number>&symbol&address&limit&cursor
  @Get()
  @HttpCode(HttpStatus.OK)
  list(@Query() query: QueryTokensDto): Promise<ListTokenResponseDto> {
    return this.tokens.list(query);
  }

  // GET /v1/tokens/:id (token UUID)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  get(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<TokenDataResponseDto> {
    return this.tokens.getById(id);
  }
}
