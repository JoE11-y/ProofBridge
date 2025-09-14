import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '@prisma/prisma.service';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { EncryptionService } from '@libs/encryption.service';
import { ChainService } from '../chains/chain.service';
import { TokenService } from '../token/token.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AdminController],
  providers: [
    AdminService,
    PrismaService,
    ChainService,
    TokenService,
    EncryptionService,
  ],
})
export class AdminModule {}
