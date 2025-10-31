import { Fr } from '@aztec/bb.js';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import * as fs from 'fs';
import path from 'path';
import {
  MerkleMountainRange as Mmr,
  Poseidon2Hasher,
  LevelDB,
  MerkleProof,
} from 'proofbridge-mmr';

type MmrId = string;

const DB_PATH =
  process.env.ROCKS_PATH ?? path.resolve(process.cwd(), 'leveldb_data');

@Injectable()
export class MMRService implements OnModuleInit, OnModuleDestroy {
  private db: LevelDB | null = null;
  private dbInitPromise: Promise<void> | null = null;

  private readonly hasher = new Poseidon2Hasher();

  // cache of live, in-memory MMRs keyed by mmrId
  private mmrCache = new Map<MmrId, Mmr>();

  // guards against double-start
  private startupPromise: Promise<void> | null = null;

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit(): Promise<void> {
    if (!this.startupPromise) {
      this.startupPromise = this.startup();
    }
    await this.startupPromise;
  }

  async onModuleDestroy(): Promise<void> {
    // best effort cleanup
    this.mmrCache.clear();

    if (this.db) {
      try {
        await this.db.close();
      } catch (e) {
        console.log('[MMRService] DB close error:', e);
      }
    }

    this.db = null;
    this.dbInitPromise = null;
  }

  private async startup(): Promise<void> {
    console.log('[MMRService] Booting MMR service...');

    // 1. Open DB
    await this.ensureDbReady();

    // 2. Decide whether we need to rebuild MMRs into memory
    const mustRebuild =
      process.env.REBUILD_ON_BOOT === '1' || !(await this.hasBootSentinel());

    if (mustRebuild) {
      console.log('[MMRService] Rebuilding all MMRs from Prisma...');
      await this.rebuildAllMmrs();
      await this.setBootSentinel();
      console.log('[MMRService] Rebuild complete.');
    } else {
      console.log('[MMRService] Using existing on-disk state.');
    }

    // 3. Graceful shutdown hooks
    const shutdown = async () => {
      try {
        await this.onModuleDestroy();
      } finally {
        process.exit(0);
      }
    };

    process.on('SIGTERM', () => void shutdown());
    process.on('SIGINT', () => void shutdown());

    console.log('[MMRService] MMR service ready.');
  }

  async append(
    mmrId: MmrId,
    valueHex: string,
  ): Promise<{ elementIndex: number; x: string }> {
    await this.ensureDbReady();
    await this.ensureMmrExistsInDb(mmrId);
    await this.ensureOrderNotExists(mmrId, valueHex);

    // hydrate or load from cache
    const mmr = await this.getOrLoadMmr(mmrId);

    const x = this.hashToField(valueHex);
    const elementIndex = await mmr.append(x.toString());

    // persist linkage of elementIndex <-> hash for later proofs
    await this.prisma.orderRecord.create({
      data: {
        orderHash: valueHex,
        elementIndex,
        mmrId,
      },
    });

    return { elementIndex, x: x.toString() };
  }

  async getMerkleProof(mmrId: MmrId, orderHash: string): Promise<MerkleProof> {
    await this.ensureDbReady();
    await this.ensureMmrExistsInDb(mmrId);

    // find the index of this order in the MMR
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

    // hydrate or get cached mmr
    const mmr = await this.getOrLoadMmr(mmrId);

    const width = mmr.width;
    console.log('[MMRService] MMR state before proof:', {
      mmrId,
      width,
      root: mmr.getHexRoot(),
      size: mmr.getSize(width),
    });

    const xField = this.hashToField(orderHash);
    const elementIndex = exists.elementIndex;

    console.log(
      `[MMRService] Generating proof for index ${elementIndex} (mmrId=${mmrId})`,
    );

    const proof = await mmr.getMerkleProof(elementIndex);

    // sanity check proof
    const ok = mmr.verify(
      proof.root,
      proof.width,
      elementIndex,
      xField.toString(),
      proof.peaks,
      proof.siblings,
    );

    if (!ok) {
      throw new Error(
        `Invalid proof for order ${orderHash} at index ${elementIndex} in MMR ${mmrId}`,
      );
    }

    return proof;
  }

  /**
   * Get the current root for an MMR.
   */
  async getRoot(mmrId: MmrId): Promise<string> {
    await this.ensureDbReady();
    await this.ensureMmrExistsInDb(mmrId);

    const mmr = await this.getOrLoadMmr(mmrId);
    return mmr.getHexRoot();
  }

  private async ensureDbReady(): Promise<void> {
    // already open?
    if (this.db && this.db.isOpen()) return;

    // not constructed yet?
    if (!this.db) {
      const resolved = MMRService.resolveLocation(DB_PATH);
      console.log('[MMRService] DB path:', resolved);
      this.db = new LevelDB(resolved);
    }

    // opening in progress or done?
    if (!this.dbInitPromise) {
      this.dbInitPromise = this.db.init().catch((err) => {
        // cleanup on failure so next call can retry
        this.dbInitPromise = null;
        this.db = null;
        throw err;
      });
    }

    await this.dbInitPromise;
  }

  private async getOrLoadMmr(mmrId: MmrId): Promise<Mmr> {
    const cached = this.mmrCache.get(mmrId);
    if (cached) {
      return cached;
    }

    if (!this.db) {
      throw new Error('DB not initialized');
    }

    // Create a new in-memory MMR instance
    const mmr = new Mmr(mmrId, this.db, this.hasher);

    // Cache immediately so rebuild uses the same instance
    this.mmrCache.set(mmrId, mmr);

    // Hydrate it by replaying all known leaves from Prisma
    await this.rebuildSingleMmr(mmrId, mmr);

    return mmr;
  }

  private async ensureMmrExistsInDb(mmrId: MmrId): Promise<void> {
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

  private async rebuildAllMmrs(): Promise<void> {
    const mmrIds = await this.getAllMmrIds();

    for (const mmrId of mmrIds) {
      // ensure DB is open
      await this.ensureDbReady();

      // create or reuse the cache entry
      let mmr = this.mmrCache.get(mmrId);
      if (!mmr) {
        mmr = new Mmr(mmrId, this.db!, this.hasher);
        this.mmrCache.set(mmrId, mmr);
      }

      await this.rebuildSingleMmr(mmrId, mmr);
    }
  }

  private async rebuildSingleMmr(mmrId: MmrId, mmr: Mmr): Promise<void> {
    // clear any existing in-memory state for this mmrId
    try {
      await mmr.clear();
    } catch {
      // ignore if clear() throws on empty
    }

    const pageSize = 5_000;
    let cursor = 0;

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

    console.log('[MMRService] Rebuilt MMR', {
      mmrId,
      width: mmr.width,
      root: mmr.getHexRoot(),
    });
  }

  private async getAllMmrIds(): Promise<MmrId[]> {
    const mmrs = await this.prisma.mMR.findMany({
      select: { id: true },
    });
    return mmrs.map((m) => m.id);
  }

  private async hasBootSentinel(): Promise<boolean> {
    await this.ensureDbReady();

    try {
      return (await this.db!.get('boot.ok')) !== undefined;
    } catch {
      return false;
    }
  }

  private async setBootSentinel(): Promise<void> {
    await this.db!.set('boot.ok', new Date().toISOString());
  }

  static resolveLocation(base: string): string {
    const instance = process.env.RENDER_INSTANCE_ID ?? 'local';
    const loc = path.join(base, instance);
    fs.mkdirSync(loc, { recursive: true });
    return loc;
  }
}
