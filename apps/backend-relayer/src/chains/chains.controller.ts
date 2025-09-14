import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { ChainsService } from './chains.service';
import { QueryChainsDto } from '../dto/chain.dto';
import { ParseChainIdPipe } from '../common/pipes/parse-chain-id.pipe';

@Controller('v1/chains')
export class ChainsController {
  constructor(private readonly chains: ChainsService) {}

  // GET /v1/chains?name=&chainId=&limit=&cursor=
  @Get()
  @HttpCode(HttpStatus.OK)
  listChains(@Query() query: QueryChainsDto) {
    return this.chains.listChains(query);
  }

  // GET /v1/chains/:chainId
  @Get(':chainId')
  @HttpCode(HttpStatus.OK)
  getChain(@Param('chainId', ParseChainIdPipe) chainId: string) {
    return this.chains.getByChainId(chainId);
  }
}
