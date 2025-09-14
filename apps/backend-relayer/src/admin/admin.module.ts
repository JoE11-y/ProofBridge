import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '@prisma/prisma.service';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { EncryptionService } from '@libs/encryption.service';
import { ChainsService } from '../chains/chains.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AdminController],
  providers: [AdminService, PrismaService, ChainsService, EncryptionService],
})
export class AdminModule {}
