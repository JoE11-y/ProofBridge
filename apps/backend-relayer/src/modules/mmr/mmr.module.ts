import { Module } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { MMRService } from './mmr.service';
import { MmrController } from './mmr.controller';

@Module({
  imports: [],
  controllers: [MmrController],
  providers: [MMRService, PrismaService],
})
export class MMRModule {}
