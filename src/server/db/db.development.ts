// db.development.ts
import { drizzle } from 'drizzle-orm/postgres-js';
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
export const conn = globalForDb.conn ?? postgres(env.DATABASE_URL);

if (env.NODE_ENV !== "production") globalForDb.conn = conn;

// Initialize the database connection using local Postgres in development
export const db = drizzle(conn, { schema, logger: true });

export type DB = typeof db;
