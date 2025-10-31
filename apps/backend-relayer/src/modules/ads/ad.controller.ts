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
  Res,
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
  ConfirmChainActionADResponseDto,
  AdUpdateResponseDto,
  CloseAdResponseDto,
} from '../ads/dto/ad.dto';
import type { Request, Response } from 'express';
import { UserJwtGuard } from '../../common/guards/user-jwt.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('Ads')
@Controller('v1/ads')
export class AdsController {
  constructor(private readonly ads: AdsService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns a list of ad based on the query parameters',
    type: ListAdResponseDto,
  })
  list(@Query() query: QueryAdsDto): Promise<ListAdResponseDto> {
    return this.ads.list(query);
  }
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns an ad by ID',
    type: AdResponseDto,
  })
  get(@Param('id', new ParseUUIDPipe()) id: string): Promise<AdResponseDto> {
    return this.ads.getById(id);
  }

  @ApiBearerAuth()
  @Post('create')
  @UseGuards(UserJwtGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:
      'Creates a new ad and returns the transaction data for blockchain execution',
    type: CreateAdResponseDto,
  })
  create(@Req() req: Request, @Res() res: Response, @Body() dto: CreateAdDto) {
    return this.ads.create(req, res, dto);
  }

  @ApiBearerAuth()
  @Post(':id/fund')
  @UseGuards(UserJwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Funds an existing ad and returns the transaction data for blockchain execution',
    type: FundAdResponseDto,
  })
  fund(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: FundAdDto,
  ) {
    return this.ads.fund(req, res, id, dto);
  }

  @ApiBearerAuth()
  @Post(':id/withdraw')
  @UseGuards(UserJwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Initiates withdrawal of funds from an ad and returns the transaction data for blockchain execution',
    type: WithdrawAdResponseDto,
  })
  withdraw(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: WithdrawalAdDto,
  ) {
    return this.ads.withdraw(req, res, id, dto);
  }

  @ApiBearerAuth()
  @Post(':id/confirm')
  @UseGuards(UserJwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Confirms a chain action for an ad',
    type: ConfirmChainActionADResponseDto,
  })
  confirmUpdate(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: ConfirmAdActionDto,
  ) {
    return this.ads.confirmChainAction(req, res, id, dto);
  }

  @ApiBearerAuth()
  @Patch(':id/update')
  @UseGuards(UserJwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Updates an existing ad',
    type: AdUpdateResponseDto,
  })
  update(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateAdDto,
  ) {
    return this.ads.update(req, res, id, dto);
  }

  @ApiBearerAuth()
  @Post(':id/close')
  @UseGuards(UserJwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Closes an ad and returns the transaction data for blockchain execution',
    type: CloseAdResponseDto,
  })
  async close(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: CloseAdDto,
  ) {
    return this.ads.close(req, res, id, dto);
  }
}
