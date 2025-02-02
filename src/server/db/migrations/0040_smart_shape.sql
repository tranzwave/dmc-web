ALTER TABLE "dmc-web_other_transport_voucher_lines" ADD COLUMN "start_location" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "dmc-web_other_transport_voucher_lines" ADD COLUMN "end_location" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "dmc-web_transport_vouchers" ADD COLUMN "other_transport_id" varchar(255);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_transport_vouchers" ADD CONSTRAINT "dmc-web_transport_vouchers_other_transport_id_dmc-web_other_transports_id_fk" FOREIGN KEY ("other_transport_id") REFERENCES "public"."dmc-web_other_transports"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
