"use server";

import { and, eq } from "drizzle-orm";
import { db } from "../..";
import {
  CombinedHotelVoucher,
  InsertBooking,
  InsertBookingLine,
  InsertClient,
} from "../../schemaTypes";
import {
  booking,
  bookingLine,
  hotelVoucher,
  hotelVoucherLine,
  client,
  restaurantVoucher,
  restaurantVoucherLine,
} from "../../schema";
import {
  BookingDetails,
  HotelVoucher,
  RestaurantVoucher,
} from "~/app/dashboard/bookings/add/context";

export const getAllBookings = () => {
  return db.query.booking.findMany();
};

//TODO: Add tenant validation
export const getAllBookingLines = () => {
  return db.query.bookingLine.findMany({
    with: {
      booking: {
        with: {
          client: true,
        },
      },
    },
  });
};

export const getBookingById = (id: string) => {
  return db.query.booking.findFirst({
    where: eq(booking.id, id),
  });
};

export const getBookingLineById = (id: string) => {
  return db.query.bookingLine.findFirst({
    where: eq(bookingLine.id, id),
  });
};

export const createNewBooking = async (
  bookingDetails: BookingDetails,
  newBooking?: InsertBooking,
  generalData?: any,
  parentBookingId?: string,
  hotelVouchers?: HotelVoucher[],
  restaurantVouchers?: any,
  activityVouchers?: any,
  shopsVouchers?: any,
) => {
  try {
    const tenantExist = await db.query.tenant.findFirst();

    if (!tenantExist) {
      throw new Error("Couldn't find a tenant");
    }
    const tenantId = tenantExist.id;

    let parentBooking;

    //Create client
    const bookingClient = await createClient({
      name: bookingDetails.general.clientName,
      country: bookingDetails.general.country,
      primaryEmail: bookingDetails.general.primaryEmail,
      tenantId: tenantId,
    });

    // Check if the parent booking exists
    if (parentBookingId) {
      parentBooking = await db.query.booking.findFirst({
        where: eq(booking.id, parentBookingId),
      });
    }

    // If no parentBookingId, create a new parent booking
    if (!parentBooking) {
      parentBooking = await db
        .insert(booking)
        .values({
          agentId: bookingDetails.general.agent,
          clientId: bookingClient.id,
          coordinatorId: bookingDetails.general.marketingManager,
          managerId: bookingDetails.general.marketingManager,
          tenantId: tenantId,
          tourType: bookingDetails.general.tourType,
        })
        .returning();

      if (
        !parentBooking ||
        !Array.isArray(parentBooking) ||
        !parentBooking[0]?.id
      ) {
        throw new Error("Couldn't add new parent booking");
      }
    }

    // Now we know parentBooking is an array with at least one item
    const parentBookingIdToUse = Array.isArray(parentBooking)
      ? parentBooking[0]?.id || ""
      : parentBooking.id;

    // Create a new booking line
    const newBookingLineGeneral: InsertBookingLine = {
      bookingId: parentBookingIdToUse,
      adultsCount: 2,
      kidsCount: 2,
      startDate: new Date(bookingDetails.general.startDate),
      endDate: new Date(bookingDetails.general.endDate),
      includes: {
        hotels: true,
        transport: true,
        activities: true,
      },
    };

    const lineId = await createBookingLine(newBookingLineGeneral);

    if (!lineId) {
      throw new Error("Couldn't add new booking line");
    }

    // Handle hotel vouchers
    if (bookingDetails.general.includes.hotels) {
      await insertHotelVouchers(
        bookingDetails.vouchers,
        lineId,
        bookingDetails.general.marketingManager,
      );
    }

    if(bookingDetails.general.includes.hotels){
        await insertRestaurantVouchers(
            bookingDetails.restaurants,
            lineId,
            bookingDetails.general.marketingManager
        )
    }
    // Handle other vouchers similarly (e.g., restaurant, activity, shops)

    return lineId;
  } catch (error) {
    console.error("Error in createNewBooking:", error);
    throw error;
  }
};

export const createClient = async (data: InsertClient) => {
  //check if client exists
  const existingClient = await db.query.client.findFirst({
    where: and(
      eq(client.tenantId, data.tenantId),
      eq(client.name, data.name),
      eq(client.primaryEmail, data.primaryEmail),
    ),
  });

  if (!existingClient) {
    const newClient = await db.insert(client).values(data).returning();

    if (!newClient || !newClient[0]) {
      throw new Error("Couldn't create client");
    }

    return newClient[0];
  }

  return existingClient;

  //Create new client if client doesnt exist
};

export const createBookingLine = async (
  data: InsertBookingLine,
): Promise<string> => {
  const newBookingLine = await db.insert(bookingLine).values(data).returning();

  if (!newBookingLine || !newBookingLine[0]?.id) {
    throw new Error("Couldn't add booking line");
  }
  return newBookingLine[0].id;
};

export const insertHotelVouchers = async (
  vouchers: HotelVoucher[],
  newBookingLineId: string,
  coordinatorId: string,
) => {
  const hotelVouchers = await Promise.all(
    vouchers.map(async (currentVoucher) => {
      // Add a voucher
      const newVoucher = await db
        .insert(hotelVoucher)
        .values({
          bookingLineId: newBookingLineId,
          coordinatorId: coordinatorId,
          hotelId: currentVoucher.hotel.id,
        })
        .returning();

      if (!newVoucher || !newVoucher[0]?.id) {
        throw new Error("Couldn't add voucher");
      }

      const voucherId = newVoucher[0]?.id;

      console.log(voucherId);
      // Add voucher lines
      const voucherLines = await Promise.all(
        currentVoucher.voucherLines.map(async (currentVoucherLine) => {
          const newVoucherLine = await db
            .insert(hotelVoucherLine)
            .values({
              adultsCount: currentVoucherLine.adultsCount,
              kidsCount: currentVoucherLine.kidsCount,
              roomCount: currentVoucherLine.roomCount,
              checkInDate: currentVoucherLine.checkInDate,
              checkInTime: currentVoucherLine.checkInTime,
              checkOutDate: currentVoucherLine.checkOutDate,
              checkOutTime: currentVoucherLine.checkOutTime,
              basis: currentVoucherLine.basis,
              roomType: currentVoucherLine.roomType,
              hotelVoucherId: voucherId,
            })
            .returning();

          if (!newVoucherLine || !newVoucherLine[0]?.id) {
            throw new Error("Couldn't add voucher line");
          }

          return newVoucherLine[0].id;
        }),
      );

      // Return a map of voucherId to voucherLineIds
      return { voucherId, voucherLines };
    }),
  );

  return hotelVouchers;
};

export const insertRestaurantVouchers = async (
  vouchers: RestaurantVoucher[],
  newBookingLineId: string,
  coordinatorId: string,
) => {
  const restaurantVouchers = await Promise.all(
    vouchers.map(async (currentVoucher) => {
      //Add a voucher
      const newVoucher = await db
        .insert(restaurantVoucher)
        .values({
          bookingLineId: newBookingLineId,
          coordinatorId: coordinatorId,
          restaurantId: currentVoucher.restaurant.id,
        })
        .returning();

      if (!newVoucher || !newVoucher[0]?.id) {
        throw new Error("Couldn't add voucher");
      }

      const voucherId = newVoucher[0]?.id;

      console.log(voucherId);

      const voucherLines = await Promise.all(
        currentVoucher.voucherLines.map(async (currentVoucherLine) => {
          const newVoucherLine = await db
            .insert(restaurantVoucherLine)
            .values({
              adultsCount: currentVoucherLine.adultsCount,
              kidsCount: currentVoucherLine.kidsCount,
              mealType: currentVoucherLine.mealType,
              date: currentVoucherLine.date,
              time: currentVoucherLine.time,
              restaurantVoucherId: voucherId,
            })
            .returning();

          if (!newVoucherLine || !newVoucherLine[0]?.id) {
            throw new Error("Couldn't add voucher line");
          }

          return newVoucherLine[0].id;
        }),
      );

      // Return a map of voucherId to voucherLineIds
      return { voucherId, voucherLines };
    }),
  );

  return restaurantVouchers;
};
