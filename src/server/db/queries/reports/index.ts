"use server";

import { sql } from "drizzle-orm";
import { db } from "../..";
import {
    bookingLine,
    driver,
    hotel,
    hotelVoucher,
    transportVoucher
} from "../../schema";

// export const getBookingCountByMonth = async () => {
//   const bookingCountByMonth = await db
//     .select({
//       month: bookingLine.startDate,
//       bookingCount: count(),
//     })
//     .from(bookingLine)
//     .groupBy(bookingLine.startDate);

//   return bookingCountByMonth.map(row => ({
//     month: row.month ?? "Unknown",
//     count: row.bookingCount ?? "Unknown",
//   }));
// };


export const getBookingCountByMonth = async () => {
    const currentDate = new Date();
    const lastYearDate = new Date();
    lastYearDate.setFullYear(currentDate.getFullYear() - 1);

    const bookingCountByMonth = await db
        .select({
            month: sql`DATE_TRUNC('month', ${bookingLine.startDate})`.as('month'),
            bookingCount: sql`COUNT(*)`.as('bookingCount'),
        })
        .from(bookingLine)
        .where(sql`${bookingLine.startDate} >= ${lastYearDate}`)
        .groupBy(sql`DATE_TRUNC('month', ${bookingLine.startDate})`);

    const getMonthAndYear = (date: any) => {
        const monthNames = [
            "January", "February", "March", "April",
            "May", "June", "July", "August",
            "September", "October", "November", "December"
        ];

        const monthIndex = new Date(date).getMonth();
        const year = new Date(date).getFullYear();
        return `${monthNames[monthIndex]} ${year}`;
    };

    return bookingCountByMonth.map(row => ({
        month: getMonthAndYear(row.month),
        count: Number(row.bookingCount),
    }));
};


export const getHotelBookingStats = async () => {
    const hotelBookingStats = await db
        .select({
            hotelName: hotel.name,
            bookingCount: sql`COUNT(${hotelVoucher.id})`.as('bookingCount'),
            lastBookingDate: sql`MAX(${hotelVoucher.createdAt})`.as('lastBookingDate')
        })
        .from(hotel)
        .innerJoin(hotelVoucher, sql`${hotel.id} = ${hotelVoucher.hotelId}`)
        .groupBy(hotel.id)
    // .orderBy(sql`COUNT(${hotelVoucher.id})`, 'desc');

    return hotelBookingStats.map(row => {
        let formattedDate = null;

        if (row.lastBookingDate && (typeof row.lastBookingDate === 'string' || typeof row.lastBookingDate === 'number')) {
            const date = new Date(row.lastBookingDate);
            if (!isNaN(date.getTime())) {
                formattedDate = date.toLocaleDateString();
            }
        }

        return {
            hotelName: row.hotelName,
            bookingCount: Number(row.bookingCount),
            lastBookingDate: formattedDate
        };
    });
};


export const getDriverBookingStats = async () => {
    const driverBookingStats = await db
        .select({
            driverName: driver.name,
            numberOfBookings: sql`COUNT(${transportVoucher.id})`.as('numberOfBookings'),
            numberOfUpcomingTrips: sql`
        COUNT(CASE 
          WHEN ${transportVoucher.startDate}::timestamp > NOW() 
          THEN 1 
          ELSE NULL
        END)
      `.as('numberOfUpcomingTrips'),
            numberOfOngoingTrips: sql`
        COUNT(CASE 
          WHEN ${transportVoucher.startDate}::timestamp <= NOW() 
          AND ${transportVoucher.endDate}::timestamp >= NOW() 
          THEN 1 
          ELSE NULL
        END)
      `.as('numberOfOngoingTrips'),
        })
        .from(driver)
        .innerJoin(transportVoucher, sql`${driver.id} = ${transportVoucher.driverId}`)
        .groupBy(driver.id);

    return driverBookingStats.map(row => ({
        driverName: row.driverName,
        numberOfBookings: Number(row.numberOfBookings),
        numberOfUpcomingTrips: Number(row.numberOfUpcomingTrips),
        numberOfOngoingTrips: Number(row.numberOfOngoingTrips),
    }));
};

