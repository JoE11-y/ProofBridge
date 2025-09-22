import { Module } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TradesService } from './trade.service';
import { TradesController } from './trade.controller';
import { ViemModule } from '../../providers/viem/viem.module';
import { MMRService } from '../mmr/mmr.service';
import { ProofModule } from '../../providers/noir/proof.module';

@Module({
  imports: [JwtModule.register({}), ViemModule, ProofModule],
  controllers: [TradesController],
  providers: [TradesService, PrismaService, MMRService, JwtService],
})
export class TradesModule {}
