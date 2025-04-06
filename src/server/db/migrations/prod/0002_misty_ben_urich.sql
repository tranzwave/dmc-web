CREATE TABLE IF NOT EXISTS "dmc-web_room_categories" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
ALTER TABLE "dmc-web_marketing_teams" ALTER COLUMN "country" SET DEFAULT 'N/A';--> statement-breakpoint
ALTER TABLE "dmc-web_marketing_teams" ALTER COLUMN "country" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "dmc-web_agents" ADD COLUMN "address" varchar(255) DEFAULT '';--> statement-breakpoint
ALTER TABLE "dmc-web_agents" ADD COLUMN "marketing_team_id" varchar(255) NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_room_categories" ADD CONSTRAINT "dmc-web_room_categories_tenant_id_dmc-web_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."dmc-web_tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_agents" ADD CONSTRAINT "dmc-web_agents_marketing_team_id_dmc-web_marketing_teams_id_fk" FOREIGN KEY ("marketing_team_id") REFERENCES "public"."dmc-web_marketing_teams"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
