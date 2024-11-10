ALTER TABLE "dmc-web_activity_vouchers" DROP CONSTRAINT "dmc-web_activity_vouchers_coordinator_id_dmc-web_users_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_hotel_vouchers" DROP CONSTRAINT "dmc-web_hotel_vouchers_coordinator_id_dmc-web_users_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_restaurant_vouchers" DROP CONSTRAINT "dmc-web_restaurant_vouchers_coordinator_id_dmc-web_users_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_shop_vouchers" DROP CONSTRAINT "dmc-web_shop_vouchers_booking_line_id_dmc-web_booking_lines_id_fk";
--> statement-breakpoint
ALTER TABLE "dmc-web_transport_vouchers" DROP CONSTRAINT "dmc-web_transport_vouchers_coordinator_id_dmc-web_users_id_fk";
