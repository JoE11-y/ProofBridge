import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '@prisma/prisma.service';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { EncryptionService } from '@libs/encryption.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AdminController],
  providers: [AdminService, PrismaService, EncryptionService],
})
export class AdminModule {}
