"use server";

import { and, eq, sql } from "drizzle-orm";
import {
  ActivityVoucher,
  BookingDetails,
  HotelVoucher,
  RestaurantVoucher,
  ShopVoucher,
  TransportVoucher,
} from "~/app/dashboard/bookings/add/context";
import { db } from "../..";
import {
  activityVoucher,
  booking,
  bookingLine,
  client,
  hotel,
  hotelVoucher,
  hotelVoucherLine,
  restaurantVoucher,
  restaurantVoucherLine,
  shopVoucher,
  tenant,
  transportVoucher,
} from "../../schema";
import {
  InsertBooking,
  InsertBookingLine,
  InsertClient
} from "../../schemaTypes";

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

export const getBookingLineWithAllData = (id: string) => {
  return db.query.bookingLine.findFirst({
    where: eq(bookingLine.id, id),
    with: {
      booking: {
        with: {
          client: true,
          agent: true
        }
      },
      hotelVouchers: {
        with: {
          hotel: true,
          voucherLines: true
        }
      },
      restaurantVouchers: {
        with: {
          restaurant: true,
          voucherLines: true
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

async function generateBookingLineId(tenantId: string, countryCode:string): Promise<string> {
  // Fetch tenant name and country based on tenantId
  const tenantData =  await db.query.tenant.findFirst({
    where: eq(tenant.id,tenantId)
})

  if (!tenantData) {
    throw new Error(`Tenant with ID ${tenantId} not found`);
  }


  // Helper function to generate a 6-digit random number
  const generate6DigitNumber = () => Math.floor(100000 + Math.random() * 900000).toString();

  // Format the ID: <tenantName>-<country>-<6 digits>
  return `${tenantData.name.toUpperCase().slice(0,3)}-${countryCode}-${generate6DigitNumber()}`;
}

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
        primaryContactNumber: bookingDetails.general.primaryContactNumber,
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
            agentId: bookingDetails.general.agent == '' ? null : bookingDetails.general.agent,
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

      const customId = await generateBookingLineId(tenantId, bookingDetails.general.country)

      // Create a new booking line within the transaction
      const newBookingLineGeneral: InsertBookingLine = {
        id:customId,
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
          shops: bookingDetails.general.includes.shops
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
  // const existingClient = await tx.query.client.findFirst({
  //   where: and(
  //     eq(client.tenantId, data.tenantId),
  //     eq(client.name, data.name),
  //     eq(client.primaryEmail, data.primaryEmail),
  //   ),
  // });

  const existingClient = false;

  if (!existingClient) {
    const newClient = await tx.insert(client).values(data).returning();

    if (!newClient || !newClient[0]) {
      throw new Error("Couldn't create client");
    }

    return newClient[0];
  }

  return existingClient;
};

export const updateClient = async (
  tx: any,
  clientId: string,
  updateData: Partial<InsertClient>
) => {
  try {
    // Validate that the client exists before attempting an update
    const existingClient = await tx.query.client.findFirst({
      where: eq(client.id, clientId),
    });

    if (!existingClient) {
      throw new Error(`Client with ID ${clientId} not found`);
    }

    // Update the existing client with new data
    const updatedClient = await tx
      .update(client)
      .set({
        name: updateData.name ?? existingClient.name,
        primaryEmail: updateData.primaryEmail ?? existingClient.primaryEmail,
        primaryContactNumber:
          updateData.primaryContactNumber ?? existingClient.primaryContactNumber,
        country: updateData.country ?? existingClient.country,
        // updatedAt: new Date(), // Update the `updatedAt` timestamp to the current time
      })
      .where(eq(client.id, clientId))
      .returning();

    // Return the updated client record
    if (!updatedClient || !updatedClient[0]) {
      throw new Error("Client update failed");
    }

    return updatedClient[0];
  } catch (error) {
    console.error("Error updating client:", error);
    throw error;
  }
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

export const addHotelVoucherLinesToBooking = async (
  vouchers: HotelVoucher[],
  newBookingLineId: string,
  coordinatorId: string,
) => {
  // Start a transaction
  const result = await db.transaction(async (trx) => {
    try {
      // Call the insertHotelVouchersTx function inside this transaction
      const insertedVouchers = await insertHotelVouchersTx(trx, vouchers, newBookingLineId, coordinatorId);

      // If there are additional inserts/updates, you can perform them here using the same trx.
      
      return insertedVouchers;
    } catch (error) {
      console.error('Error while inserting hotel vouchers:', error);
      throw error; // Rethrow to trigger transaction rollback
    }
  });

  return result;
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

          //Check for existing voucher

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

export const updateBookingLine = async (
  lineId: string,
  updatedBookingDetails: BookingDetails,
) => {
  try {
    // Start a transaction for updating the booking line
    const result = await db.transaction(async (tx) => {
      // Find the existing booking line by its ID
      const existingLine = await tx.query.bookingLine.findFirst({
        where: eq(bookingLine.id, lineId),
      });



      if (!existingLine) {
        throw new Error(`Booking line with ID ${lineId} not found`);
      }

      const existingBooking = await tx.query.booking.findFirst({
        where: eq(booking.id, existingLine.bookingId),
      });

      if (!existingBooking) {
        throw new Error(`Booking with ID ${existingLine.bookingId} not found`);
      }

      const updatedClient = await updateClient(
        tx,
        existingBooking.clientId,
        {
          name: updatedBookingDetails.general.clientName,
          primaryEmail: updatedBookingDetails.general.primaryEmail,
          primaryContactNumber: updatedBookingDetails.general.primaryContactNumber,
          country: updatedBookingDetails.general.country,
        }
      );

      console.log(updatedClient)

      // Update the main booking line details
      const updatedLine = await tx
        .update(bookingLine)
        .set({
          adultsCount: updatedBookingDetails.general.adultsCount,
          kidsCount: updatedBookingDetails.general.kidsCount,
          startDate: new Date(updatedBookingDetails.general.startDate),
          endDate: new Date(updatedBookingDetails.general.endDate),
          includes: {
            hotels: updatedBookingDetails.general.includes.hotels,
            restaurants: updatedBookingDetails.general.includes.restaurants,
            transport: updatedBookingDetails.general.includes.transport,
            activities: updatedBookingDetails.general.includes.activities,
            shops: updatedBookingDetails.general.includes.shops,
          },
        })
        .where(eq(bookingLine.id, lineId))
        .returning();

      console.log(updatedLine)

      if (!updatedLine || !updatedLine[0]?.id || !updatedClient) {
        throw new Error("Couldn't update the booking line");
      }

      // Return the updated booking line ID
      return updatedLine[0]?.id;
    });

    return result;
  } catch (error) {
    console.error("Error in updateBookingLine:", error);
    throw error;
  }
};



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
    // Filter to only include bookings from the last year
    .where(sql`${bookingLine.startDate} >= ${lastYearDate}`)
    .groupBy(sql`DATE_TRUNC('month', ${bookingLine.startDate})`);

  // convert month and year to formatted string
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
  // .orderBy(sql`COUNT(${hotelVoucher.id})`, 'desc'); // Optional: to sort by number of bookings

  return hotelBookingStats.map(row => {
    let formattedDate = null;

    // Check if lastBookingDate is a valid date string or number before converting
    if (row.lastBookingDate && (typeof row.lastBookingDate === 'string' || typeof row.lastBookingDate === 'number')) {
      const date = new Date(row.lastBookingDate);
      if (!isNaN(date.getTime())) {
        formattedDate = date.toLocaleDateString(); // Format date if valid
      }
    }

    return {
      hotelName: row.hotelName,
      bookingCount: Number(row.bookingCount),
      lastBookingDate: formattedDate // If the date is invalid, it will remain null
    };
  });
};




