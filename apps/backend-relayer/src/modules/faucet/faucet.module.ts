import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from '@prisma/prisma.service';
import { FaucetController } from './faucet.controller';
import { FaucetService } from './faucet.service';
import { ViemService } from '../../providers/viem/viem.service';
import { UserJwtGuard } from '../../common/guards/user-jwt.guard';

@Module({
  imports: [JwtModule.register({})],
  controllers: [FaucetController],
  providers: [
    FaucetService,
    PrismaService,
    ViemService,
    UserJwtGuard,
    JwtService,
  ],
})
export class FaucetModule {}
