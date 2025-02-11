DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('inprogress', 'sentToVendor', 'vendorConfirmed', 'sentToClient', 'confirmed', 'cancelled', 'amended');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dmc-web_account" (
	"user_id" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "dmc-web_account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dmc-web_activities" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(255) NOT NULL,
	"activity_vendor_id" varchar(255) NOT NULL,
	"activity_type_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"capacity" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dmc-web_activity_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dmc-web_activity_vendors" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"street_name" varchar(255) NOT NULL,
	"province" varchar(255) NOT NULL,
	"contact_number" varchar(50) NOT NULL,
	"primary_email" varchar(255) DEFAULT 'N/A',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"city_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dmc-web_activity_vouchers" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"booking_line_id" varchar(255) NOT NULL,
	"activity_name" varchar(255) NOT NULL,
	"city_name" varchar(50) NOT NULL,
	"activity_vendor_id" varchar(255) NOT NULL,
	"activity_id" varchar(255) NOT NULL,
	"coordinator_id" varchar(255) NOT NULL,
	"date" varchar(100) NOT NULL,
	"time" varchar(10) NOT NULL,
	"hours" integer NOT NULL,
	"adults_count" integer NOT NULL,
	"kids_count" integer,
	"remarks" text,
	"rate" numeric(4),
	"reason_to_delete" varchar(255),
	"status" "status" DEFAULT 'inprogress',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dmc-web_agents" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"country_code" varchar(3) NOT NULL,
	"email" varchar(255) NOT NULL,
	"primary_contact_number" varchar(20) NOT NULL,
	"agency" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dmc-web_bookings" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(255) NOT NULL,
	"client_id" varchar(255) NOT NULL,
	"coordinator_id" varchar(255) NOT NULL,
	"manager_id" varchar(255) NOT NULL,
	"tour_type" varchar(255) NOT NULL,
	"direct_customer" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dmc-web_booking_agent" (
	"booking_id" varchar(255) NOT NULL,
	"agent_id" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dmc-web_booking_lines" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"booking_id" varchar NOT NULL,
	"includes" jsonb,
	"adults_count" integer NOT NULL,
	"kids_count" integer NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"status" "status" DEFAULT 'inprogress',
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"tour_packet" jsonb DEFAULT '{"documents": [], "accessories": []}'::jsonb,
	"tour_expenses" jsonb DEFAULT '[]'::jsonb,
	"flight_details" jsonb DEFAULT '{"arrivalFlight": "", "arrivalDate": "", "arrivalTime": "", "departureFlight": "", "departureDate": "", "departureTime": ""}'::jsonb,
	"tour_invoice" jsonb DEFAULT '{"entries": [], "invoiceDetails": {}}'::jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dmc-web_cities" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"country_code" varchar(3) NOT NULL,
	CONSTRAINT "city_ak_1" UNIQUE("name","country_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dmc-web_clients" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(255) NOT NULL,
	"country_code" varchar(3) NOT NULL,
	"name" varchar(255) NOT NULL,
	"primary_email" varchar(100),
	"primary_contact" varchar(14),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dmc-web_countries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"code" varchar(3) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "dmc-web_countries_name_unique" UNIQUE("name"),
	CONSTRAINT "dmc-web_countries_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dmc-web_drivers" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"primary_email" varchar(255) NOT NULL,
	"primary_contact_number" varchar(20) NOT NULL,
	"street_name" varchar(255) NOT NULL,
	"province" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"fee_per_km" integer DEFAULT 0 NOT NULL,
	"fee_per_day" integer DEFAULT 0 NOT NULL,
	"fuel_allowance" integer DEFAULT 0 NOT NULL,
	"accommodation_allowance" integer DEFAULT 0 NOT NULL,
	"meal_allowance" integer DEFAULT 0 NOT NULL,
	"drivers_license" varchar(255) NOT NULL,
	"guide_license" varchar(255),
	"insurance" varchar(255) NOT NULL,
	"contact_number" varchar(50) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"city_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dmc-web_driver_languages" (
	"driver_id" varchar(255) NOT NULL,
	"language_code" varchar(255) NOT NULL,
	CONSTRAINT "dmc-web_driver_languages_driver_id_language_code_pk" PRIMARY KEY("driver_id","language_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dmc-web_driver_vehicles" (
	"driver_id" varchar(255) NOT NULL,
	"vehicle_id" varchar(255) NOT NULL,
	CONSTRAINT "dmc-web_driver_vehicles_driver_id_vehicle_id_pk" PRIMARY KEY("driver_id","vehicle_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dmc-web_driver_voucher_lines" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"transport_voucher_id" varchar(255) NOT NULL,
	"vehicle_type" varchar(255) DEFAULT '-' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dmc-web_guides" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"primary_email" varchar(255) NOT NULL,
	"primary_contact_number" varchar(20) NOT NULL,
	"street_name" varchar(255) NOT NULL,
	"province" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"guide_license" varchar(255),
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
CREATE TABLE IF NOT EXISTS "dmc-web_guide_voucher_lines" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"transport_voucher_id" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dmc-web_hotels" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(255) NOT NULL,
	"hotel_name" varchar(255) NOT NULL,
	"stars" integer NOT NULL,
	"primary_email" varchar(255) NOT NULL,
	"primary_contact_number" varchar(20) NOT NULL,
	"street_name" varchar(255) NOT NULL,
	"province" varchar(255) NOT NULL,
	"has_restaurant" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"city_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dmc-web_hotel_rooms" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"hotel_id" varchar NOT NULL,
	"room_type" varchar(255) NOT NULL,
	"type_name" varchar(255) NOT NULL,
	"count" integer NOT NULL,
	"amenities" text NOT NULL,
	"floor" integer NOT NULL,
	"bed_count" integer NOT NULL,
	"additional_comments" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dmc-web_hotel_staffs" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"hotel_id" varchar NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"contact_number" varchar(20) NOT NULL,
	"occupation" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dmc-web_hotel_vouchers" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"booking_line_id" varchar(255) NOT NULL,
	"hotel_id" varchar(255) NOT NULL,
	"coordinator_id" varchar(255) NOT NULL,
	"status" "status" DEFAULT 'inprogress',
	"billing_instructions" varchar(255) DEFAULT '',
	"special_note" varchar(255) DEFAULT '',
	"availability_confirmed_by" varchar(255) DEFAULT '',
	"availability_confirmed_to" varchar(255) DEFAULT '',
	"rates_confirmed_by" varchar(255) DEFAULT '',
	"rates_confirmed_to" varchar(255) DEFAULT '',
	"reason_to_amend" varchar(255) DEFAULT '',
	"reason_to_cancel" varchar(255) DEFAULT '',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"amend_count" integer DEFAULT 0,
	"responsible_person" varchar(255),
	"confirmation_number" varchar(255),
	"reminder_date" varchar(100)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dmc-web_hotel_voucher_lines" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"hotel_voucher_id" varchar(255) NOT NULL,
	"rate" numeric(4),
	"room_type" varchar(100) NOT NULL,
	"room_category" varchar(100) DEFAULT '' NOT NULL,
	"basis" varchar(50) NOT NULL,
	"check_in_date" varchar(100) NOT NULL,
	"check_in_time" time NOT NULL,
	"check_out_date" varchar(100) NOT NULL,
	"check_out_time" time NOT NULL,
	"adults_count" integer NOT NULL,
	"kids_count" integer NOT NULL,
	"room_count" integer NOT NULL,
	"remarks" text DEFAULT 'No Remarks' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dmc-web_languages" (
	"id" serial NOT NULL,
	"code" varchar(3) PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	CONSTRAINT "dmc-web_languages_code_unique" UNIQUE("code")
);
--> statement-breakpoint
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
	"other_transport_id" varchar(255) NOT NULL,
	"date" varchar(100) NOT NULL,
	"time" varchar(10) NOT NULL,
	"start_location" varchar(255) NOT NULL,
	"end_location" varchar(255) NOT NULL,
	"adults_count" integer NOT NULL,
	"kids_count" integer NOT NULL,
	"remarks" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dmc-web_restaurants" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"street_name" varchar(255) NOT NULL,
	"province" varchar(255) NOT NULL,
	"contact_number" varchar(50) NOT NULL,
	"primaryEmail" varchar(50) DEFAULT 'N/A' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"city_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dmc-web_restaurant_meals" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"restaurant_id" varchar(255),
	"meal_type" varchar(50) NOT NULL,
	"startTime" varchar(10) NOT NULL,
	"endTime" varchar(10) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dmc-web_restaurant_vouchers" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"booking_line_id" varchar(255) NOT NULL,
	"restaurant_id" varchar(255),
	"coordinator_id" varchar(255) NOT NULL,
	"status" "status" DEFAULT 'inprogress',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"availability_confirmed_by" varchar(255) DEFAULT '',
	"availability_confirmed_to" varchar(255) DEFAULT '',
	"rates_confirmed_by" varchar(255) DEFAULT '',
	"rates_confirmed_to" varchar(255) DEFAULT '',
	"reason_to_amend" varchar(255) DEFAULT '',
	"reason_to_cancel" varchar(255) DEFAULT '',
	"billing_instructions" varchar(255) DEFAULT '',
	"special_note" varchar(255) DEFAULT '',
	"amend_count" integer DEFAULT 0,
	"responsible_person" varchar(255),
	"confirmation_number" varchar(255),
	"reminder_date" varchar(100)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dmc-web_restaurant_voucher_lines" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"restaurant_voucher_id" varchar(255) NOT NULL,
	"rate" numeric(4),
	"meal_type" varchar(50) NOT NULL,
	"date" varchar(100) NOT NULL,
	"time" varchar(10) NOT NULL,
	"adults_count" integer NOT NULL,
	"kids_count" integer NOT NULL,
	"remarks" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"availability_confirmed_by" varchar(255) DEFAULT '',
	"availability_confirmed_to" varchar(255) DEFAULT '',
	"rates_confirmed_by" varchar(255) DEFAULT '',
	"rates_confirmed_to" varchar(255) DEFAULT '',
	"reason_to_amend" varchar(255) DEFAULT '',
	"reason_to_cancel" varchar(255) DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dmc-web_session" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dmc-web_shops" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"street_name" varchar(255) NOT NULL,
	"province" varchar(255) NOT NULL,
	"contact_number" varchar(50) NOT NULL,
	"primary_email" varchar(50) DEFAULT 'N/A' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"city_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dmc-web_shop_shop_type" (
	"shop_id" varchar(255) NOT NULL,
	"shop_type_id" integer NOT NULL,
	CONSTRAINT "dmc-web_shop_shop_type_shop_id_shop_type_id_pk" PRIMARY KEY("shop_id","shop_type_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dmc-web_shop_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dmc-web_shop_vouchers" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"booking_line_id" varchar(255) NOT NULL,
	"shop_id" varchar(255) NOT NULL,
	"coordinator_id" varchar(255) NOT NULL,
	"shop_type" varchar(100) NOT NULL,
	"date" varchar(100) NOT NULL,
	"time" varchar(10) NOT NULL,
	"hours" integer NOT NULL,
	"adults_count" integer NOT NULL,
	"kids_count" integer,
	"city_name" varchar(50) NOT NULL,
	"remarks" text,
	"rate" numeric(4),
	"status" "status" DEFAULT 'inprogress',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
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
	"status" varchar(255) DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dmc-web_tenants" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"clerk_id" varchar(255) NOT NULL,
	"country_code" varchar(3) NOT NULL,
	"name" varchar(255) NOT NULL,
	"domain" varchar(255) NOT NULL,
	"subscription" varchar(255) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"voucher_settings" jsonb DEFAULT '{"hotelVoucherCurrency": "USD", "restaurantVoucherCurrency": "USD", "activityVoucherCurrency": "USD", "shopVoucherCurrency": "USD", "transportVoucherCurrency": "USD"}'::jsonb,
	CONSTRAINT "dmc-web_tenants_clerk_id_unique" UNIQUE("clerk_id"),
	CONSTRAINT "dmc-web_tenants_domain_unique" UNIQUE("domain")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dmc-web_transport_vouchers" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"booking_line_id" varchar(255) NOT NULL,
	"driver_id" varchar(255),
	"guide_id" varchar(255),
	"other_transport_id" varchar(255),
	"coordinator_id" varchar(255),
	"status" "status" DEFAULT 'inprogress',
	"rate" numeric(4),
	"start_date" varchar(100) NOT NULL,
	"end_date" varchar(100) NOT NULL,
	"languages" varchar(255) NOT NULL,
	"reason_to_delete" varchar(255),
	"remarks" varchar(255),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dmc-web_users" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(255) NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255),
	"role" varchar(50) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dmc-web_vehicles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(255) NOT NULL,
	"vehicle_type" varchar(100) NOT NULL,
	"number_plate" varchar(20) NOT NULL,
	"seats" integer NOT NULL,
	"make" varchar(100) NOT NULL,
	"model" varchar(100) NOT NULL,
	"year" integer NOT NULL,
	"revenue_license" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "dmc-web_vehicles_number_plate_unique" UNIQUE("number_plate")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dmc-web_verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "dmc-web_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_account" ADD CONSTRAINT "dmc-web_account_user_id_dmc-web_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."dmc-web_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_activities" ADD CONSTRAINT "dmc-web_activities_tenant_id_dmc-web_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."dmc-web_tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_activities" ADD CONSTRAINT "dmc-web_activities_activity_vendor_id_dmc-web_activity_vendors_id_fk" FOREIGN KEY ("activity_vendor_id") REFERENCES "public"."dmc-web_activity_vendors"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_activities" ADD CONSTRAINT "dmc-web_activities_activity_type_id_dmc-web_activity_types_id_fk" FOREIGN KEY ("activity_type_id") REFERENCES "public"."dmc-web_activity_types"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_activity_vendors" ADD CONSTRAINT "dmc-web_activity_vendors_tenant_id_dmc-web_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."dmc-web_tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_activity_vendors" ADD CONSTRAINT "dmc-web_activity_vendors_city_id_dmc-web_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."dmc-web_cities"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_activity_vouchers" ADD CONSTRAINT "dmc-web_activity_vouchers_booking_line_id_dmc-web_booking_lines_id_fk" FOREIGN KEY ("booking_line_id") REFERENCES "public"."dmc-web_booking_lines"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_activity_vouchers" ADD CONSTRAINT "dmc-web_activity_vouchers_activity_vendor_id_dmc-web_activity_vendors_id_fk" FOREIGN KEY ("activity_vendor_id") REFERENCES "public"."dmc-web_activity_vendors"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_activity_vouchers" ADD CONSTRAINT "dmc-web_activity_vouchers_activity_id_dmc-web_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."dmc-web_activities"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_agents" ADD CONSTRAINT "dmc-web_agents_tenant_id_dmc-web_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."dmc-web_tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_agents" ADD CONSTRAINT "dmc-web_agents_country_code_dmc-web_countries_code_fk" FOREIGN KEY ("country_code") REFERENCES "public"."dmc-web_countries"("code") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_bookings" ADD CONSTRAINT "dmc-web_bookings_tenant_id_dmc-web_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."dmc-web_tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_bookings" ADD CONSTRAINT "dmc-web_bookings_client_id_dmc-web_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."dmc-web_clients"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_booking_agent" ADD CONSTRAINT "dmc-web_booking_agent_booking_id_dmc-web_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."dmc-web_bookings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_booking_agent" ADD CONSTRAINT "dmc-web_booking_agent_agent_id_dmc-web_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."dmc-web_agents"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_booking_lines" ADD CONSTRAINT "dmc-web_booking_lines_booking_id_dmc-web_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."dmc-web_bookings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_cities" ADD CONSTRAINT "dmc-web_cities_country_code_dmc-web_countries_code_fk" FOREIGN KEY ("country_code") REFERENCES "public"."dmc-web_countries"("code") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_clients" ADD CONSTRAINT "dmc-web_clients_tenant_id_dmc-web_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."dmc-web_tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_clients" ADD CONSTRAINT "dmc-web_clients_country_code_dmc-web_countries_code_fk" FOREIGN KEY ("country_code") REFERENCES "public"."dmc-web_countries"("code") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_drivers" ADD CONSTRAINT "dmc-web_drivers_tenant_id_dmc-web_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."dmc-web_tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_drivers" ADD CONSTRAINT "dmc-web_drivers_city_id_dmc-web_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."dmc-web_cities"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_driver_languages" ADD CONSTRAINT "dmc-web_driver_languages_driver_id_dmc-web_drivers_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."dmc-web_drivers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_driver_languages" ADD CONSTRAINT "dmc-web_driver_languages_language_code_dmc-web_languages_code_fk" FOREIGN KEY ("language_code") REFERENCES "public"."dmc-web_languages"("code") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_driver_vehicles" ADD CONSTRAINT "dmc-web_driver_vehicles_driver_id_dmc-web_drivers_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."dmc-web_drivers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_driver_vehicles" ADD CONSTRAINT "dmc-web_driver_vehicles_vehicle_id_dmc-web_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."dmc-web_vehicles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_driver_voucher_lines" ADD CONSTRAINT "dmc-web_driver_voucher_lines_transport_voucher_id_dmc-web_transport_vouchers_id_fk" FOREIGN KEY ("transport_voucher_id") REFERENCES "public"."dmc-web_transport_vouchers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_guides" ADD CONSTRAINT "dmc-web_guides_tenant_id_dmc-web_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."dmc-web_tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_guides" ADD CONSTRAINT "dmc-web_guides_city_id_dmc-web_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."dmc-web_cities"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_guide_languages" ADD CONSTRAINT "dmc-web_guide_languages_guide_id_dmc-web_guides_id_fk" FOREIGN KEY ("guide_id") REFERENCES "public"."dmc-web_guides"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_guide_languages" ADD CONSTRAINT "dmc-web_guide_languages_language_code_dmc-web_languages_code_fk" FOREIGN KEY ("language_code") REFERENCES "public"."dmc-web_languages"("code") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_guide_voucher_lines" ADD CONSTRAINT "dmc-web_guide_voucher_lines_transport_voucher_id_dmc-web_transport_vouchers_id_fk" FOREIGN KEY ("transport_voucher_id") REFERENCES "public"."dmc-web_transport_vouchers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_hotels" ADD CONSTRAINT "dmc-web_hotels_tenant_id_dmc-web_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."dmc-web_tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_hotels" ADD CONSTRAINT "dmc-web_hotels_city_id_dmc-web_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."dmc-web_cities"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_hotel_rooms" ADD CONSTRAINT "dmc-web_hotel_rooms_hotel_id_dmc-web_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."dmc-web_hotels"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_hotel_staffs" ADD CONSTRAINT "dmc-web_hotel_staffs_hotel_id_dmc-web_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."dmc-web_hotels"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_hotel_vouchers" ADD CONSTRAINT "dmc-web_hotel_vouchers_booking_line_id_dmc-web_booking_lines_id_fk" FOREIGN KEY ("booking_line_id") REFERENCES "public"."dmc-web_booking_lines"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_hotel_vouchers" ADD CONSTRAINT "dmc-web_hotel_vouchers_hotel_id_dmc-web_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."dmc-web_hotels"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_hotel_voucher_lines" ADD CONSTRAINT "dmc-web_hotel_voucher_lines_hotel_voucher_id_dmc-web_hotel_vouchers_id_fk" FOREIGN KEY ("hotel_voucher_id") REFERENCES "public"."dmc-web_hotel_vouchers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_other_transports" ADD CONSTRAINT "dmc-web_other_transports_tenant_id_dmc-web_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."dmc-web_tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_other_transports" ADD CONSTRAINT "dmc-web_other_transports_city_id_dmc-web_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."dmc-web_cities"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_other_transport_voucher_lines" ADD CONSTRAINT "dmc-web_other_transport_voucher_lines_transport_voucher_id_dmc-web_transport_vouchers_id_fk" FOREIGN KEY ("transport_voucher_id") REFERENCES "public"."dmc-web_transport_vouchers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_other_transport_voucher_lines" ADD CONSTRAINT "dmc-web_other_transport_voucher_lines_other_transport_id_dmc-web_other_transports_id_fk" FOREIGN KEY ("other_transport_id") REFERENCES "public"."dmc-web_other_transports"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_restaurants" ADD CONSTRAINT "dmc-web_restaurants_tenant_id_dmc-web_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."dmc-web_tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_restaurants" ADD CONSTRAINT "dmc-web_restaurants_city_id_dmc-web_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."dmc-web_cities"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_restaurant_meals" ADD CONSTRAINT "dmc-web_restaurant_meals_restaurant_id_dmc-web_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."dmc-web_restaurants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_restaurant_vouchers" ADD CONSTRAINT "dmc-web_restaurant_vouchers_booking_line_id_dmc-web_booking_lines_id_fk" FOREIGN KEY ("booking_line_id") REFERENCES "public"."dmc-web_booking_lines"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_restaurant_vouchers" ADD CONSTRAINT "dmc-web_restaurant_vouchers_restaurant_id_dmc-web_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."dmc-web_restaurants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_restaurant_voucher_lines" ADD CONSTRAINT "dmc-web_restaurant_voucher_lines_restaurant_voucher_id_dmc-web_restaurant_vouchers_id_fk" FOREIGN KEY ("restaurant_voucher_id") REFERENCES "public"."dmc-web_restaurant_vouchers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_session" ADD CONSTRAINT "dmc-web_session_user_id_dmc-web_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."dmc-web_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_shops" ADD CONSTRAINT "dmc-web_shops_tenant_id_dmc-web_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."dmc-web_tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_shops" ADD CONSTRAINT "dmc-web_shops_city_id_dmc-web_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."dmc-web_cities"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_shop_shop_type" ADD CONSTRAINT "dmc-web_shop_shop_type_shop_id_dmc-web_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."dmc-web_shops"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_shop_shop_type" ADD CONSTRAINT "dmc-web_shop_shop_type_shop_type_id_dmc-web_shop_types_id_fk" FOREIGN KEY ("shop_type_id") REFERENCES "public"."dmc-web_shop_types"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_shop_vouchers" ADD CONSTRAINT "dmc-web_shop_vouchers_shop_id_dmc-web_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."dmc-web_shops"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_subscriptions" ADD CONSTRAINT "dmc-web_subscriptions_tenant_id_dmc-web_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."dmc-web_tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_tenants" ADD CONSTRAINT "dmc-web_tenants_country_code_dmc-web_countries_code_fk" FOREIGN KEY ("country_code") REFERENCES "public"."dmc-web_countries"("code") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_transport_vouchers" ADD CONSTRAINT "dmc-web_transport_vouchers_booking_line_id_dmc-web_booking_lines_id_fk" FOREIGN KEY ("booking_line_id") REFERENCES "public"."dmc-web_booking_lines"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_transport_vouchers" ADD CONSTRAINT "dmc-web_transport_vouchers_driver_id_dmc-web_drivers_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."dmc-web_drivers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_transport_vouchers" ADD CONSTRAINT "dmc-web_transport_vouchers_guide_id_dmc-web_guides_id_fk" FOREIGN KEY ("guide_id") REFERENCES "public"."dmc-web_guides"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_transport_vouchers" ADD CONSTRAINT "dmc-web_transport_vouchers_other_transport_id_dmc-web_other_transports_id_fk" FOREIGN KEY ("other_transport_id") REFERENCES "public"."dmc-web_other_transports"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_users" ADD CONSTRAINT "dmc-web_users_tenant_id_dmc-web_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."dmc-web_tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_vehicles" ADD CONSTRAINT "dmc-web_vehicles_tenant_id_dmc-web_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."dmc-web_tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_user_id_idx" ON "dmc-web_account" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_user_id_idx" ON "dmc-web_session" ("user_id");