ALTER TABLE "dmc-web_account" DROP CONSTRAINT "dmc-web_account_user_id_dmc-web_users_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_activities" DROP CONSTRAINT "dmc-web_activities_activity_type_id_dmc-web_activity_types_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_activity_vendors" DROP CONSTRAINT "dmc-web_activity_vendors_city_id_dmc-web_cities_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_activity_vouchers" DROP CONSTRAINT "dmc-web_activity_vouchers_activity_vendor_id_dmc-web_activity_vendors_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_agents" DROP CONSTRAINT "dmc-web_agents_country_code_dmc-web_countries_code_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_bookings" DROP CONSTRAINT "dmc-web_bookings_client_id_dmc-web_clients_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_cities" DROP CONSTRAINT "dmc-web_cities_country_code_dmc-web_countries_code_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_clients" DROP CONSTRAINT "dmc-web_clients_country_code_dmc-web_countries_code_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_drivers" DROP CONSTRAINT "dmc-web_drivers_city_id_dmc-web_cities_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_driver_languages" DROP CONSTRAINT "dmc-web_driver_languages_language_code_dmc-web_languages_code_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_driver_vehicles" DROP CONSTRAINT "dmc-web_driver_vehicles_vehicle_id_dmc-web_vehicles_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_guides" DROP CONSTRAINT "dmc-web_guides_city_id_dmc-web_cities_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_guide_languages" DROP CONSTRAINT "dmc-web_guide_languages_language_code_dmc-web_languages_code_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_hotels" DROP CONSTRAINT "dmc-web_hotels_city_id_dmc-web_cities_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_other_transports" DROP CONSTRAINT "dmc-web_other_transports_city_id_dmc-web_cities_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_restaurants" DROP CONSTRAINT "dmc-web_restaurants_city_id_dmc-web_cities_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_session" DROP CONSTRAINT "dmc-web_session_user_id_dmc-web_users_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_shops" DROP CONSTRAINT "dmc-web_shops_city_id_dmc-web_cities_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_shop_shop_type" DROP CONSTRAINT "dmc-web_shop_shop_type_shop_id_dmc-web_shops_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_tenants" DROP CONSTRAINT "dmc-web_tenants_country_code_dmc-web_countries_code_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_transport_vouchers" DROP CONSTRAINT "dmc-web_transport_vouchers_driver_id_dmc-web_drivers_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_account" ADD CONSTRAINT "dmc-web_account_user_id_dmc-web_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."dmc-web_users"("id") ON DELETE cascade ON UPDATE no action;
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
 ALTER TABLE "dmc-web_activity_vendors" ADD CONSTRAINT "dmc-web_activity_vendors_city_id_dmc-web_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."dmc-web_cities"("id") ON DELETE cascade ON UPDATE no action;
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
 ALTER TABLE "dmc-web_agents" ADD CONSTRAINT "dmc-web_agents_country_code_dmc-web_countries_code_fk" FOREIGN KEY ("country_code") REFERENCES "public"."dmc-web_countries"("code") ON DELETE cascade ON UPDATE no action;
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
 ALTER TABLE "dmc-web_cities" ADD CONSTRAINT "dmc-web_cities_country_code_dmc-web_countries_code_fk" FOREIGN KEY ("country_code") REFERENCES "public"."dmc-web_countries"("code") ON DELETE cascade ON UPDATE no action;
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
 ALTER TABLE "dmc-web_drivers" ADD CONSTRAINT "dmc-web_drivers_city_id_dmc-web_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."dmc-web_cities"("id") ON DELETE cascade ON UPDATE no action;
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
 ALTER TABLE "dmc-web_driver_vehicles" ADD CONSTRAINT "dmc-web_driver_vehicles_vehicle_id_dmc-web_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."dmc-web_vehicles"("id") ON DELETE cascade ON UPDATE no action;
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
 ALTER TABLE "dmc-web_guide_languages" ADD CONSTRAINT "dmc-web_guide_languages_language_code_dmc-web_languages_code_fk" FOREIGN KEY ("language_code") REFERENCES "public"."dmc-web_languages"("code") ON DELETE cascade ON UPDATE no action;
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
 ALTER TABLE "dmc-web_other_transports" ADD CONSTRAINT "dmc-web_other_transports_city_id_dmc-web_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."dmc-web_cities"("id") ON DELETE cascade ON UPDATE no action;
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
 ALTER TABLE "dmc-web_session" ADD CONSTRAINT "dmc-web_session_user_id_dmc-web_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."dmc-web_users"("id") ON DELETE cascade ON UPDATE no action;
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
 ALTER TABLE "dmc-web_tenants" ADD CONSTRAINT "dmc-web_tenants_country_code_dmc-web_countries_code_fk" FOREIGN KEY ("country_code") REFERENCES "public"."dmc-web_countries"("code") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_transport_vouchers" ADD CONSTRAINT "dmc-web_transport_vouchers_driver_id_dmc-web_drivers_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."dmc-web_drivers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
