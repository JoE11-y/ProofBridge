import { Module } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TradesService } from './trade.service';
import { TradesController } from './trade.controller';
import { ViemModule } from '../../providers/viem/viem.module';
import { MMRService } from '../mmr/mmr.service';
import { ProofModule } from '../../providers/noir/proof.module';
import { EncryptionService } from '@libs/encryption.service';
import { ErrorService } from '@libs/error.service';
import { ResponseService } from '@libs/response.service';

@Module({
  imports: [JwtModule.register({}), ViemModule, ProofModule],
  controllers: [TradesController],
  providers: [
    TradesService,
    PrismaService,
    MMRService,
    EncryptionService,
    JwtService,
    ResponseService,
    ErrorService,
  ],
})
export class TradesModule {}
