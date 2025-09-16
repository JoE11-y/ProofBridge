import { Module } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [TokenController],
  providers: [TokenService, PrismaService, JwtService],
})
export class TokenModule {}
