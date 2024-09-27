ALTER TABLE "dmc-web_activity_vendors" ADD COLUMN "primary_email" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "dmc-web_agents" ADD COLUMN "primary_contact_number" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "dmc-web_agents" ADD COLUMN "agency" varchar(255) NOT NULL;