"use server";

import {
  hotel,
  bookingLine,
  client,
  activityVendor,
  driver,
  country,
  tenant,
  booking,
} from "~/server/db/schema";
import { and, eq, count, sql } from "drizzle-orm";
import {
  InsertHotel,
  InsertHotelRoom,
  InsertHotelStaff,
} from "../../schemaTypes";
import { db } from "../..";

export type CompleteHotel = {
  hotel: InsertHotel & { city: string };
  hotelRooms: InsertHotelRoom[];
  hotelStaffs: InsertHotelStaff[];
};

export const getStat = async (tenantId: string) => {
  try {
    // const tenantId = db.query.tenant.findFirst({
    //   where: eq(tenant.clerkId, orgId),
    // });

    // if (!tenantId) {
    //   throw new Error("Couldn't find your organization");
    // }
    const [
      bookingCountResult,
      clientCountResult,
      hotelCountResult,
      activityVendorCountResult,
      driverCountResult,
    ] = await Promise.all([
      db
        .select({ bookingCount: count() })
        .from(booking)
        .where(eq(booking.tenantId, tenantId)),
      db
        .select({ clientCount: count() })
        .from(client)
        .where(eq(client.tenantId, tenantId)),
      db
        .select({ hotelCount: count() })
        .from(hotel)
        .where(eq(hotel.tenantId, tenantId)),
      db
        .select({ activityVendorCount: count() })
        .from(activityVendor)
        .where(eq(activityVendor.tenantId, tenantId)),
      db
        .select({ driverCount: count() })
        .from(driver)
        .where(eq(driver.tenantId, tenantId)),
    ]);

    const bookingCount = bookingCountResult[0]?.bookingCount ?? 0;
    const clientCount = clientCountResult[0]?.clientCount ?? 0;
    const hotelCount = hotelCountResult[0]?.hotelCount ?? 0;
    const activityVendorCount =
      activityVendorCountResult[0]?.activityVendorCount ?? 0;
    const driverCount = driverCountResult[0]?.driverCount ?? 0;

    return {
      bookingCount,
      clientCount,
      hotelCount,
      activityVendorCount,
      driverCount,
    };
  } catch (error) {
    console.error(error);
    return {
        bookingCount:0,
        clientCount:0,
        hotelCount:0,
        activityVendorCount:0,
        driverCount:0
    };
  }
};

export const getClientCountByCountry = async (orgId:string) => {
  const clientCountByCountry = await db
    .select({
      countryName: country.name,
      countryCode: country.code,
      clientCount: count(),
    })
    .from(client)
    .where(eq(client.tenantId, orgId))
    .leftJoin(country, eq(client.country, country.code)) // Adjust the join condition
    .groupBy(country.name, country.code);

  return clientCountByCountry.map((row) => ({
    country: row.countryName ?? "Unknown",
    code: row.countryCode ?? "Unknown",
    count: row.clientCount,
  }));
};
