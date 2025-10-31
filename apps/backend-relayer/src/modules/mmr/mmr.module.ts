import { Module } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { MMRService } from './mmr.service';
import { MMRController } from './mmr.controller';

@Module({
  imports: [],
  controllers: [MMRController],
  providers: [MMRService, PrismaService],
})
export class MMRModule {}
