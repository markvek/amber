import pg from 'pg'

/**
 * Shared Postgres pool for the Vite dev API. Runs in Node inside the dev
 * server — never in the browser — so credentials from .env.local stay out of
 * the client bundle.
 */

let pool: pg.Pool | null = null

export function getPool(env: Record<string, string>) {
  if (!pool) {
    pool = new pg.Pool({
      host: env.PGHOST,
      port: Number(env.PGPORT ?? '5432'),
      user: env.PGUSER,
      password: env.PGPASSWORD,
      // The amber schema lives in TeacherDB; PGDATABASE in .env.local points
      // at the default `postgres` database, which is empty.
      database: 'TeacherDB',
      // ClickHouse Cloud's Postgres endpoint requires TLS but serves a cert
      // chain Node won't verify against its default roots.
      ssl: { rejectUnauthorized: false },
      max: 4,
      connectionTimeoutMillis: 15_000,
    })
  }
  return pool
}
