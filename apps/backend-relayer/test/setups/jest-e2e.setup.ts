import {
  StartedPostgreSqlContainer,
  PostgreSqlContainer,
} from '@testcontainers/postgresql';
import * as dotenv from 'dotenv';
import { execa } from 'execa';
import path from 'path';
import { setupContracts } from './contract-setup';
import { seedDB } from './seed';

// Load .env (optional)
dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

let container: StartedPostgreSqlContainer;

async function migrate(databaseUrl: string) {
  // prisma migrate deploy
  await execa('npx', ['prisma', 'migrate', 'deploy'], {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: databaseUrl },
  });
}

export default async () => {
  container = await new PostgreSqlContainer('postgres:16-alpine')
    .withDatabase('testdb')
    .withUsername('test')
    .withPassword('test')
    .start();

  const databaseUrl = container.getConnectionUri();
  process.env.DATABASE_URL = databaseUrl;
  process.env.NODE_ENV = 'test';
  process.env.JWT_ACCESS_SECRET = 'test-access-secret';
  process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
  process.env.SIGN_DOMAIN = process.env.SIGN_DOMAIN || 'proofbridge.xyz';
  process.env.SIGN_URI = process.env.SIGN_URI || 'https://proofbridge.xyz';

  await migrate(databaseUrl);

  const { ethContracts, hederaContracts } = await setupContracts();

  await seedDB(ethContracts, hederaContracts);

  (global as any).__ETH_CONTRACTS__ = ethContracts;
  (global as any).__HEDERA_CONTRACTS__ = hederaContracts;
  (global as any).__PG_CONTAINER__ = container;
};
