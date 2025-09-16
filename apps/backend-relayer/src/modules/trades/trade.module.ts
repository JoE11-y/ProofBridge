import { Module } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TradesService } from './trade.service';
import { TradesController } from './trade.controller';

@Module({
  imports: [JwtModule.register({})],
  controllers: [TradesController],
  providers: [TradesService, PrismaService, JwtService],
})
export class TradesModule {}
