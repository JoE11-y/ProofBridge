import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { ChainService } from './chain.service';
import { QueryChainsDto } from './dto/chain.dto';
import { ParseChainIdPipe } from '../../common/pipes/parse-chain-id.pipe';

@Controller('v1/chains')
export class ChainController {
  constructor(private readonly chains: ChainService) {}

  // GET /v1/chains?name=&chainId=&limit=&cursor=
  @Get()
  @HttpCode(HttpStatus.OK)
  listChains(@Query() query: QueryChainsDto) {
    return this.chains.listChainsPublic(query);
  }

  // GET /v1/chains/:chainId
  @Get(':chainId')
  @HttpCode(HttpStatus.OK)
  getChain(@Param('chainId', ParseChainIdPipe) chainId: string) {
    return this.chains.getByChainId(chainId);
  }
}
