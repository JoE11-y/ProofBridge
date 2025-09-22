import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  uniqueNamesGenerator,
  adjectives,
  names,
} from 'unique-names-generator';
import { JwtService } from '@nestjs/jwt';
import { env } from '@libs/configs';
import { PrismaService } from '@prisma/prisma.service';
import { SiweMessage } from 'siwe';
import { randomUUID } from 'crypto';
import { ethers } from 'ethers';

const CLOCK_SKEW_MS = 60_000; // 1 minute

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async challenge(address: string) {
    if (!ethers.isAddress(address)) {
      throw new BadRequestException('Invalid EVM format');
    }

    try {
      const value = crypto.randomUUID().replace(/-/g, ''); // 32 hex-like chars
      const expiresAt = new Date(Date.now() + 5 * 60_000); // 5 min
      await this.prisma.authNonce.create({
        data: { value, expiresAt, walletAddress: address },
      });
      return {
        nonce: value,
        address,
        expiresAt: expiresAt.toISOString(),
        domain: env.appDomain,
        uri: env.appUri,
      };
    } catch (error) {
      console.error('Failed to create auth nonce', error);
      throw new BadRequestException('Failed to create authentication nonce');
    }
  }

  async login(messageRaw: string, signature: string) {
    const msg = this.parseSiwe(messageRaw);

    this.assertDomainAndUri(msg);
    this.assertTimeWindows(msg, Date.now());

    await this.verifySignature(msg, signature);

    const user = await this.consumeNonceAndUpsertUser(msg.address, msg.nonce);

    const [access, refresh] = await Promise.all([
      this.jwt.signAsync(
        { sub: user.id, addr: user.walletAddress, typ: 'access' },
        { secret: env.jwt.secret, expiresIn: '15m', jwtid: randomUUID() },
      ),
      this.jwt.signAsync(
        { sub: user.id, addr: user.walletAddress, typ: 'refresh' },
        { secret: env.jwt.secret, expiresIn: '30d', jwtid: randomUUID() },
      ),
    ]);

    return {
      user: { id: user.id, username: user.username },
      tokens: { access, refresh },
    };
  }

  async refresh(refreshToken: string) {
    // Verify refresh JWT
    let payload: { sub: string; addr: string; typ?: string };
    try {
      payload = await this.jwt.verifyAsync(refreshToken, {
        secret: env.jwt.secret,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
    if (payload.typ !== 'refresh') {
      throw new UnauthorizedException('Wrong token type');
    }

    // Ensure user still exists / allowed
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, walletAddress: true },
    });
    if (!user || user.walletAddress !== payload.addr) {
      throw new UnauthorizedException('User not found or mismatched address');
    }

    const [access, newRefresh] = await Promise.all([
      this.jwt.signAsync(
        { sub: user.id, addr: user.walletAddress, typ: 'access' },
        { secret: env.jwt.secret, expiresIn: '15m', jwtid: randomUUID() },
      ),
      this.jwt.signAsync(
        { sub: user.id, addr: user.walletAddress, typ: 'refresh' },
        { secret: env.jwt.secret, expiresIn: '30d', jwtid: randomUUID() },
      ),
    ]);
    return {
      tokens: { access, refresh: newRefresh },
    };
  }

  /* --------------------------- private helpers --------------------------- */

  private parseSiwe(messageRaw: string): SiweMessage {
    try {
      return new SiweMessage(messageRaw);
    } catch {
      throw new BadRequestException('Invalid SIWE message');
    }
  }

  private assertDomainAndUri(msg: SiweMessage): void {
    if (msg.domain !== env.appDomain)
      throw new BadRequestException('Wrong domain');
    if (msg.uri !== env.appUri) throw new BadRequestException('Wrong URI');
  }

  private assertTimeWindows(msg: SiweMessage, nowMs: number): void {
    if (msg.expirationTime) {
      const exp = new Date(msg.expirationTime).getTime();
      if (Number.isNaN(exp) || exp < nowMs - CLOCK_SKEW_MS) {
        throw new BadRequestException('Expired message');
      }
    }
    if (msg.notBefore) {
      const nbf = new Date(msg.notBefore).getTime();
      if (Number.isNaN(nbf) || nbf > nowMs + CLOCK_SKEW_MS) {
        throw new BadRequestException('Not yet valid');
      }
    }
  }

  private async verifySignature(
    msg: SiweMessage,
    signature: string,
  ): Promise<void> {
    try {
      const res = await msg.verify({
        signature,
        domain: env.appDomain,
        nonce: msg.nonce,
      });
      if (!res.success) throw new UnauthorizedException('Verification failed');
    } catch (e) {
      if (!(e instanceof UnauthorizedException)) {
        throw new UnauthorizedException('Bad signature');
      }
      throw e;
    }
  }

  private async consumeNonceAndUpsertUser(address: string, nonce: string) {
    const now = Date.now();

    const { user } = await this.prisma.$transaction(async (tx) => {
      // requires @@unique([value, walletAddress]) on AuthNonce
      const nonceRow = await tx.authNonce.findUnique({
        where: {
          value: nonce,
          walletAddress: address,
        },
      });

      if (!nonceRow) throw new BadRequestException('Unknown nonce');
      if (nonceRow.usedAt) throw new BadRequestException('Nonce already used');
      if (nonceRow.expiresAt.getTime() < now - CLOCK_SKEW_MS) {
        throw new BadRequestException('Nonce expired');
      }

      await tx.authNonce.update({
        where: {
          value: nonce,
          walletAddress: address,
        },
        data: { usedAt: new Date() },
      });

      const user = await tx.user.upsert({
        where: { walletAddress: address },
        create: { walletAddress: address, username: this.generateUniqueName() },
        update: {},
        select: { id: true, username: true, walletAddress: true },
      });

      return { user };
    });

    return user;
  }

  private generateUniqueName(): string {
    const uniqueName = uniqueNamesGenerator({
      dictionaries: [adjectives, names],
      separator: '-',
      length: 2,
      style: 'lowerCase',
    });
    return uniqueName;
  }
}
