/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  StartedPostgreSqlContainer,
  PostgreSqlContainer,
} from '@testcontainers/postgresql';
import * as dotenv from 'dotenv';
import { execa } from 'execa';

// Load .env (optional)
dotenv.config();

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

  (global as any).__PG_CONTAINER__ = container;
};
