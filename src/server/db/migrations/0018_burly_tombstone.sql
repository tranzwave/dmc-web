CREATE TABLE IF NOT EXISTS "dmc-web_driver_voucher_lines" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"transport_voucher_id" varchar(255) NOT NULL,
	"vehicle_type" varchar(255),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dmc-web_guide_voucher_lines" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"transport_voucher_id" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "dpnmc-web_transport_vouchers" ADD COLUMN "guide_id" varchar(255) NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_driver_voucher_lines" ADD CONSTRAINT "dmc-web_driver_voucher_lines_transport_voucher_id_dmc-web_transport_vouchers_id_fk" FOREIGN KEY ("transport_voucher_id") REFERENCES "public"."dmc-web_transport_vouchers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_guide_voucher_lines" ADD CONSTRAINT "dmc-web_guide_voucher_lines_transport_voucher_id_dmc-web_transport_vouchers_id_fk" FOREIGN KEY ("transport_voucher_id") REFERENCES "public"."dmc-web_transport_vouchers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_transport_vouchers" ADD CONSTRAINT "dmc-web_transport_vouchers_guide_id_dmc-web_guides_id_fk" FOREIGN KEY ("guide_id") REFERENCES "public"."dmc-web_guides"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "dmc-web_transport_vouchers" DROP COLUMN IF EXISTS "vehicle_type";