import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

type AppDb = PostgresJsDatabase<typeof schema>;

declare global {
  var __db: AppDb | undefined; // eslint-disable-line no-var
}

function createDb(): AppDb {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL 환경변수가 필요합니다.');
  const client = postgres(url, { prepare: false });
  return drizzle(client, { schema });
}

export const db: AppDb = globalThis.__db ?? createDb();
if (process.env.NODE_ENV !== 'production') globalThis.__db = db;
