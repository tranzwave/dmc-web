CREATE TABLE IF NOT EXISTS "dmc-web_marketing_teams" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"country" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dmc-web_notifications" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(255) NOT NULL,
	"target_user" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"pathname" varchar(255),
	"is_read" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "dmc-web_activity_vouchers" ADD COLUMN "billing_instructions" varchar(255);--> statement-breakpoint
ALTER TABLE "dmc-web_activity_vouchers" ADD COLUMN "other_instructions" varchar(255);--> statement-breakpoint
ALTER TABLE "dmc-web_bookings" ADD COLUMN "marketing_team_id" varchar(255);--> statement-breakpoint
ALTER TABLE "dmc-web_booking_lines" ADD COLUMN "reason_to_cancel" varchar(255);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_marketing_teams" ADD CONSTRAINT "dmc-web_marketing_teams_tenant_id_dmc-web_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."dmc-web_tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_notifications" ADD CONSTRAINT "dmc-web_notifications_tenant_id_dmc-web_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."dmc-web_tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_bookings" ADD CONSTRAINT "dmc-web_bookings_marketing_team_id_dmc-web_marketing_teams_id_fk" FOREIGN KEY ("marketing_team_id") REFERENCES "public"."dmc-web_marketing_teams"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
