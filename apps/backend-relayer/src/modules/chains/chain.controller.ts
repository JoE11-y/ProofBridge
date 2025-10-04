import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { ChainService } from './chain.service';
import {
  ChainResponseDto,
  ListChainsResponseDto,
  QueryChainsDto,
} from './dto/chain.dto';
import { ParseChainIdPipe } from '../../common/pipes/parse-chain-id.pipe';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Chains')
@Controller('v1/chains')
export class ChainController {
  constructor(private readonly chains: ChainService) {}

  // GET /v1/chains?name=&chainId=&limit=&cursor=
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns a list of supported chains based on query parameters',
    type: ListChainsResponseDto,
  })
  listChains(@Query() query: QueryChainsDto): Promise<ListChainsResponseDto> {
    return this.chains.listChainsPublic(query);
  }

  // GET /v1/chains/:chainId
  @Get(':chainId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns chain details by chain ID',
    type: ChainResponseDto,
  })
  getChain(
    @Param('chainId', ParseChainIdPipe) chainId: string,
  ): Promise<ChainResponseDto> {
    return this.chains.getByChainId(chainId);
  }
}
