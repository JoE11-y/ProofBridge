import { Buffer } from "buffer";
import { Poseidon2Hasher } from "./Hasher";
import LevelDB from "./LevelDB";
import CryptoJS from "crypto-js";

export class MerkleMountainRange {
  // Public state
  root: Buffer = Buffer.alloc(0);
  size = 0;
  width = 0;

  // Cache: index -> node hash
  private hashes: Record<number, Buffer> = {};

  private readonly hasher: Poseidon2Hasher;
  private readonly db: LevelDB;
  private readonly mmrId: string;

  // ---- Constants / Utils ----------------------------------------------------

  private static readonly WORD_SIZE = 32; // 32 bytes
  private static readonly HEX_RE = /^(0x)?[0-9a-fA-F]*$/;
  private static readonly BN254_P =
    0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001n;

  private static padLeft(
    buf: Buffer,
    size = MerkleMountainRange.WORD_SIZE
  ): Buffer {
    if (buf.length === size) return buf;
    if (buf.length > size) return buf.subarray(buf.length - size);
    const out = Buffer.alloc(size);
    buf.copy(out, size - buf.length);
    return out;
  }

  private static hexToBuf(hex: string): Buffer {
    const h = hex.startsWith("0x") ? hex.slice(2) : hex;
    return Buffer.from(h.length % 2 ? "0" + h : h, "hex");
  }

  private static toBigInt(value: unknown): bigint {
    if (typeof value === "bigint") return value;

    if (typeof value === "number") {
      if (!Number.isSafeInteger(value) || value < 0) {
        throw new Error("toBigInt: number must be a non-negative safe integer");
      }
      return BigInt(value);
    }

    if (typeof value === "string") {
      if (MerkleMountainRange.HEX_RE.test(value)) {
        const h = value.startsWith("0x") ? value.slice(2) : value;
        return BigInt("0x" + (h.length % 2 ? "0" + h : h || "0"));
      }
      // fallthrough tries decimal
      return BigInt(value);
    }

    if (Buffer.isBuffer(value)) {
      const h = value.toString("hex");
      return BigInt("0x" + (h.length % 2 ? "0" + h : h || "0"));
    }

    if (value instanceof Uint8Array) {
      const h = Buffer.from(value).toString("hex");
      return BigInt("0x" + (h.length % 2 ? "0" + h : h || "0"));
    }

    throw new Error("toBigInt: unsupported type");
  }

  /** Fixed-size 32-byte big-endian bufferify */
  private static bufferify(
    value: unknown,
    opts: { size?: number; allowUtf8?: boolean } = {}
  ): Buffer {
    const size = opts.size ?? MerkleMountainRange.WORD_SIZE;

    if (Buffer.isBuffer(value)) return MerkleMountainRange.padLeft(value, size);

    if (value instanceof Uint8Array || ArrayBuffer.isView(value)) {
      return MerkleMountainRange.padLeft(
        Buffer.from(
          value.buffer,
          (value as Uint8Array).byteOffset,
          (value as Uint8Array).byteLength
        ),
        size
      );
    }
    if (value instanceof ArrayBuffer) {
      return MerkleMountainRange.padLeft(Buffer.from(value), size);
    }

    if (typeof value === "string") {
      if (MerkleMountainRange.HEX_RE.test(value)) {
        return MerkleMountainRange.padLeft(
          MerkleMountainRange.hexToBuf(value),
          size
        );
      }
      if (opts.allowUtf8)
        return MerkleMountainRange.padLeft(Buffer.from(value, "utf8"), size);
      throw new Error(
        "bufferify: string must be hex; use {allowUtf8:true} for UTF-8"
      );
    }

    if (typeof value === "bigint") {
      if (value < 0n)
        throw new Error("bufferify: negative bigint not supported");
      const hex = value.toString(16);
      return MerkleMountainRange.padLeft(
        Buffer.from(hex.length % 2 ? "0" + hex : hex, "hex"),
        size
      );
    }

    if (typeof value === "number") {
      if (!Number.isSafeInteger(value) || value < 0) {
        throw new Error(
          "bufferify: number must be a non-negative safe integer"
        );
      }
      const hex = value.toString(16);
      return MerkleMountainRange.padLeft(
        Buffer.from(hex.length % 2 ? "0" + hex : hex, "hex"),
        size
      );
    }

    // CryptoJS WordArray support (duck-typed)
    if (
      value &&
      typeof value === "object" &&
      (value as any).words &&
      typeof (value as any).toString === "function"
    ) {
      const hex = (value as any).toString(CryptoJS.enc.Hex);
      return MerkleMountainRange.padLeft(Buffer.from(hex, "hex"), size);
    }

    // default zero
    return Buffer.alloc(size);
  }

  private static toHex(value: Buffer, with0x = true): string {
    return `${with0x ? "0x" : ""}${(value || Buffer.alloc(0)).toString("hex")}`;
  }

  private static fieldMod(x: Buffer | string | number | bigint): Buffer {
    const v = MerkleMountainRange.toBigInt(x) % MerkleMountainRange.BN254_P;
    return MerkleMountainRange.bufferify(v);
  }

  // ---- ctor / init ----------------------------------------------------------

  constructor(mmrId: string, db: LevelDB, hasher: Poseidon2Hasher) {
    this.mmrId = mmrId;
    this.db = db;
    this.hasher = hasher;
  }

  async init(leaves: Array<Buffer | string> = []): Promise<void> {
    await this.loadFromDB();
    for (const leaf of leaves) {
      await this.append(leaf);
    }
  }

  // ---- DB keys / persistence ------------------------------------------------

  private keyRoot() {
    return `${this.mmrId}:root`;
  }
  private keySize() {
    return `${this.mmrId}:size`;
  }
  private keyWidth() {
    return `${this.mmrId}:width`;
  }
  private keyHash(i: number) {
    return `${this.mmrId}:hash:${i}`;
  }

  private async loadFromDB(): Promise<void> {
    const [root, size, width] = await Promise.all([
      this.db.get(this.keyRoot()),
      this.db.get(this.keySize()),
      this.db.get(this.keyWidth()),
    ]);

    if (root) this.root = MerkleMountainRange.hexToBuf(root);
    if (size) this.size = parseInt(size, 10);
    if (width) this.width = parseInt(width, 10);
    // node hashes: lazy-loaded via getHashAt()
  }

  private async loadHash(index: number): Promise<Buffer | undefined> {
    const hex = await this.db.get(this.keyHash(index));
    return hex ? MerkleMountainRange.hexToBuf(hex) : undefined;
  }

  private async getHashAt(index: number): Promise<Buffer | undefined> {
    const cached = this.hashes[index];
    if (cached) return cached;
    const h = await this.loadHash(index);
    if (h) this.hashes[index] = h;
    return h;
  }

  // ---- Core ops -------------------------------------------------------------

  async append(dataHash: Buffer | string): Promise<number> {
    // Ensure BN254 field compatibility
    const dataHashMod = MerkleMountainRange.fieldMod(dataHash);

    // Update width then compute leaf index
    this.width += 1;
    const leafIndex = this.getLeafIndex(this.width);

    // Create leaf, cache it
    const leaf = this.hashLeaf(leafIndex, dataHashMod);
    this.hashes[leafIndex] = leaf;

    // Determine peaks + new size
    const peakIndexes = this.getPeakIndexes(this.width);
    this.size = this.getSize(this.width);

    // Build peaks, tracking newly created hashes for batch write
    const newHashes = new Map<number, Buffer>([[leafIndex, leaf]]);
    const peaks: Buffer[] = [];
    for (let i = 0; i < peakIndexes.length; i++) {
      peaks[i] = await this._getOrCreateNode(peakIndexes[i], newHashes);
    }

    // New root
    this.root = this.peakBagging(this.width, peaks);

    // Persist changes
    const updates = new Map<string, string>();
    updates.set(this.keyRoot(), MerkleMountainRange.toHex(this.root));
    updates.set(this.keySize(), String(this.size));
    updates.set(this.keyWidth(), String(this.width));
    for (const [idx, h] of newHashes.entries()) {
      updates.set(this.keyHash(idx), MerkleMountainRange.toHex(h));
    }
    await this.db.setMany(updates);

    return leafIndex;
  }

  hashLeaf(index: number, dataHash: Buffer | string): Buffer {
    const idx = MerkleMountainRange.bufferify(index);
    const dh = MerkleMountainRange.bufferify(dataHash);
    return this.hasher.hash([idx, dh]);
  }

  hashBranch(index: number, left: Buffer, right: Buffer): Buffer {
    const idx = MerkleMountainRange.bufferify(index);
    return this.hasher.hash([
      idx,
      MerkleMountainRange.bufferify(left),
      MerkleMountainRange.bufferify(right),
    ]);
  }

  async getPeaks(): Promise<Buffer[]> {
    const peakIdx = this.getPeakIndexes(this.width);
    const out: Buffer[] = new Array(peakIdx.length);
    for (let i = 0; i < peakIdx.length; i++) {
      const h = await this.getHashAt(peakIdx[i]);
      if (!h) throw new Error(`peak hash not found for index ${peakIdx[i]}`);
      out[i] = h;
    }
    return out;
  }

  getLeafIndex(width: number): number {
    return width % 2 === 1 ? this.getSize(width) : this.getSize(width - 1) + 1;
  }

  getPeakIndexes(width: number): number[] {
    const n = this.numOfPeaks(width);
    const result = new Array<number>(n);
    let count = 0;
    let size = 0;

    // Highest bit position (inclusive)
    let maxH = 1;
    while (1 << maxH <= width) maxH++;

    for (let h = maxH; h > 0; h--) {
      if ((width & (1 << (h - 1))) !== 0) {
        size += (1 << h) - 1;
        result[count++] = size;
      }
    }
    if (count !== n) throw new Error("invalid bit calculation");
    return result;
  }

  numOfPeaks(width: number): number {
    // Kernighan: count set bits
    let bits = width,
      c = 0;
    while (bits) {
      bits &= bits - 1;
      c++;
    }
    return c;
  }

  peakBagging(width: number, peaks: Buffer[]): Buffer {
    if (width === 0 && peaks.length === 0) return Buffer.alloc(0);

    const size = this.getSize(width);
    if (this.numOfPeaks(width) !== peaks.length) {
      throw new Error("received invalid number of peaks");
    }

    // inner = hash_2(hash_2(... hash_2(size, peak1), peak2) ... )
    let acc = MerkleMountainRange.bufferify(size);
    for (let i = 0; i < peaks.length; i++) {
      acc = this.hasher.hash([acc, MerkleMountainRange.bufferify(peaks[i])]);
    }
    // outer = hash_2(size, inner)
    return this.hasher.hash([MerkleMountainRange.bufferify(size), acc]);
  }

  getSize(width: number): number {
    return (width << 1) - this.numOfPeaks(width);
  }

  getRoot(): Buffer {
    return this.root;
  }

  getHexRoot(): string {
    return MerkleMountainRange.toHex(this.root);
  }

  async getNode(index: number): Promise<Buffer | undefined> {
    return this.getHashAt(index);
  }

  mountainHeight(size: number): number {
    let h = 1;
    while (1 << h <= size + h) h++;
    return h - 1;
  }

  heightAt(index: number): number {
    let reduced = index;
    let peakIndex = 0;
    let h = 0;

    while (reduced > peakIndex) {
      reduced -= (1 << h) - 1;
      h = this.mountainHeight(reduced);
      peakIndex = (1 << h) - 1;
    }
    return h - (peakIndex - reduced);
  }

  isLeaf(index: number): boolean {
    return this.heightAt(index) === 1;
  }

  getChildren(index: number): [number, number] {
    const left = index - (1 << (this.heightAt(index) - 1));
    const right = index - 1;
    if (left === right) throw new Error("not a parent");
    return [left, right];
  }

  async getMerkleProof(index: number) {
    if (index > this.size) throw new Error("out of range");
    if (!this.isLeaf(index)) throw new Error("not a leaf");

    const root = this.root;
    const width = this.width;

    const peakIdx = this.getPeakIndexes(width);
    const peakBagging: Buffer[] = new Array(peakIdx.length);
    let cursor = 0;

    for (let i = 0; i < peakIdx.length; i++) {
      const h = await this.getHashAt(peakIdx[i]);
      if (!h) throw new Error(`peak hash not found for index ${peakIdx[i]}`);
      peakBagging[i] = h;
      if (peakIdx[i] >= index && cursor === 0) cursor = peakIdx[i];
    }
    if (cursor === 0) throw new Error("index not found in any peak");

    const siblings: Buffer[] = [];
    let height = this.heightAt(cursor);
    while (cursor !== index) {
      height--;
      const [left, right] = this.getChildren(cursor);
      const goLeft = index <= left;
      cursor = goLeft ? left : right;
      const sibIdx = goLeft ? right : left;
      const sib = await this.getHashAt(sibIdx);
      if (!sib) throw new Error(`sibling hash not found for index ${sibIdx}`);
      siblings[height - 1] = sib;
    }

    return { root, width, peakBagging, siblings };
  }

  verify(
    root: Buffer,
    width: number,
    index: number,
    valueHash: Buffer | string,
    peaks: Buffer[],
    siblings: Buffer[]
  ): boolean {
    const size = this.getSize(width);
    if (size < index) throw new Error("index is out of range");

    if (!root.equals(this.peakBagging(width, peaks))) {
      throw new Error("invalid root hash from the peaks");
    }

    const peakIdx = this.getPeakIndexes(width);
    let cursor = 0;
    let targetPeak: Buffer | undefined;
    for (let i = 0; i < peakIdx.length; i++) {
      if (peakIdx[i] >= index) {
        targetPeak = peaks[i];
        cursor = peakIdx[i];
        break;
      }
    }
    if (!targetPeak) throw new Error("target not found");

    let h = siblings.length + 1;
    const path = new Array<number>(h);

    while (h > 0) {
      path[--h] = cursor;
      if (cursor === index) break;
      const [l, r] = this.getChildren(cursor);
      cursor = index > l ? r : l;
    }

    let node: Buffer;
    while (h < path.length) {
      cursor = path[h];
      if (h === 0) {
        node = this.hashLeaf(cursor, valueHash);
      } else if (cursor - 1 === path[h - 1]) {
        node = this.hashBranch(cursor, siblings[h - 1], node!);
      } else {
        node = this.hashBranch(cursor, node!, siblings[h - 1]);
      }
      h++;
    }

    if (!node!.equals(targetPeak)) throw new Error("hashed peak is invalid");
    return true;
  }

  // Peak map helpers
  peaksToPeakMap(width: number, peaks: Buffer[]) {
    const map: Record<number, Buffer | 0> = {};
    let count = peaks.length;

    for (let height = 1; height <= 32; height++) {
      const bitIndex = 32 - height; // rightmost bit first
      const hasPeak = (width & (1 << (height - 1))) !== 0;
      map[bitIndex] = hasPeak ? peaks[--count] : 0;
    }
    if (count !== 0) throw new Error("invalid number of peaks");
    return map;
  }

  peakMapToPeaks(width: number, peakMap: Record<number, Buffer | 0>): Buffer[] {
    const out = new Array<Buffer>(this.numOfPeaks(width));
    let c = 0;
    for (let i = 0; i < 32; i++) {
      const v = peakMap[i];
      if (v !== 0) out[c++] = v as Buffer;
    }
    if (c !== out.length) throw new Error("invalid number of peaks");
    return out;
  }

  peakUpdate(
    width: number,
    prev: Record<number, Buffer | 0>,
    itemHash: Buffer | string
  ) {
    const next: Record<number, Buffer | 0> = {};
    const newWidth = width + 1;

    let cursorIndex = this.getLeafIndex(newWidth);
    let cursorNode = this.hashLeaf(cursorIndex, itemHash);
    let obtained = false;

    for (let height = 1; height <= 32; height++) {
      const bitIndex = 32 - height;
      if (obtained) {
        next[bitIndex] = prev[bitIndex];
        continue;
      }

      const mask = 1 << (height - 1);
      const had = (width & mask) !== 0;
      const has = (newWidth & mask) !== 0;

      cursorIndex++;
      if (had)
        cursorNode = this.hashBranch(
          cursorIndex,
          prev[bitIndex] as Buffer,
          cursorNode
        );

      if (has) {
        next[bitIndex] = had ? (prev[bitIndex] as Buffer) : cursorNode;
        obtained = true;
      } else {
        next[bitIndex] = 0;
      }
    }
    return next;
  }

  rollUp(
    root: Buffer,
    width: number,
    peaks: Buffer[],
    itemHashes: Array<Buffer | string>
  ): Buffer {
    if (!root.equals(this.peakBagging(width, peaks))) {
      throw new Error("invalid root hash from the peaks");
    }

    let tmpWidth = width;
    let peakMap = this.peaksToPeakMap(width, peaks);
    for (let i = 0; i < itemHashes.length; i++) {
      const modded = MerkleMountainRange.fieldMod(itemHashes[i]);
      peakMap = this.peakUpdate(tmpWidth, peakMap, modded);
      tmpWidth++;
    }
    return this.peakBagging(tmpWidth, this.peakMapToPeaks(tmpWidth, peakMap));
  }

  // ---- Internals ------------------------------------------------------------

  private async _getOrCreateNode(
    index: number,
    newHashes: Map<number, Buffer>
  ): Promise<Buffer> {
    if (index > this.size) throw new Error("out of range");

    const inBatch = newHashes.get(index);
    if (inBatch) return inBatch;

    const cached = this.hashes[index];
    if (cached) return cached;

    const fromDB = await this.loadHash(index);
    if (fromDB) {
      this.hashes[index] = fromDB;
      return fromDB;
    }

    const [l, r] = this.getChildren(index);
    const leftHash = await this._getOrCreateNode(l, newHashes);
    const rightHash = await this._getOrCreateNode(r, newHashes);
    const h = this.hashBranch(index, leftHash, rightHash);

    this.hashes[index] = h;
    newHashes.set(index, h);
    return h;
  }
}

export default MerkleMountainRange;
