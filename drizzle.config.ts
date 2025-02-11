import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: "./src/server/db/schema.ts",
  out:"./src/server/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.POSTGRES_URL!,
  },
  verbose:true,
  tablesFilter: ["dmc-web_*"],
  migrations: {
    table: "__drizzle_migrations__",
    schema: "public",
  },
} satisfies Config;
