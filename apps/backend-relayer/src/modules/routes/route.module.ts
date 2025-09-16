import { Module } from '@nestjs/common';
import { RoutesController } from './route.controller';
import { RoutesService } from './route.service';
import { PrismaService } from '@prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [RoutesController],
  providers: [RoutesService, PrismaService, JwtService],
})
export class RoutesModule {}
