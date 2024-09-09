// db.production.ts
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from "./schema";

// Initialize the database connection for production using Vercel PostgreSQL
export const db = drizzle(sql, { schema, logger: true });

export type DB = typeof db;
