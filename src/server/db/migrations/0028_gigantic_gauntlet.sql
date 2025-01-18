ALTER TABLE "dmc-web_restaurant_vouchers" ADD COLUMN "reason_to_cancel" varchar(255) DEFAULT '';--> statement-breakpoint
ALTER TABLE "dmc-web_restaurant_voucher_lines" ADD COLUMN "availability_confirmed_by" varchar(255) DEFAULT '';--> statement-breakpoint
ALTER TABLE "dmc-web_restaurant_voucher_lines" ADD COLUMN "availability_confirmed_to" varchar(255) DEFAULT '';--> statement-breakpoint
ALTER TABLE "dmc-web_restaurant_voucher_lines" ADD COLUMN "rates_confirmed_by" varchar(255) DEFAULT '';--> statement-breakpoint
ALTER TABLE "dmc-web_restaurant_voucher_lines" ADD COLUMN "rates_confirmed_to" varchar(255) DEFAULT '';--> statement-breakpoint
ALTER TABLE "dmc-web_restaurant_voucher_lines" ADD COLUMN "reason_to_amend" varchar(255) DEFAULT '';--> statement-breakpoint
ALTER TABLE "dmc-web_restaurant_voucher_lines" ADD COLUMN "reason_to_cancel" varchar(255) DEFAULT '';