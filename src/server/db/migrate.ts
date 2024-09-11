// import { db,conn } from '.';
// import { migrate } from 'drizzle-orm/postgres-js/migrator';
// import { env } from '~/env';
// // import env from '@/env';

// if (!env.DB_MIGRATING) {
//   throw new Error('You must set DB_MIGRATING to "true" when running migrations');
// }

// await migrate(db, { migrationsFolder: "./src/server/db/migrations" });

// await conn.end();