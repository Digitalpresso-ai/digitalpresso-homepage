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

function getDb(): AppDb {
  const cached = globalThis.__db ?? createDb();
  if (process.env.NODE_ENV !== 'production') globalThis.__db = cached;
  return cached;
}

// db 를 lazy 로 초기화한다. 모듈이 로드되는 것만으로 DB 연결을 시도하면,
// 빌드의 "페이지 데이터 수집" 단계처럼 DATABASE_URL 이 없는 컨텍스트에서
// 전체 빌드가 실패한다. 실제 쿼리(프로퍼티 접근) 시점에만 연결을 생성한다.
export const db: AppDb = new Proxy({} as AppDb, {
  get(_target, prop, receiver) {
    return Reflect.get(getDb() as object, prop, receiver);
  },
});
