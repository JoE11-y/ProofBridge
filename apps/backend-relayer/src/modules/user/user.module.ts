import { Module } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [UserModule],
  providers: [UserService, PrismaService, JwtService],
})
export class UserModule {}
