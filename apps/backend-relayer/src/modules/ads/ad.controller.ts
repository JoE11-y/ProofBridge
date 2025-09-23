import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AdsService } from './ad.service';
import {
  CreateAdDto,
  FundAdDto,
  QueryAdsDto,
  UpdateAdDto,
  WithdrawalAdDto,
  ConfirmAdActionDto,
  CloseAdDto,
  ListAdResponseDto,
  AdResponseDto,
  CreateAdResponseDto,
  FundAdResponseDto,
  WithdrawAdResponseDto,
  ConfirmChainActionResponseDto,
  AdUpdateResponseDto,
  CloseAdResponseDto,
} from '../ads/dto/ad.dto';
import type { Request } from 'express';
import { UserJwtGuard } from '../../common/guards/user-jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiTags('Ads')
@Controller('v1/ads')
export class AdsController {
  constructor(private readonly ads: AdsService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  list(@Query() query: QueryAdsDto): Promise<ListAdResponseDto> {
    return this.ads.list(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  get(@Param('id', new ParseUUIDPipe()) id: string): Promise<AdResponseDto> {
    return this.ads.getById(id);
  }

  @ApiBearerAuth()
  @Post('create')
  @UseGuards(UserJwtGuard)
  @HttpCode(HttpStatus.CREATED)
  create(
    @Req() req: Request,
    @Body() dto: CreateAdDto,
  ): Promise<CreateAdResponseDto> {
    return this.ads.create(req, dto);
  }

  @ApiBearerAuth()
  @Post(':id/fund')
  @UseGuards(UserJwtGuard)
  @HttpCode(HttpStatus.OK)
  fund(
    @Req() req: Request,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: FundAdDto,
  ): Promise<FundAdResponseDto> {
    return this.ads.fund(req, id, dto);
  }

  @ApiBearerAuth()
  @Post(':id/withdraw')
  @UseGuards(UserJwtGuard)
  @HttpCode(HttpStatus.OK)
  withdraw(
    @Req() req: Request,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: WithdrawalAdDto,
  ): Promise<WithdrawAdResponseDto> {
    return this.ads.withdraw(req, id, dto);
  }

  @ApiBearerAuth()
  @Post(':id/confirm')
  @UseGuards(UserJwtGuard)
  @HttpCode(HttpStatus.OK)
  confirmUpdate(
    @Req() req: Request,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: ConfirmAdActionDto,
  ): Promise<ConfirmChainActionResponseDto> {
    return this.ads.confirmChainAction(req, id, dto);
  }

  @ApiBearerAuth()
  @Patch(':id/update')
  @UseGuards(UserJwtGuard)
  @HttpCode(HttpStatus.OK)
  update(
    @Req() req: Request,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateAdDto,
  ): Promise<AdUpdateResponseDto> {
    return this.ads.update(req, id, dto);
  }

  @ApiBearerAuth()
  @Post(':id/close')
  @UseGuards(UserJwtGuard)
  @HttpCode(HttpStatus.OK)
  async close(
    @Req() req: Request,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: CloseAdDto,
  ): Promise<CloseAdResponseDto> {
    return this.ads.close(req, id, dto);
  }
}
