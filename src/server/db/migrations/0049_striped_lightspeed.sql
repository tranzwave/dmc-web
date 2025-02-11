ALTER TABLE "dmc-web_booking_agent" DROP CONSTRAINT "dmc-web_booking_agent_booking_id_dmc-web_bookings_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_booking_agent" ADD CONSTRAINT "dmc-web_booking_agent_booking_id_dmc-web_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."dmc-web_bookings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
