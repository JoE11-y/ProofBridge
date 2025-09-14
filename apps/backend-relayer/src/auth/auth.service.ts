/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
import { SiweMessage, SiweResponse } from 'siwe';

const CLOCK_SKEWMS = 60_000;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async prepare(address: string) {
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
      console.log(error);
    }
  }

  async verify(messageRaw: string, signature: string) {
    // Parse SIWE message
    let msg: SiweMessage;
    try {
      msg = new SiweMessage(messageRaw);
    } catch {
      throw new BadRequestException('Invalid SIWE message');
    }

    // Validate domain/uri/exp windows (preflight, cheap)
    if (msg.domain !== env.appDomain)
      throw new BadRequestException('Wrong domain');
    if (msg.uri !== env.appUri) throw new BadRequestException('Wrong URI');

    const now = Date.now();

    if (msg.expirationTime) {
      const exp = new Date(msg.expirationTime).getTime();
      if (Number.isNaN(exp) || exp < now - CLOCK_SKEWMS)
        throw new BadRequestException('Expired message');
    }
    if (msg.notBefore) {
      const nbf = new Date(msg.notBefore).getTime();
      if (Number.isNaN(nbf) || nbf > now + CLOCK_SKEWMS)
        throw new BadRequestException('Not yet valid');
    }

    // Verify signature
    let result: SiweResponse;
    try {
      result = await msg.verify({
        signature,
        domain: env.appDomain,
        nonce: msg.nonce,
      });
    } catch {
      throw new BadRequestException('Bad signature');
    }

    if (!result.success) throw new UnauthorizedException('Verification failed');

    const { user } = await this.prisma.$transaction(async (tx) => {
      // Fetch nonce row (bound to wallet), ensure not used/expired
      const nonceRow = await tx.authNonce.findUnique({
        where: {
          value: msg.nonce,
          walletAddress: msg.address,
        },
      });

      if (!nonceRow) throw new BadRequestException('Unknown nonce');
      if (nonceRow.usedAt) throw new BadRequestException('Nonce already used');
      if (nonceRow.expiresAt.getTime() < now - CLOCK_SKEWMS)
        throw new BadRequestException('Nonce expired');

      // Mark nonce used (you could also delete it instead of marking)
      await tx.authNonce.update({
        where: {
          value: msg.nonce,
          walletAddress: msg.address,
        },
        data: { usedAt: new Date() },
      });

      // Upsert user by wallet address
      const addr = msg.address;
      const user = await tx.user.upsert({
        where: { walletAddress: addr },
        create: {
          walletAddress: addr,
          username: this.generateUniqueName(),
        },
        update: {},
        select: { id: true, username: true, walletAddress: true },
      });

      return { user };
    });

    const access = await this.jwt.signAsync(
      { sub: user.id, addr: user.walletAddress, typ: 'access' },
      { secret: env.jwt.secret, expiresIn: '15m' },
    );
    const refresh = await this.jwt.signAsync(
      { sub: user.id, addr: user.walletAddress, typ: 'refresh' },
      { secret: env.jwt.secret, expiresIn: '30d' },
    );

    return {
      user: { id: user.id, username: user.username },
      tokens: { access, refresh },
    };
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
