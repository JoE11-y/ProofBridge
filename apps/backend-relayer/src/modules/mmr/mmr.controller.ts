import { Body, Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MMRService } from './mmr.service';
import { MerkleProof } from 'proofbridge-mmr';

@ApiTags('MMR')
@Controller('v1/mmr')
export class MMRController {
  constructor(private readonly mmrService: MMRService) {}

  @Get('proof')
  async getProof(
    @Body() dto: { mmrId: string; orderHash: string },
  ): Promise<MerkleProof> {
    return this.mmrService.getMerkleProof(dto.mmrId, dto.orderHash);
  }
}
