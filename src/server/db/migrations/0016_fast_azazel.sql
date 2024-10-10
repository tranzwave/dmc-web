CREATE TABLE IF NOT EXISTS "dmc-web_guides" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"primary_email" varchar(255) NOT NULL,
	"primary_contact_number" varchar(20) NOT NULL,
	"street_name" varchar(255) NOT NULL,
	"province" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"city_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dmc-web_guide_languages" (
	"guide_id" varchar(255) NOT NULL,
	"language_code" varchar(255) NOT NULL,
	CONSTRAINT "dmc-web_guide_languages_guide_id_language_code_pk" PRIMARY KEY("guide_id","language_code")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_guides" ADD CONSTRAINT "dmc-web_guides_tenant_id_dmc-web_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."dmc-web_tenants"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_guides" ADD CONSTRAINT "dmc-web_guides_city_id_dmc-web_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."dmc-web_cities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_guide_languages" ADD CONSTRAINT "dmc-web_guide_languages_guide_id_dmc-web_guides_id_fk" FOREIGN KEY ("guide_id") REFERENCES "public"."dmc-web_guides"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_guide_languages" ADD CONSTRAINT "dmc-web_guide_languages_language_code_dmc-web_languages_code_fk" FOREIGN KEY ("language_code") REFERENCES "public"."dmc-web_languages"("code") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
