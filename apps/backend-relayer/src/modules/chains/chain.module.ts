import { Module } from '@nestjs/common';
import { ChainController } from './chain.controller';
import { ChainService } from './chain.service';
import { PrismaService } from '@prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  controllers: [ChainController],
  providers: [ChainService, PrismaService, JwtService],
})
export class ChainModule {}
