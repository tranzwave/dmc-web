CREATE TABLE IF NOT EXISTS "dmc-web_other_transports" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"primary_email" varchar(255) NOT NULL,
	"primary_contact_number" varchar(20) NOT NULL,
	"street_name" varchar(255) NOT NULL,
	"city_id" integer NOT NULL,
	"province" varchar(255) NOT NULL,
	"transport_method" varchar(255) NOT NULL,
	"vehicle_type" varchar(255) NOT NULL,
	"start_location" varchar(255) NOT NULL,
	"destination" varchar(255) NOT NULL,
	"capacity" integer NOT NULL,
	"price" numeric(4) NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dmc-web_other_transport_voucher_lines" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"transport_voucher_id" varchar(255) NOT NULL,
	"date" varchar(100) NOT NULL,
	"time" varchar(10) NOT NULL,
	"adults_count" integer NOT NULL,
	"kids_count" integer NOT NULL,
	"remarks" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_other_transports" ADD CONSTRAINT "dmc-web_other_transports_tenant_id_dmc-web_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."dmc-web_tenants"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_other_transports" ADD CONSTRAINT "dmc-web_other_transports_city_id_dmc-web_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."dmc-web_cities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_other_transport_voucher_lines" ADD CONSTRAINT "dmc-web_other_transport_voucher_lines_transport_voucher_id_dmc-web_transport_vouchers_id_fk" FOREIGN KEY ("transport_voucher_id") REFERENCES "public"."dmc-web_transport_vouchers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
