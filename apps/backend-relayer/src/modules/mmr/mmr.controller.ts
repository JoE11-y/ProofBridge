import { Body, Controller, Post } from '@nestjs/common';
import { MMRService } from './mmr.service';

@Controller('v1/mmr')
export class MmrController {
  constructor(private readonly mmrService: MMRService) {}

  @Post('append')
  async appendLeaf(@Body() body: { mmrId: string; orderHash: string }) {
    await this.mmrService.append(body.mmrId, body.orderHash);
  }
}
