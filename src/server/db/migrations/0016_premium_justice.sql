ALTER TABLE "dmc-web_tenants" ADD COLUMN "clerk_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "dmc-web_tenants" ADD CONSTRAINT "dmc-web_tenants_clerk_id_unique" UNIQUE("clerk_id");