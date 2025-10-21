import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MMRService } from './mmr.service';
import { Proof } from '@accumulators/merkle-mountain-range';

@ApiTags('MMR')
@Controller('v1/mmr')
export class MMRController {
  constructor(private readonly mmrService: MMRService) {}

  @Post('append')
  async append(
    @Body() dto: { mmrId: string; orderHash: string },
  ): Promise<{ elementIndex: number; x: string }> {
    return this.mmrService.append(dto.mmrId, dto.orderHash);
  }

  @Get('proof')
  async getProof(
    @Body() dto: { mmrId: string; orderHash: string },
  ): Promise<Proof> {
    return this.mmrService.getMerkleProof(dto.mmrId, dto.orderHash);
  }
}
