CREATE TABLE IF NOT EXISTS "dmc-web_subscriptions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"payhere_subscription_id" varchar(255),
	"org_id" varchar(255),
	"tenant_id" varchar(255) NOT NULL,
	"plan" varchar(255) NOT NULL,
	"start_date" timestamp with time zone NOT NULL,
	"is_trial" boolean DEFAULT true NOT NULL,
	"trial_end_date" timestamp with time zone,
	"user_id" varchar(255),
	"next_billing_date" timestamp with time zone,
	"end_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_subscriptions" ADD CONSTRAINT "dmc-web_subscriptions_tenant_id_dmc-web_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."dmc-web_tenants"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
