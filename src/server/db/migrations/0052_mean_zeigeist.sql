ALTER TABLE "dmc-web_bookings" ADD COLUMN "marketing_team_id" varchar(255);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_bookings" ADD CONSTRAINT "dmc-web_bookings_marketing_team_id_dmc-web_marketing_teams_id_fk" FOREIGN KEY ("marketing_team_id") REFERENCES "public"."dmc-web_marketing_teams"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
