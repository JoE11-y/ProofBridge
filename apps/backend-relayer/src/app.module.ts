import { Module } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { ChainModule } from './modules/chains/chain.module';
import { TokenModule } from './modules/token/token.module';
import { RoutesModule } from './modules/routes/route.module';
import { AdsModule } from './modules/ads/ad.module';

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
