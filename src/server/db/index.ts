// db.development.ts
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import postgres from "postgres";
import { env } from "~/env";
import * as schema from "./schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

// Initialize the connection for local PostgreSQL
export const conn = globalForDb.conn ?? postgres(env.POSTGRES_URL);

if (env.NODE_ENV !== "production") globalForDb.conn = conn;

// Initialize the database connection using local Postgres in development
export const db = drizzle(sql, { schema, logger: true });

export type DB = typeof db;
