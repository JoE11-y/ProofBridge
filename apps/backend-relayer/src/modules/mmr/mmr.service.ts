import Mmr, { Proof } from '@accumulators/merkle-mountain-range';
import { Fr } from '@aztec/bb.js';
import { Poseidon2Hasher } from './hasher/Poseidon2Hasher';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import path from 'path';
import LevelDB from './store/LevelDB';
import { TREE_METADATA_KEYS } from '@accumulators/merkle-mountain-range';

type MmrId = string;

const DB_PATH =
  process.env.ROCKS_PATH ?? path.resolve(process.cwd(), 'leveldb_data');

@Injectable()
export class MMRService implements OnModuleDestroy {
  private store: LevelDB | null = null;
  private storeInitPromise: Promise<void> | null = null;
  private hasher = new Poseidon2Hasher();
  private mmrCache = new Map<MmrId, Mmr>();
  private ready = false;
  private starting?: Promise<void>;

  constructor(private readonly prisma: PrismaService) {}

  async startup(): Promise<void> {
    if (!this.starting) this.starting = this._startup();
    return this.starting;
  }

  isReady() {
    return this.ready;
  }

  private async _startup(): Promise<void> {
    const resolved = LevelDB.resolveLocation(DB_PATH);
    this.store = new LevelDB(resolved);
    await this.store.init();

    const mustRebuild =
      process.env.REBUILD_ON_BOOT === '1' || !(await this.hasBootSentinel());

    if (mustRebuild) {
      await this.rebuildAllMmrs();
      await this.setBootSentinel();
    }

    const shutdown = async () => {
      try {
        await this.onModuleDestroy();
      } finally {
        process.exit(0);
      }
    };

    process.on('SIGTERM', () => {
      void shutdown();
    });
    process.on('SIGINT', () => {
      void shutdown();
    });

    this.ready = true;
  }

  async append(
    mmrId: MmrId,
    valueHex: string,
  ): Promise<{ elementIndex: number; x: string }> {
    await this.ensureMmrExists(mmrId);
    await this.ensureStoreReady();
    await this.ensureOrderNotExists(mmrId, valueHex);
    await this.seedMMRCounters(mmrId);

    const mmr = this.getMmr(mmrId);
    const x = this.hashToField(valueHex);

    const { elementIndex } = await mmr.append(x.toString());

    await this.prisma.orderRecord.create({
      data: {
        orderHash: valueHex,
        elementIndex,
        mmrId,
      },
    });

    return { elementIndex, x: x.toString() };
  }

  async getMerkleProof(mmrId: MmrId, orderHash: string): Promise<Proof> {
    await this.ensureMmrExists(mmrId);
    await this.ensureStoreReady();

    const exists = await this.prisma.orderRecord.findUnique({
      where: {
        mmrId_orderHash: {
          mmrId,
          orderHash,
        },
      },
      select: { elementIndex: true },
    });

    if (!exists) {
      throw new Error(`Order ${orderHash} not recorded in MMR ${mmrId}`);
    }

    const mmr = this.getMmr(mmrId);
    const x = this.hashToField(orderHash);

    const elementIndex = exists.elementIndex;

    const proof = await mmr.getProof(elementIndex);
    const ok = await mmr.verifyProof(proof, x.toString());
    if (!ok) {
      throw new Error(
        `Invalid proof for order ${orderHash} at index ${elementIndex} in MMR ${mmrId}`,
      );
    }
    return proof;
  }

  async getRoot(mmrId: MmrId): Promise<string> {
    await this.ensureMmrExists(mmrId);
    await this.ensureStoreReady();
    const mmr = this.getMmr(mmrId);
    return mmr.rootHash.get();
  }

  async onModuleDestroy(): Promise<void> {
    if (this.store && typeof (this.store as any).close === 'function') {
      try {
        await (this.store as any).close();
      } catch (e) {
        console.log(e);
      }
    }
    this.mmrCache.clear();

    if (this.store) {
      try {
        await this.store.close();
      } catch {
        // ignore
      }
    }

    this.store = null;
    this.storeInitPromise = null;
  }

  private async ensureStoreReady(): Promise<void> {
    if (this.store && this.store.isOpen()) return;

    if (!this.store) {
      const resolved = LevelDB.resolveLocation(DB_PATH);
      this.store = new LevelDB(resolved);
    }

    if (!this.storeInitPromise)
      this.storeInitPromise = this.store.init().catch((err) => {
        this.storeInitPromise = null;
        this.store = null;
        throw err;
      });

    await this.storeInitPromise;
  }

  private getMmr(mmrId: MmrId): Mmr {
    const cached = this.mmrCache.get(mmrId);
    if (cached) return cached;
    if (!this.store) throw new Error('Store not initialized');

    const mmr = new Mmr(this.store, this.hasher, mmrId);
    this.mmrCache.set(mmrId, mmr);
    return mmr;
  }

  private async ensureMmrExists(mmrId: MmrId): Promise<void> {
    const mmrRecord = await this.prisma.mMR.findUnique({
      where: { id: mmrId },
      select: { id: true },
    });
    if (!mmrRecord) {
      throw new Error(`MMR with ID ${mmrId} not found`);
    }
  }

  private async ensureOrderNotExists(mmrId: MmrId, orderHashHex: string) {
    const existing = await this.prisma.orderRecord.findUnique({
      where: {
        mmrId_orderHash: {
          mmrId,
          orderHash: orderHashHex,
        },
      },
      select: { elementIndex: true },
    });
    if (existing) {
      throw new Error(`Order ${orderHashHex} already exists in MMR ${mmrId}`);
    }
  }

  private hashToField(valueHex: string): Fr {
    const hex = valueHex.startsWith('0x') ? valueHex.slice(2) : valueHex;
    const buff = Buffer.from(hex, 'hex');
    return Fr.fromBufferReduce(buff);
  }

  private async seedMMRCounters(mmrId: MmrId): Promise<void> {
    if (!this.store) throw new Error('Store not initialized');
    const store = this.store;

    const keys = [
      `${mmrId}:${TREE_METADATA_KEYS.LEAF_COUNT}`,
      `${mmrId}:${TREE_METADATA_KEYS.ELEMENT_COUNT}`,
    ];

    // Seed the counters if they don't exist
    for (const k of keys) {
      try {
        const v = await store.get(k);
        if (v !== null) {
          continue;
        }
      } catch {
        // ignore
      }
      await store.set(k, '0');
    }
  }

  private async getAllMmrIds(): Promise<MmrId[]> {
    const mmrs = await this.prisma.mMR.findMany({
      select: { id: true },
    });
    return mmrs.map((m) => m.id);
  }

  private async rebuildMmrTree(mmrId: MmrId): Promise<void> {
    await this.ensureStoreReady();

    const mmr = this.getMmr(mmrId);

    try {
      await mmr.clear();
    } catch {
      //ignore
    }

    const pageSize = 5_000;
    let cursor = 0;

    await this.seedMMRCounters(mmrId);

    while (true) {
      const batch = await this.prisma.orderRecord.findMany({
        where: { mmrId },
        orderBy: { elementIndex: 'asc' },
        select: { orderHash: true },
        skip: cursor,
        take: pageSize,
      });
      if (batch.length === 0) break;

      for (const record of batch) {
        const x = this.hashToField(record.orderHash);
        await mmr.append(x.toString());
      }
      cursor += batch.length;
    }
  }

  private async rebuildAllMmrs(): Promise<void> {
    const mmrIds = await this.getAllMmrIds();
    for (const mmrId of mmrIds) {
      await this.rebuildMmrTree(mmrId);
    }
  }

  private async hasBootSentinel(): Promise<boolean> {
    await this.ensureStoreReady();
    try {
      return (await this.store!.get('boot.ok')) !== undefined;
    } catch {
      return false;
    }
  }
  private async setBootSentinel(): Promise<void> {
    await this.store!.set('boot.ok', new Date().toISOString());
  }
}
