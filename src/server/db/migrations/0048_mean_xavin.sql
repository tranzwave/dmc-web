ALTER TABLE "dmc-web_activities" DROP CONSTRAINT "dmc-web_activities_activity_vendor_id_dmc-web_activity_vendors_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_activities" ADD CONSTRAINT "dmc-web_activities_activity_vendor_id_dmc-web_activity_vendors_id_fk" FOREIGN KEY ("activity_vendor_id") REFERENCES "public"."dmc-web_activity_vendors"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
