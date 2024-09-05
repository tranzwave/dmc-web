"use server"

import { hotel, bookingLine, client, activityVendor, driver, country } from '~/server/db/schema';
import { and, eq, count, sql } from "drizzle-orm";
import { InsertHotel, InsertHotelRoom, InsertHotelStaff } from "../../schemaTypes";
import { db } from "../..";

export type CompleteHotel = {
    hotel: InsertHotel & {city:string},
    hotelRooms:InsertHotelRoom[],
    hotelStaffs:InsertHotelStaff[]
}

export const getStat = async () => {
    const [bookingCountResult, clientCountResult, hotelCountResult, activityVendorCountResult, driverCountResult] = await Promise.all([
        db.select({ bookingCount: count() }).from(bookingLine),
        db.select({ clientCount: count() }).from(client),
        db.select({ hotelCount: count() }).from(hotel),
        db.select({ activityVendorCount: count() }).from(activityVendor),
        db.select({ driverCount: count() }).from(driver),
    ]);

    // Extract the counts from the results
    const bookingCount = bookingCountResult[0]?.bookingCount ?? 0;
    const clientCount = clientCountResult[0]?.clientCount ?? 0;
    const hotelCount = hotelCountResult[0]?.hotelCount ?? 0;
    const activityVendorCount = activityVendorCountResult[0]?.activityVendorCount ?? 0;
    const driverCount = driverCountResult[0]?.driverCount ?? 0;

    return {
        bookingCount,
        clientCount,
        hotelCount,
        activityVendorCount,
        driverCount,
    };
};


export const getClientCountByCountry = async () => {
    const clientCountByCountry = await db
        .select({
            countryName: country.name,
            countryCode: country.code,
            clientCount: count(),
        })
        .from(client)
        .leftJoin(country, eq(client.country, country.code)) // Adjust the join condition
        .groupBy(country.name, country.code);

    return clientCountByCountry.map(row => ({
        country: row.countryName ?? "Unknown",
        code: row.countryCode ?? "Unknown",
        count: row.clientCount,
    }));
};



