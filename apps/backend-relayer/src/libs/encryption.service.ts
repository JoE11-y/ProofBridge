import { hash as rawHash, verify as rawVerify } from '@node-rs/argon2';
import { Injectable } from '@nestjs/common';

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
}
