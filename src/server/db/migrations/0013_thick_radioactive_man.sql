ALTER TABLE "dmc-web_bookings" ALTER COLUMN "agent_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "dmc-web_hotel_vouchers" ADD COLUMN "reason_to_amend" varchar(255) DEFAULT '';--> statement-breakpoint
ALTER TABLE "dmc-web_restaurant_vouchers" ADD COLUMN "reason_to_amend" varchar(255) DEFAULT '';