ALTER TYPE "status" ADD VALUE 'amended';--> statement-breakpoint
ALTER TABLE "dmc-web_drivers" ADD COLUMN "fee_per_day" integer DEFAULT 0 NOT NULL;