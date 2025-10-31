import { poseidon2Hash } from "@zkpassport/poseidon2";

export class Poseidon2Hasher {
  // Private constants
  private readonly maxBits: number = 254;
  private readonly shouldPad: boolean = true;
  private readonly P: bigint =
    21888242871839275222246405745257275088548364400416034343698204186575808495617n;

  // Public static methods
  public static byteSize(str: string): number {
    return new Blob([str.startsWith("0x") ? str.slice(2) : str]).size;
  }

  // Public instance methods
  public hash(input: Buffer[]): Buffer {
    const data = input.map(this.bufferToHex);

    if (!data.every(this.isElementSizeValid)) {
      const bad = data.find((e) => !this.isElementSizeValid(e))!;
      throw new Error(
        `Poseidon2 Hasher only accepts elements of size ${this.maxBits} bits. ` +
          `Got ${JSON.stringify(Poseidon2Hasher.byteSize(bad))}`
      );
    }

    const inputs = data.map((d) => this.toFieldBigint(d));
    const res = poseidon2Hash(inputs);
    const out = this.mod(res);

    let hex = out.toString(16);
    if (this.shouldPad) {
      hex = hex.padStart(64, "0");
    }

    return Buffer.from(hex, "hex");
  }

  public isElementSizeValid = (element: string): boolean =>
    Poseidon2Hasher.byteSize(element) <= this.maxBits;

  // Private helper methods
  private toFieldBigint(x: string | number | bigint): bigint {
    if (typeof x === "bigint") return this.mod(x);
    if (typeof x === "number") {
      if (!Number.isSafeInteger(x)) {
        throw new Error("Use bigint/string for large integers.");
      }
      return this.mod(BigInt(x));
    }

    const s = x.trim().toLowerCase();
    if (s.startsWith("0x")) {
      this.assertHex(s.slice(2));
      return this.mod(BigInt(s));
    }
    if (/^\d+$/.test(s)) {
      return this.mod(BigInt(s));
    }

    throw new Error(`Invalid element "${x}". Use decimal digits or 0x<hex>.`);
  }

  private assertHex(h: string): void {
    if (!/^[0-9a-f]*$/.test(h)) {
      throw new Error(`Non-hex characters in "${h}"`);
    }
  }

  private bufferToHex(data: Buffer): string {
    return "0x" + data.toString("hex");
  }

  private mod(x: bigint): bigint {
    const r = x % this.P;
    return r >= 0n ? r : r + this.P;
  }
}
