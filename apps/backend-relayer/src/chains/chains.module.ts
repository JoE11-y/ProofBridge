import { Module } from '@nestjs/common';
import { ChainsController } from './chains.controller';
import { ChainsService } from './chains.service';
import { PrismaService } from '@prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  controllers: [ChainsController],
  providers: [ChainsService, PrismaService, JwtService],
})
export class ChainsModule {}
