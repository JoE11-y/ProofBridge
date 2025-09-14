import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { env } from '@libs/configs';
import { randomUUID } from 'crypto';
import { PrismaService } from '@prisma/prisma.service';
import { EncryptionService } from '@libs/encryption.service';
import { AdminAuthDTO } from '../dto/admin.dto';
import { Request } from 'express';
import { ChainsService } from '../chains/chains.service';
import { CreateChainDto, QueryChainsDto } from '../dto/chain.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly encryption: EncryptionService,
    private readonly chainsService: ChainsService,
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
    return this.chainsService.create(dto);
  }

  async removeChain(id: string) {
    return this.chainsService.remove(id);
  }

  async updateChain(id: string, dto: Partial<CreateChainDto>) {
    return this.chainsService.update(id, dto);
  }

  async listChains(query: QueryChainsDto) {
    const data = await this.chainsService.listChains(query);

    const rows = data.rows.map((c) => ({
      ...c,
      chainId: c.chainId.toString(),
    }));

    return { ...data, rows };
  }
}
