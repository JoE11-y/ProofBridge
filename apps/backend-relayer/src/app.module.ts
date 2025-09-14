import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from '@prisma/prisma.service';
import { AdminModule } from './admin/admin.module';
import { ChainModule } from './chains/chain.module';
import { TokenModule } from './tokens/token.module';

@Module({
  imports: [AuthModule, AdminModule, ChainModule, TokenModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
