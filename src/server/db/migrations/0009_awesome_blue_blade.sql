ALTER TABLE "dmc-web_hotel_vouchers" ADD COLUMN "availability_confirmed_by" varchar(255) DEFAULT '';--> statement-breakpoint
ALTER TABLE "dmc-web_hotel_vouchers" ADD COLUMN "availability_confirmed_to" varchar(255) DEFAULT '';--> statement-breakpoint
ALTER TABLE "dmc-web_hotel_vouchers" ADD COLUMN "rates_confirmed_by" varchar(255) DEFAULT '';--> statement-breakpoint
ALTER TABLE "dmc-web_hotel_vouchers" ADD COLUMN "rates_confirmed_to" varchar(255) DEFAULT '';