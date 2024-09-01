import { getTableName, sql, Table } from "drizzle-orm";
import { conn, db, DB } from ".";
import * as schema from "./schema"
import * as seeds from './seeds'
import { env } from "~/env";

if (!env.DB_SEEDING) {
  throw new Error('You must set DB_SEEDING to "true" when running seeds');
}

async function resetTable(db: DB, table: Table) {
  return db.execute(
    sql.raw(`TRUNCATE TABLE "${getTableName(table)}" RESTART IDENTITY CASCADE`),
  );
}

for (const table of [
  schema.country,
  schema.tenant,
  schema.user,
  schema.client,
  schema.agent,
  schema.city,
  schema.hotel,
  schema.hotelRoom,
  schema.hotelStaff,
  schema.restaurant,
  schema.restaurantMeal,
  schema.language,
  schema.driver,
  schema.vehicle,
  schema.driverVehicle,
  schema.driverLanguage,
  schema.activityType,
  schema.activity,
  schema.activityVendor,
  schema.shop,
  schema.shopType,
  schema.shopShopType,
  schema.hotelVoucher,
  schema.hotelVoucherLine,
  schema.restaurantVoucher,
  schema.restaurantVoucherLine,
  schema.transportVoucher,
  schema.activityVoucher,
  schema.shopVoucher,
  schema.booking,
  schema.bookingLine,
]) {
  await resetTable(db, table);
}


await seeds.country(db)
await seeds.city(db)
await seeds.language(db)
await seeds.tenant(db)
await seeds.agent(db)
await seeds.hotel(db)
await seeds.restaurant(db)
await seeds.driver(db)
await seeds.activityVendor(db)
await seeds.shop(db)

await conn.end();





