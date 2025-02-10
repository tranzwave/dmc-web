import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const stringBoolean = z.coerce.string().transform((val) => {
  return val === "true";
}).default("false");

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    POSTGRES_URL:z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("production"),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string() : z.string().url()
    ),
    DISCORD_CLIENT_ID: z.string(),
    DISCORD_CLIENT_SECRET: z.string(),
    
    CLERK_SECRET_KEY:z.string(),
    DB_SEEDING:stringBoolean,
    DB_MIGRATING:stringBoolean,
    PAYHERE_MERCHANT_ID:z.string(),
    PAYHERE_MERCHANT_SECRET:z.string(),
    PAYHERE_APP_ID:z.string(),
    PAYHERE_APP_SECRET:z.string(),
    PAYHERE_AUTHORIZATION:z.string()
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:z.string(),
    NEXT_PUBLIC_CLERK_SIGN_IN_URL:z.string(),
    NEXT_PUBLIC_CLERK_SIGN_UP_URL:z.string(),
    NEXT_PUBLIC_PAYHERE_NOTIFY_URL:z.string(),
    NEXT_PUBLIC_PAYHERE_RETURN_URL:z.string(),
    NEXT_PUBLIC_PAYHERE_CANCEL_URL:z.string(),
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    DB_SEEDING:process.env.DB_SEEDING,
    DB_MIGRATING:process.env.DB_MIGRATING,
    POSTGRES_URL: process.env.POSTGRES_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY:process.env.CLERK_SECRET_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL:process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_URL:process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    PAYHERE_MERCHANT_ID:process.env.PAYHERE_MERCHANT_ID,
    PAYHERE_MERCHANT_SECRET:process.env.PAYHERE_MERCHANT_SECRET,
    PAYHERE_APP_ID:process.env.PAYHERE_APP_ID,
    PAYHERE_APP_SECRET:process.env.PAYHERE_APP_SECRET,
    PAYHERE_AUTHORIZATION:process.env.PAYHERE_AUTHORIZATION,
    NEXT_PUBLIC_PAYHERE_NOTIFY_URL:process.env.NEXT_PUBLIC_PAYHERE_NOTIFY_URL,
    NEXT_PUBLIC_PAYHERE_RETURN_URL:process.env.NEXT_PUBLIC_PAYHERE_RETURN_URL,
    NEXT_PUBLIC_PAYHERE_CANCEL_URL:process.env.NEXT_PUBLIC_PAYHERE_CANCEL_URL

  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
