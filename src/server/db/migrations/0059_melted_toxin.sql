ALTER TABLE "dmc-web_agents" ADD COLUMN "address" varchar(255) DEFAULT '';--> statement-breakpoint
ALTER TABLE "dmc-web_agents" ADD COLUMN "marketing_team_id" varchar(255) NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_agents" ADD CONSTRAINT "dmc-web_agents_marketing_team_id_dmc-web_marketing_teams_id_fk" FOREIGN KEY ("marketing_team_id") REFERENCES "public"."dmc-web_marketing_teams"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
