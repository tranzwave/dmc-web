ALTER TABLE "dmc-web_activities" DROP CONSTRAINT "dmc-web_activities_tenant_id_dmc-web_tenants_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_activity_vendors" DROP CONSTRAINT "dmc-web_activity_vendors_tenant_id_dmc-web_tenants_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_activity_vouchers" DROP CONSTRAINT "dmc-web_activity_vouchers_booking_line_id_dmc-web_booking_lines_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_agents" DROP CONSTRAINT "dmc-web_agents_tenant_id_dmc-web_tenants_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_bookings" DROP CONSTRAINT "dmc-web_bookings_tenant_id_dmc-web_tenants_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_booking_lines" DROP CONSTRAINT "dmc-web_booking_lines_booking_id_dmc-web_bookings_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_clients" DROP CONSTRAINT "dmc-web_clients_tenant_id_dmc-web_tenants_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_drivers" DROP CONSTRAINT "dmc-web_drivers_tenant_id_dmc-web_tenants_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_driver_languages" DROP CONSTRAINT "dmc-web_driver_languages_driver_id_dmc-web_drivers_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_driver_vehicles" DROP CONSTRAINT "dmc-web_driver_vehicles_driver_id_dmc-web_drivers_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_driver_voucher_lines" DROP CONSTRAINT "dmc-web_driver_voucher_lines_transport_voucher_id_dmc-web_transport_vouchers_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_guides" DROP CONSTRAINT "dmc-web_guides_tenant_id_dmc-web_tenants_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_guide_languages" DROP CONSTRAINT "dmc-web_guide_languages_guide_id_dmc-web_guides_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_guide_voucher_lines" DROP CONSTRAINT "dmc-web_guide_voucher_lines_transport_voucher_id_dmc-web_transport_vouchers_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_hotels" DROP CONSTRAINT "dmc-web_hotels_tenant_id_dmc-web_tenants_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_hotel_rooms" DROP CONSTRAINT "dmc-web_hotel_rooms_hotel_id_dmc-web_hotels_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_hotel_staffs" DROP CONSTRAINT "dmc-web_hotel_staffs_hotel_id_dmc-web_hotels_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_hotel_vouchers" DROP CONSTRAINT "dmc-web_hotel_vouchers_booking_line_id_dmc-web_booking_lines_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_hotel_voucher_lines" DROP CONSTRAINT "dmc-web_hotel_voucher_lines_hotel_voucher_id_dmc-web_hotel_vouchers_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_other_transports" DROP CONSTRAINT "dmc-web_other_transports_tenant_id_dmc-web_tenants_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_other_transport_voucher_lines" DROP CONSTRAINT "dmc-web_other_transport_voucher_lines_transport_voucher_id_dmc-web_transport_vouchers_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_restaurants" DROP CONSTRAINT "dmc-web_restaurants_tenant_id_dmc-web_tenants_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_restaurant_meals" DROP CONSTRAINT "dmc-web_restaurant_meals_restaurant_id_dmc-web_restaurants_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_restaurant_vouchers" DROP CONSTRAINT "dmc-web_restaurant_vouchers_booking_line_id_dmc-web_booking_lines_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_restaurant_voucher_lines" DROP CONSTRAINT "dmc-web_restaurant_voucher_lines_restaurant_voucher_id_dmc-web_restaurant_vouchers_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_shops" DROP CONSTRAINT "dmc-web_shops_tenant_id_dmc-web_tenants_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_shop_vouchers" DROP CONSTRAINT "dmc-web_shop_vouchers_shop_id_dmc-web_shops_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_subscriptions" DROP CONSTRAINT "dmc-web_subscriptions_tenant_id_dmc-web_tenants_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_transport_vouchers" DROP CONSTRAINT "dmc-web_transport_vouchers_booking_line_id_dmc-web_booking_lines_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_users" DROP CONSTRAINT "dmc-web_users_tenant_id_dmc-web_tenants_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_vehicles" DROP CONSTRAINT "dmc-web_vehicles_tenant_id_dmc-web_tenants_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_restaurant_vouchers" ALTER COLUMN "restaurant_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "dmc-web_subscriptions" ADD COLUMN "status" varchar(255) DEFAULT 'active' NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dmc-web_activities" ADD CONSTRAINT "dmc-web_activities_tenant_id_dmc-web_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."dmc-web_tenants"("id") ON DELETE cascade ON UPDATE no action;
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
 ALTER TABLE "dmc-web_activity_vouchers" ADD CONSTRAINT "dmc-web_activity_vouchers_booking_line_id_dmc-web_booking_lines_id_fk" FOREIGN KEY ("booking_line_id") REFERENCES "public"."dmc-web_booking_lines"("id") ON DELETE cascade ON UPDATE no action;
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
 ALTER TABLE "dmc-web_bookings" ADD CONSTRAINT "dmc-web_bookings_tenant_id_dmc-web_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."dmc-web_tenants"("id") ON DELETE cascade ON UPDATE no action;
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
 ALTER TABLE "dmc-web_clients" ADD CONSTRAINT "dmc-web_clients_tenant_id_dmc-web_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."dmc-web_tenants"("id") ON DELETE cascade ON UPDATE no action;
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
 ALTER TABLE "dmc-web_driver_languages" ADD CONSTRAINT "dmc-web_driver_languages_driver_id_dmc-web_drivers_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."dmc-web_drivers"("id") ON DELETE cascade ON UPDATE no action;
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
 ALTER TABLE "dmc-web_guide_languages" ADD CONSTRAINT "dmc-web_guide_languages_guide_id_dmc-web_guides_id_fk" FOREIGN KEY ("guide_id") REFERENCES "public"."dmc-web_guides"("id") ON DELETE cascade ON UPDATE no action;
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
 ALTER TABLE "dmc-web_other_transport_voucher_lines" ADD CONSTRAINT "dmc-web_other_transport_voucher_lines_transport_voucher_id_dmc-web_transport_vouchers_id_fk" FOREIGN KEY ("transport_voucher_id") REFERENCES "public"."dmc-web_transport_vouchers"("id") ON DELETE cascade ON UPDATE no action;
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
 ALTER TABLE "dmc-web_restaurant_voucher_lines" ADD CONSTRAINT "dmc-web_restaurant_voucher_lines_restaurant_voucher_id_dmc-web_restaurant_vouchers_id_fk" FOREIGN KEY ("restaurant_voucher_id") REFERENCES "public"."dmc-web_restaurant_vouchers"("id") ON DELETE cascade ON UPDATE no action;
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
 ALTER TABLE "dmc-web_transport_vouchers" ADD CONSTRAINT "dmc-web_transport_vouchers_booking_line_id_dmc-web_booking_lines_id_fk" FOREIGN KEY ("booking_line_id") REFERENCES "public"."dmc-web_booking_lines"("id") ON DELETE cascade ON UPDATE no action;
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
