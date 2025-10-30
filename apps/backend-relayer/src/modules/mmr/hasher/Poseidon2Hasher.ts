/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { poseidon2Hash } from '@zkpassport/poseidon2';

export type HasherOptions = {
  blockSizeBits: number;
  shouldPad?: boolean;
};

export declare const defaultHasherOptions: HasherOptions;

export type HexString = string;
export declare const GENESIS_STRING = 'brave new world';
export declare abstract class IHasher {
  readonly options: HasherOptions;
  constructor(options?: HasherOptions);
  abstract hash(data: HexString[]): HexString;
  isElementSizeValid: (element: HexString) => boolean;
  static byteSize: (str: string) => number;
  hashSingle: (data: string) => string;
  getGenesis(): HexString;
}

const P =
  21888242871839275222246405745257275088548364400416034343698204186575808495617n;

const mod = (x: bigint) => {
  const r = x % P;
  return r >= 0n ? r : r + P;
};

export class Poseidon2Hasher extends IHasher {
  constructor(opts?: Partial<{ shouldPad: boolean; blockSizeBits: number }>) {
    super({
      ...defaultHasherOptions,
      blockSizeBits: 254,
      shouldPad: opts?.shouldPad ?? true,
    });
  }

  hash(data: HexString[]): HexString {
    if (!data.every((e) => this.isElementSizeValid(e))) {
      const bad = data.find((e) => !this.isElementSizeValid(e))!;
      throw new Error(
        `Poseidon2 Hasher only accepts elements of size ${this.options.blockSizeBits} bits. ` +
          `Got ${JSON.stringify(IHasher.byteSize(bad))}`,
      );
    }

    const inputs = data.map((d) => this.toFieldBigint(d));

    const res = poseidon2Hash(inputs);
    const out = mod(res);

    let hex = out.toString(16);
    if (this.options.shouldPad) hex = hex.padStart(64, '0');
    return `0x${hex}`;
  }

  private toFieldBigint(x: string | number | bigint): bigint {
    if (typeof x === 'bigint') return mod(x);
    if (typeof x === 'number') {
      if (!Number.isSafeInteger(x))
        throw new Error('Use bigint/string for large integers.');
      return mod(BigInt(x));
    }
    const s = x.trim().toLowerCase();

    if (s.startsWith('0x')) {
      this.assertHex(s.slice(2));
      return mod(BigInt(s));
    }
    if (/^\d+$/.test(s)) {
      return mod(BigInt(s));
    }
    throw new Error(`Invalid element "${x}". Use decimal digits or 0x<hex>.`);
  }

  private assertHex(h: string) {
    if (!/^[0-9a-f]*$/.test(h)) throw new Error(`Non-hex characters in "${h}"`);
  }
}
