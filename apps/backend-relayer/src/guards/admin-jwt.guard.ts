/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { JwtService } from '@nestjs/jwt';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { env } from '@libs/configs';
import { Request } from 'express';

@Injectable()
export class AdminJwtGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const token =
      req.headers['authorization']?.split('Bearer ')[1] ?? undefined;

    if (!token) return false;

    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: env.jwt.secret,
      });

      this.prisma.admin
        .findUnique({
          where: { id: decoded.sub },
        })
        .then((res) => {
          if (!res) {
            return false;
          }
        })
        .catch(() => {
          return false;
        });

      req.user = decoded;
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
