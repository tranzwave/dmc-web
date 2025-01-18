CREATE TABLE IF NOT EXISTS "dmc-web_booking_agent" (
	"booking_id" varchar(255) NOT NULL,
	"agent_id" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "dmc-web_bookings" DROP CONSTRAINT "dmc-web_bookings_agent_id_dmc-web_agents_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_booking_agent" ADD CONSTRAINT "dmc-web_booking_agent_booking_id_dmc-web_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."dmc-web_bookings"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_booking_agent" ADD CONSTRAINT "dmc-web_booking_agent_agent_id_dmc-web_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."dmc-web_agents"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "dmc-web_bookings" DROP COLUMN IF EXISTS "agent_id";