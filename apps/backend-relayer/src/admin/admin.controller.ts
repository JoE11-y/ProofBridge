import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminAuthDTO } from '../dto/admin.dto';
import type { Request } from 'express';
import { AdminJwtGuard } from '../common/guards/admin-jwt.guard';
import {
  CreateChainDto,
  QueryChainsDto,
  UpdateChainDto,
} from '../dto/chain.dto';

@Controller('/v1/admin')
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: AdminAuthDTO) {
    return this.service.login(dto);
  }

  @Post('addAdmin')
  @UseGuards(AdminJwtGuard)
  @HttpCode(HttpStatus.CREATED)
  addAdmin(@Req() req: Request, @Body() dto: AdminAuthDTO) {
    return this.service.addAdmin(req, dto);
  }

  @Get('chains')
  @UseGuards(AdminJwtGuard)
  @HttpCode(HttpStatus.OK)
  listChains(@Query() query: QueryChainsDto) {
    return this.service.listChains(query);
  }

  @Post('chains/create')
  @UseGuards(AdminJwtGuard)
  @HttpCode(HttpStatus.CREATED)
  createChain(@Body() dto: CreateChainDto) {
    return this.service.createChain(dto);
  }

  @Patch('chains/:id')
  @UseGuards(AdminJwtGuard)
  @HttpCode(HttpStatus.OK)
  updateChain(
    @Param('id', ParseUUIDPipe) chainId: string,
    @Body() dto: UpdateChainDto,
  ) {
    return this.service.updateChain(chainId, dto);
  }

  @Delete('chains/:id')
  @UseGuards(AdminJwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeChain(@Param('id', ParseUUIDPipe) chainId: string) {
    await this.service.removeChain(chainId);
  }
}
