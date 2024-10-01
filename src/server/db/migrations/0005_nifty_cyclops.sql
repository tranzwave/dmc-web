ALTER TABLE "dmc-web_drivers" ADD COLUMN "type" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "dmc-web_drivers" DROP COLUMN IF EXISTS "has_restaurant";