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
  // 서버리스(Vercel Fluid Compute)에서는 함수 인스턴스가 여러 개 뜨므로,
  // 인스턴스마다 풀을 크게 잡으면 DB 의 최대 연결 수(예: 200)를 금방 초과한다.
  // max:1 로 인스턴스당 연결을 최소화하고, 유휴 연결은 곧 반납한다.
  // (DATABASE_URL 은 Supabase 트랜잭션 풀러(6543 포트)를 가리켜야 한다.)
  const client = postgres(url, { prepare: false, max: 1, idle_timeout: 20 });
  return drizzle(client, { schema });
}

function getDb(): AppDb {
  // 프로덕션에서도 인스턴스 내에서 풀을 재사용해야 매 요청마다 새 연결을
  // 만들지 않는다. globalThis 캐싱을 환경 무관하게 적용한다.
  const cached = globalThis.__db ?? createDb();
  globalThis.__db = cached;
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
