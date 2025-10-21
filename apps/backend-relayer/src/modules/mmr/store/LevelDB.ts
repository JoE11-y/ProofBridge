/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Level } from 'level';
import type { AbstractLevel } from 'abstract-level';
import * as fs from 'fs';
import * as path from 'path';
import { IStore } from '@accumulators/core';

type Key = string | Buffer | Uint8Array;
type Val = string | Buffer | Uint8Array;

export default class LevelDB implements IStore {
  private db: AbstractLevel<Key, Key, Val>;
  private location: string;

  constructor(location: string) {
    this.location = path.resolve(location);
    fs.mkdirSync(this.location, { recursive: true });

    this.db = new Level<Key, Val>(this.location, {
      valueEncoding: 'buffer',
    });
  }

  async init(): Promise<void> {
    if (this.db.status !== 'open') {
      await this.db.open();
    }
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
