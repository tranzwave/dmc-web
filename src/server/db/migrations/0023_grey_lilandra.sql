ALTER TABLE "dmc-web_activity_vouchers" ADD COLUMN "adult_count" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "dmc-web_activity_vouchers" ADD COLUMN "kids_count" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "dmc-web_shop_vouchers" ADD COLUMN "adult_count" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "dmc-web_shop_vouchers" ADD COLUMN "kids_count" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "dmc-web_activity_vouchers" DROP COLUMN IF EXISTS "participants_count";--> statement-breakpoint
ALTER TABLE "dmc-web_shop_vouchers" DROP COLUMN IF EXISTS "participants_count";