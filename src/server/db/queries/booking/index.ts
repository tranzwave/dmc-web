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
  activityVoucher,
  shopVoucher,
  transportVoucher,
} from "../../schema";
import {
  ActivityVoucher,
  BookingDetails,
  HotelVoucher,
  RestaurantVoucher,
  ShopVoucher,
  TransportVoucher,
} from "~/app/dashboard/bookings/add/context";
import { PgTransaction } from "drizzle-orm/pg-core";

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

export const getBookingLineWithAllData = (id:string) => {
  return db.query.bookingLine.findFirst({
    where: eq(bookingLine.id, id),
    with: {
      booking: {
        with: {
          client: true,
          agent:true
        }
      },
      hotelVouchers: {
        with: {
          hotel: true,
          voucherLine: true
        }
      },
      restaurantVouchers: {
        with: {
          restaurant: true,
          voucherLine: true
        }
      },
      transportVouchers: {
        with: {
          driver: true
        }
      },
      activityVouchers: {
        with: {
          activity: true,
          activityVendor: true
        }
      },
      shopsVouchers: {
        with: {
          shop: true
        }
      }
    }
  })
}

// export const createNewBooking = async (
//   bookingDetails: BookingDetails,
//   newBooking?: InsertBooking,
//   generalData?: any,
//   parentBookingId?: string,
//   hotelVouchers?: HotelVoucher[],
//   restaurantVouchers?: any,
//   activityVouchers?: any,
//   shopsVouchers?: any,
// ) => {
//   try {
//     const tenantExist = await db.query.tenant.findFirst();

//     if (!tenantExist) {
//       throw new Error("Couldn't find a tenant");
//     }
//     const tenantId = tenantExist.id;

//     let parentBooking;

//     //Create client
//     const bookingClient = await createClient({
//       name: bookingDetails.general.clientName,
//       country: bookingDetails.general.country,
//       primaryEmail: bookingDetails.general.primaryEmail,
//       tenantId: tenantId,
//     });

//     // Check if the parent booking exists
//     if (parentBookingId) {
//       parentBooking = await db.query.booking.findFirst({
//         where: eq(booking.id, parentBookingId),
//       });
//     }

//     // If no parentBookingId, create a new parent booking
//     if (!parentBooking) {
//       parentBooking = await db
//         .insert(booking)
//         .values({
//           agentId: bookingDetails.general.agent,
//           clientId: bookingClient.id,
//           coordinatorId: bookingDetails.general.marketingManager,
//           managerId: bookingDetails.general.marketingManager,
//           tenantId: tenantId,
//           tourType: bookingDetails.general.tourType,
//         })
//         .returning();

//       if (
//         !parentBooking ||
//         !Array.isArray(parentBooking) ||
//         !parentBooking[0]?.id
//       ) {
//         throw new Error("Couldn't add new parent booking");
//       }
//     }

//     // Now we know parentBooking is an array with at least one item
//     const parentBookingIdToUse = Array.isArray(parentBooking)
//       ? parentBooking[0]?.id ?? ""
//       : parentBooking.id;

//     // Create a new booking line
//     const newBookingLineGeneral: InsertBookingLine = {
//       bookingId: parentBookingIdToUse,
//       adultsCount: 2,
//       kidsCount: 2,
//       startDate: new Date(bookingDetails.general.startDate),
//       endDate: new Date(bookingDetails.general.endDate),
//       includes: {
//         hotels: true,
//         transport: true,
//         activities: true,
//       },
//     };

//     const lineId = await createBookingLine(newBookingLineGeneral);

//     if (!lineId) {
//       throw new Error("Couldn't add new booking line");
//     }

//     // Handle hotel vouchers
//     if (bookingDetails.general.includes.hotels) {
//       await insertHotelVouchers(
//         bookingDetails.vouchers,
//         lineId,
//         bookingDetails.general.marketingManager,
//       );
//     }

//     if (bookingDetails.general.includes.hotels) {
//       await insertRestaurantVouchers(
//         bookingDetails.restaurants,
//         lineId,
//         bookingDetails.general.marketingManager,
//       );
//     }

//     if(bookingDetails.general.includes.activities){
//       await insertActivityVouchers(
//         bookingDetails.activities,
//         lineId,
//         bookingDetails.general.marketingManager
//       )
//     }
//     // Handle other vouchers similarly (e.g., restaurant, activity, shops)

//     return lineId;
//   } catch (error) {
//     console.error("Error in createNewBooking:", error);
//     throw error;
//   }
// };

// export const createClient = async (data: InsertClient) => {
//   //check if client exists
//   const existingClient = await db.query.client.findFirst({
//     where: and(
//       eq(client.tenantId, data.tenantId),
//       eq(client.name, data.name),
//       eq(client.primaryEmail, data.primaryEmail),
//     ),
//   });

//   if (!existingClient) {
//     const newClient = await db.insert(client).values(data).returning();

//     if (!newClient ?? !newClient[0]) {
//       throw new Error("Couldn't create client");
//     }

//     return newClient[0];
//   }

//   return existingClient;

//   //Create new client if client doesnt exist
// };

// export const createBookingLine = async (
//   data: InsertBookingLine,
// ): Promise<string> => {
//   const newBookingLine = await db.insert(bookingLine).values(data).returning();

//   if (!newBookingLine ?? !newBookingLine[0]?.id) {
//     throw new Error("Couldn't add booking line");
//   }
//   return newBookingLine[0].id;
// };


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
    // Start a transaction
    const result = await db.transaction(async (tx) => {
      const tenantExist = await tx.query.tenant.findFirst();

      if (!tenantExist) {
        throw new Error("Couldn't find a tenant");
      }
      const tenantId = tenantExist.id;

      let parentBooking;

      // Create client within the transaction
      const bookingClient = await createClientTx(tx, {
        name: bookingDetails.general.clientName,
        country: bookingDetails.general.country,
        primaryEmail: bookingDetails.general.primaryEmail,
        tenantId: tenantId,
      });

      // Check if the parent booking exists
      if (parentBookingId) {
        parentBooking = await tx.query.booking.findFirst({
          where: eq(booking.id, parentBookingId),
        });
      }

      // If no parentBookingId, create a new parent booking
      if (!parentBooking) {
        parentBooking = await tx
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
        ? parentBooking[0]?.id ?? ""
        : parentBooking.id;

      // Create a new booking line within the transaction
      const newBookingLineGeneral: InsertBookingLine = {
        bookingId: parentBookingIdToUse,
        adultsCount: bookingDetails.general.adultsCount,
        kidsCount: bookingDetails.general.kidsCount,
        startDate: new Date(bookingDetails.general.startDate),
        endDate: new Date(bookingDetails.general.endDate),
        includes: {
          hotels: bookingDetails.general.includes.hotels,
          restaurants: bookingDetails.general.includes.restaurants,
          transport: bookingDetails.general.includes.transport,
          activities: bookingDetails.general.includes.activities,
          shops:bookingDetails.general.includes.shops
        },
      };

      const lineId = await createBookingLineTx(tx, newBookingLineGeneral);

      if (!lineId) {
        throw new Error("Couldn't add new booking line");
      }

      // Handle hotel vouchers within the transaction
      if (bookingDetails.general.includes.hotels) {
        await insertHotelVouchersTx(
          tx,
          bookingDetails.vouchers,
          lineId,
          bookingDetails.general.marketingManager,
        );
      }

      // Handle restaurant vouchers within the transaction
      if (bookingDetails.general.includes.restaurants) {
        await insertRestaurantVouchersTx(
          tx,
          bookingDetails.restaurants,
          lineId,
          bookingDetails.general.marketingManager,
        );
      }

      // Handle activity vouchers within the transaction
      if (bookingDetails.general.includes.activities) {
        await insertActivityVouchersTx(
          tx,
          bookingDetails.activities,
          lineId,
          bookingDetails.general.marketingManager,
        );
      }

      // Handle shop vouchers within the transaction
      if (bookingDetails.general.includes.shops) {
        await insertShopVouchersTx(
          tx,
          bookingDetails.shops,
          lineId,
          bookingDetails.general.marketingManager,
        );
      }

      // Handle transport vouchers within the transaction
      if (bookingDetails.general.includes.transport) {
        await insertTransportVoucherTx(
          tx,
          bookingDetails.transport,
          lineId,
          bookingDetails.general.marketingManager,
        );
      }

      // Return the final booking line id
      return lineId;
    });

    return result;
  } catch (error) {
    console.error("Error in createNewBooking:", error);
    throw error;
  }
};

// Transactional functions for handling each operation
export const createClientTx = async (tx: any, data: InsertClient) => {
  const existingClient = await tx.query.client.findFirst({
    where: and(
      eq(client.tenantId, data.tenantId),
      eq(client.name, data.name),
      eq(client.primaryEmail, data.primaryEmail),
    ),
  });

  if (!existingClient) {
    const newClient = await tx.insert(client).values(data).returning();

    if (!newClient || !newClient[0]) {
      throw new Error("Couldn't create client");
    }

    return newClient[0];
  }

  return existingClient;
};

export const createBookingLineTx = async (
  tx: any,
  data: InsertBookingLine,
): Promise<string> => {
  const newBookingLine = await tx.insert(bookingLine).values(data).returning();

  if (!newBookingLine || !newBookingLine[0]?.id) {
    throw new Error("Couldn't add booking line");
  }
  return newBookingLine[0].id;
};

export const insertHotelVouchersTx = async (
  trx: any, // Replace with actual transaction type
  vouchers: HotelVoucher[],
  newBookingLineId: string,
  coordinatorId: string,
) => {
  const hotelVouchers = await Promise.all(
    vouchers.map(async (currentVoucher) => {
      // Add a voucher
      const newVoucher = await trx
        .insert(hotelVoucher)
        .values({
          bookingLineId: newBookingLineId,
          coordinatorId: coordinatorId,
          hotelId: currentVoucher.hotel.id,
        })
        .returning();

      if (!newVoucher || !newVoucher[0]?.id) {
        throw new Error("Couldn't add hotel voucher");
      }

      const voucherId = newVoucher[0]?.id;

      // Add voucher lines
      const voucherLines = await Promise.all(
        currentVoucher.voucherLines.map(async (currentVoucherLine) => {
          const newVoucherLine = await trx
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
            throw new Error("Couldn't add hotel voucher line");
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

export const insertRestaurantVouchersTx = async (
  trx: any, // Replace with actual transaction type
  vouchers: RestaurantVoucher[],
  newBookingLineId: string,
  coordinatorId: string,
) => {
  const restaurantVouchers = await Promise.all(
    vouchers.map(async (currentVoucher) => {
      // Add a voucher
      const newVoucher = await trx
        .insert(restaurantVoucher)
        .values({
          bookingLineId: newBookingLineId,
          coordinatorId: coordinatorId,
          restaurantId: currentVoucher.restaurant.id,
        })
        .returning();

      if (!newVoucher || !newVoucher[0]?.id) {
        throw new Error("Couldn't add restaurant voucher");
      }

      const voucherId = newVoucher[0]?.id;

      // Add voucher lines
      const voucherLines = await Promise.all(
        currentVoucher.voucherLines.map(async (currentVoucherLine) => {
          const newVoucherLine = await trx
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
            throw new Error("Couldn't add restaurant voucher line");
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

export const insertActivityVouchersTx = async (
  trx: any, // Replace with actual transaction type
  vouchers: ActivityVoucher[],
  newBookingLineId: string,
  coordinatorId: string,
) => {
  const activityVouchers = await Promise.all(
    vouchers.map(async (currentVoucher) => {
      const newVoucher = await trx
        .insert(activityVoucher)
        .values({
          ...currentVoucher.voucher,
          coordinatorId: coordinatorId,
          bookingLineId: newBookingLineId,
        })
        .returning();

      if (!newVoucher || !newVoucher[0]?.id) {
        throw new Error("Couldn't add activity voucher");
      }

      const voucherId = newVoucher[0]?.id;

      return voucherId;
    }),
  );
  return activityVouchers;
};

export const insertShopVouchersTx = async (
  trx: any,
  vouchers: ShopVoucher[],
  newBookingLineId: string,
  coordinatorId: string,
) => {
  const shopVouchers = await Promise.all(
    vouchers.map(async (currentVoucher) => {
      const newVoucher = await trx
        .insert(shopVoucher)
        .values({
          ...currentVoucher.voucher,
          coordinatorId: coordinatorId,
          bookingLineId: newBookingLineId,
        })
        .returning();

      if (!newVoucher || !newVoucher[0]?.id) {
        throw new Error("Couldn't add shop voucher");
      }

      const voucherId = newVoucher[0]?.id;

      return voucherId;
    }),
  );
  return shopVouchers;
};

export const insertTransportVoucherTx = async (
  trx: any,
  vouchers: TransportVoucher[],
  newBookingLineId: string,
  coordinatorId: string,
) => {
  const transportVouchers = await Promise.all(
    vouchers.map(async (currentVoucher) => {
      const newVoucher = await trx
        .insert(transportVoucher)
        .values({
          ...currentVoucher.voucher,
          coordinatorId: coordinatorId,
          bookingLineId: newBookingLineId,
        })
        .returning();

      if (!newVoucher || !newVoucher[0]?.id) {
        throw new Error("Couldn't add transport voucher");
      }

      const voucherId = newVoucher[0]?.id;

      return voucherId;
    }),
  );
  return transportVouchers;
};
