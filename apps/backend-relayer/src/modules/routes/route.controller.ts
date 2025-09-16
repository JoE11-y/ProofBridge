import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { RoutesService } from './route.service';
import { QueryRoutesDto } from './dto/route.dto';

@Controller('v1/routes')
export class RoutesController {
  constructor(private readonly routes: RoutesService) {}

  // GET /v1/routes?fromTokenId&toTokenId&fromChainId&toChainId&symbol&limit&cursor
  @Get()
  @HttpCode(HttpStatus.OK)
  list(@Query() query: QueryRoutesDto) {
    return this.routes.list(query);
  }

  // GET /v1/routes/:id
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  get(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.routes.getById(id);
  }
}
