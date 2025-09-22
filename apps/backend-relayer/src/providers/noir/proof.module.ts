import { Module } from '@nestjs/common';
import { ProofService } from './proof.service';

@Module({
  imports: [],
  providers: [ProofService],
  controllers: [],
  exports: [ProofService],
})
export class ProofModule {}
