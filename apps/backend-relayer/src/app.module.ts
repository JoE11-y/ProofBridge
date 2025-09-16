import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from '@prisma/prisma.service';
import { AdminModule } from './admin/admin.module';
import { ChainModule } from './chains/chain.module';
import { TokenModule } from './token/token.module';
import { RoutesModule } from './routes/route.module';
import { AdsModule } from './ads/ad.module';

@Module({
  imports: [
    AuthModule,
    AdminModule,
    ChainModule,
    TokenModule,
    RoutesModule,
    AdsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
