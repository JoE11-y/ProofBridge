/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { RaveLevel } from 'rave-level';
import type { AbstractLevel } from 'abstract-level';
import * as fs from 'fs';
import * as path from 'path';
import { IStore } from '@accumulators/core';

type Key = string | Buffer | Uint8Array;
type Val = string | Buffer | Uint8Array;

interface OpenRetryOpts {
  retries?: number; // default 5
  delayMs?: number; // default 1000
}

export default class LevelDB implements IStore {
  private db: AbstractLevel<Key, Key, Val>;
  private location: string;
  private opening?: Promise<void>;

  constructor(location: string) {
    this.location = path.resolve(location);
    fs.mkdirSync(this.location, { recursive: true });

    this.db = new RaveLevel<Key, Val>(this.location, {
      valueEncoding: 'buffer',
    });
  }

  static resolveLocation(base: string): string {
    const instance = process.env.RENDER_INSTANCE_ID ?? 'local';
    const loc = path.join(base, instance);
    fs.mkdirSync(loc, { recursive: true });
    return loc;
  }

  async init(opts: OpenRetryOpts = {}): Promise<void> {
    if (this.db.status === 'open') return;
    if (!this.opening) this.opening = this.openWithRetry(opts);
    return this.opening;
  }

  private async openWithRetry({
    retries = 5,
    delayMs = 1000,
  }: OpenRetryOpts): Promise<void> {
    for (let i = 0; i < retries; i++) {
      try {
        await this.db.open();
        return;
      } catch (e: any) {
        console.log(e);
        if (
          e?.code === 'LEVEL_LOCKED' ||
          e?.code === 'LEVEL_DATABASE_NOT_OPEN' ||
          /LOCK.*already held/i.test(String(e?.message))
        ) {
          await new Promise((r) => setTimeout(r, delayMs));
          continue;
        }
        throw e;
      }
    }
    throw new Error(`LevelDB lock not released after ${retries} attempts`);
  }

  isOpen(): boolean {
    return this.db.status === 'open';
  }
  isOperational(): boolean {
    return this.db.status === 'open';
  }

  async close(): Promise<void> {
    if (this.db.status === 'open') {
      await this.db.close();
    }
  }

  async get(key: Key): Promise<string | undefined> {
    console.log('LevelDB get key:', key);
    if (!this.isOperational()) throw new Error('Database not operational');
    try {
      const v = await this.db.get(key);
      return Buffer.isBuffer(v)
        ? v.toString()
        : Buffer.from(v as any).toString();
    } catch (err: any) {
      // abstract-level signals missing key with LEVEL_NOT_FOUND
      if (err?.code === 'LEVEL_NOT_FOUND') return undefined;
      throw err;
    }
  }

  async getMany(keys: Key[]): Promise<Map<string, string>> {
    if (!this.isOperational()) throw new Error('Database not operational');
    const out = new Map<string, string>();
    const values = await (this.db as any).getMany(keys);
    for (let i = 0; i < keys.length; i++) {
      const v = values[i];
      if (v !== undefined && v !== null) {
        const buf = Buffer.isBuffer(v) ? v : Buffer.from(v);
        out.set(keys[i].toString(), buf.toString());
      }
    }
    return out;
  }

  async set(key: Key, value: Val): Promise<void> {
    if (!this.isOperational()) throw new Error('Database not operational');
    await this.db.put(key, value as any);
  }

  async setMany(entries: Map<Key, Val>): Promise<void> {
    if (!this.isOperational()) throw new Error('Database not operational');
    const ops = Array.from(entries, ([key, value]) => ({
      type: 'put' as const,
      key,
      value,
    }));
    await (this.db as any).batch(ops);
  }

  async delete(key: Key): Promise<void> {
    if (!this.isOperational()) throw new Error('Database not operational');
    await this.db.del(key);
  }

  async deleteMany(keys: Key[]): Promise<void> {
    if (!this.isOperational()) throw new Error('Database not operational');
    const ops = keys.map((key) => ({ type: 'del' as const, key }));
    await (this.db as any).batch(ops);
  }
}
