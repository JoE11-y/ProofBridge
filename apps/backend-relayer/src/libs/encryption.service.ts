import { hash as rawHash, verify as rawVerify } from '@node-rs/argon2';
import { Injectable } from '@nestjs/common';
import { env } from './configs';
import * as crypto from 'node:crypto';

type HashFn = (password: string) => Promise<string>;
type VerifyFn = (hash: string, password: string) => Promise<boolean>;

const hash: HashFn = rawHash as unknown as HashFn;
const verify: VerifyFn = rawVerify as unknown as VerifyFn;

@Injectable()
export class EncryptionService {
  async hashPassword(password: string): Promise<string> {
    const out = await hash(password);
    if (typeof out !== 'string')
      throw new TypeError('argon2.hash did not return a string');
    return out;
  }

  async verifyPassword(password: string, hashed: string): Promise<boolean> {
    const ok = await verify(hashed, password);
    return ok === true;
  }

  async encryptSecret(secret: string): Promise<{
    iv: string;
    ciphertext: string;
    secretHash: string;
    authTag: string;
  }> {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.getAesKey(), iv);

    const ciphertext = Buffer.concat([
      cipher.update(secret, 'utf8'),
      cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();

    return {
      iv: iv.toString('hex'),
      ciphertext: ciphertext.toString('hex'),
      authTag: authTag.toString('hex'),
      secretHash: await this.hashPassword(secret),
    };
  }

  decryptSecret(encrypted: {
    iv: string;
    ciphertext: string;
    authTag: string;
  }): string {
    const iv = Buffer.from(encrypted.iv, 'hex');
    const ciphertext = Buffer.from(encrypted.ciphertext, 'hex');
    const authTag = Buffer.from(encrypted.authTag, 'hex');

    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      this.getAesKey(),
      iv,
    );
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]);

    return decrypted.toString('utf8');
  }

  private getAesKey(): Buffer {
    const k = env.secretKey;
    if (!k) throw new Error('SECRET_KEY is required');
    const isHex = /^([0-9a-fA-F]{64})$/.test(k.replace(/^0x/, ''));
    const isB64 = /^(?:[A-Za-z0-9+/]{43}|[A-Za-z0-9+/]{44})=?$/.test(k);
    const buf = isHex
      ? Buffer.from(k.replace(/^0x/, ''), 'hex')
      : isB64
        ? Buffer.from(k, 'base64')
        : crypto.createHash('sha256').update(k, 'utf8').digest();
    if (buf.length !== 32)
      throw new Error('SECRET_KEY must resolve to 32 bytes');
    return buf;
  }
}
