import { Module } from '@nestjs/common';
import { AdsController } from './ad.controller';
import { AdsService } from './ad.service';
import { PrismaService } from '@prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ViemModule } from '../../providers/viem/viem.module';
import { ErrorService } from '@libs/error.service';
import { ResponseService } from '@libs/response.service';

@Module({
  imports: [JwtModule.register({}), ViemModule],
  controllers: [AdsController],
  providers: [
    AdsService,
    PrismaService,
    JwtService,
    ResponseService,
    ErrorService,
  ],
})
export class AdsModule {}
