import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { env } from '@libs/configs';
import { randomUUID } from 'crypto';
import { PrismaService } from '@prisma/prisma.service';
import { EncryptionService } from '@libs/encryption.service';
import { AdminAuthDTO } from '../dto/admin.dto';
import { Request } from 'express';
import { ChainService } from '../chains/chain.service';
import { CreateChainDto, QueryChainsDto } from '../dto/chain.dto';
import { TokenService } from '../token/token.service';
import { CreateTokenDto } from '../dto/token.dto';
import { RoutesService } from '../routes/route.service';
import { CreateRouteDto } from '../dto/route.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly encryption: EncryptionService,
    private readonly ChainService: ChainService,
    private readonly tokenService: TokenService,
    private readonly routes: RoutesService,
  ) {}

  async addAdmin(req: Request, { email, password }: AdminAuthDTO) {
    try {
      const user = req.user;

      if (!user) throw new UnauthorizedException('Invalid credentials');

      const admin = await this.prisma.admin.findUnique({
        where: { id: user.sub },
      });

      if (!admin) throw new UnauthorizedException('Invalid credentials');

      const newAdmin = await this.prisma.admin.findUnique({
        where: { email: email },
      });

      if (newAdmin) {
        throw new UnauthorizedException('Admin already exists');
      }

      const hashedPassword = await this.encryption.hashPassword(password);

      await this.prisma.admin.create({
        data: { email, passwordHash: hashedPassword },
      });
    } catch (err) {
      console.error('Error adding admin:', err);
      throw err;
    }
  }

  async login(dto: AdminAuthDTO) {
    try {
      const admin = await this.prisma.admin.findUnique({
        where: { email: dto.email },
      });

      if (!admin) throw new UnauthorizedException('Invalid credentials');

      const ok = await this.encryption.verifyPassword(
        dto.password,
        admin.passwordHash,
      );

      if (!ok) throw new UnauthorizedException('Invalid credentials');

      const [access, refresh] = await Promise.all([
        this.jwt.signAsync(
          { sub: admin.id, scope: 'admin', typ: 'access' },
          { secret: env.jwt.secret, expiresIn: '15m', jwtid: randomUUID() },
        ),
        this.jwt.signAsync(
          { sub: admin.id, scope: 'admin', typ: 'refresh' },
          { secret: env.jwt.secret, expiresIn: '30d', jwtid: randomUUID() },
        ),
      ]);

      return { tokens: { access, refresh } };
    } catch (err) {
      console.error('Error during admin login:', err);
      throw err;
    }
  }

  async createChain(dto: CreateChainDto) {
    return this.ChainService.create(dto);
  }

  async removeChain(id: string) {
    return this.ChainService.remove(id);
  }

  async updateChain(id: string, dto: Partial<CreateChainDto>) {
    return this.ChainService.update(id, dto);
  }

  async listChains(query: QueryChainsDto) {
    const data = await this.ChainService.listChains(query);

    const rows = data.rows.map((c) => ({
      ...c,
      chainId: c.chainId.toString(),
    }));

    return { ...data, rows };
  }

  async createToken(dto: CreateTokenDto) {
    return this.tokenService.create(dto);
  }

  async updateToken(id: string, dto: Partial<CreateTokenDto>) {
    return this.tokenService.update(id, dto);
  }

  async removeToken(id: string) {
    return this.tokenService.remove(id);
  }

  async createRoute(dto: CreateRouteDto) {
    return this.routes.create(dto);
  }

  async removeRoute(id: string) {
    return this.routes.remove(id);
  }
}
