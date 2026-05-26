import { defineConfig } from 'drizzle-kit';
import { readFileSync } from 'fs';
import { join } from 'path';

function loadEnvLocal(): void {
  try {
    const envPath = join(process.cwd(), '.env.local');
    const content = readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    // .env.local이 없으면 무시
  }
}

loadEnvLocal();

// drizzle-kit은 direct connection(5432)이 필요 — DIRECT_URL 사용
// 앱 런타임은 DATABASE_URL(6543 pooler) 사용
export default defineConfig({
  schema: './backend/shared/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: (process.env.DIRECT_URL ?? process.env.DATABASE_URL)!,
  },
});
