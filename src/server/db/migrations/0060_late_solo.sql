CREATE TABLE IF NOT EXISTS "dmc-web_room_categories" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_room_categories" ADD CONSTRAINT "dmc-web_room_categories_tenant_id_dmc-web_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."dmc-web_tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
