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
import { AdminAuthDTO } from './dto/admin.dto';
import type { Request } from 'express';
import { AdminJwtGuard } from '../../common/guards/admin-jwt.guard';
import {
  CreateChainDto,
  QueryChainsDto,
  UpdateChainDto,
} from '../chains/dto/chain.dto';
import { CreateTokenDto, UpdateTokenDto } from '../token/dto/token.dto';
import { CreateRouteDto } from '../routes/dto/route.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('/v1/admin')
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: AdminAuthDTO) {
    return this.service.login(dto);
  }

  @ApiBearerAuth()
  @Post('addAdmin')
  @UseGuards(AdminJwtGuard)
  @HttpCode(HttpStatus.CREATED)
  addAdmin(@Req() req: Request, @Body() dto: AdminAuthDTO) {
    return this.service.addAdmin(req, dto);
  }

  @ApiBearerAuth()
  @Get('chains')
  @UseGuards(AdminJwtGuard)
  @HttpCode(HttpStatus.OK)
  listChains(@Query() query: QueryChainsDto) {
    return this.service.listChains(query);
  }

  @ApiBearerAuth()
  @Post('chains/create')
  @UseGuards(AdminJwtGuard)
  @HttpCode(HttpStatus.CREATED)
  createChain(@Body() dto: CreateChainDto) {
    return this.service.createChain(dto);
  }

  @ApiBearerAuth()
  @Patch('chains/:id')
  @UseGuards(AdminJwtGuard)
  @HttpCode(HttpStatus.OK)
  updateChain(
    @Param('id', ParseUUIDPipe) chainId: string,
    @Body() dto: UpdateChainDto,
  ) {
    return this.service.updateChain(chainId, dto);
  }

  @ApiBearerAuth()
  @Delete('chains/:id')
  @UseGuards(AdminJwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeChain(@Param('id', ParseUUIDPipe) chainId: string) {
    await this.service.removeChain(chainId);
  }

  @ApiBearerAuth()
  @Post('tokens/create')
  @UseGuards(AdminJwtGuard)
  @HttpCode(HttpStatus.CREATED)
  createToken(@Body() dto: CreateTokenDto) {
    return this.service.createToken(dto);
  }

  @ApiBearerAuth()
  @Patch('tokens/:id')
  @UseGuards(AdminJwtGuard)
  @HttpCode(HttpStatus.OK)
  updateToken(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTokenDto,
  ) {
    return this.service.updateToken(id, dto);
  }

  @ApiBearerAuth()
  @Delete('tokens/:id')
  @UseGuards(AdminJwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeToken(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.service.removeToken(id);
  }

  // POST /v1/routes (admin)
  @ApiBearerAuth()
  @Post('routes/create')
  @UseGuards(AdminJwtGuard)
  @HttpCode(HttpStatus.CREATED)
  createRoute(@Body() dto: CreateRouteDto) {
    return this.service.createRoute(dto);
  }

  // DELETE /v1/routes/:id (admin)
  @ApiBearerAuth()
  @Delete('routes/:id')
  @UseGuards(AdminJwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeRoute(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.service.removeRoute(id);
  }
}
