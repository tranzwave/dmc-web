ALTER TABLE "dmc-web_bookings" ALTER COLUMN "agent_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "dmc-web_clients" ALTER COLUMN "primary_email" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "dmc-web_clients" ALTER COLUMN "primary_email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "dmc-web_clients" ADD COLUMN "primary_contact" varchar(14);