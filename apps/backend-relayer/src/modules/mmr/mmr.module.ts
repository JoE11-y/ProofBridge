import { Module } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { MMRService } from './mmr.service';

@Module({
  imports: [],
  controllers: [],
  providers: [MMRService, PrismaService],
})
export class MMRModule {}
