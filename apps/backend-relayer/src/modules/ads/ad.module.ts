import { Module } from '@nestjs/common';
import { AdsController } from './ad.controller';
import { AdsService } from './ad.service';
import { PrismaService } from '@prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ViemModule } from '../../providers/viem/viem.module';

@Module({
  imports: [JwtModule.register({}), ViemModule],
  controllers: [AdsController],
  providers: [AdsService, PrismaService, JwtService],
})
export class AdsModule {}
