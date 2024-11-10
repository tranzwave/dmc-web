"use server";

import { and, eq, inArray, ne } from "drizzle-orm";
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
  bookingAgent,
  bookingLine,
  client,
  driverVoucherLine,
  guideVoucherLine,
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
  InsertClient,
  SelectHotelVoucher,
  SelectHotelVoucherLine,
  SelectRestaurantVoucher,
  SelectRestaurantVoucherLine,
} from "../../schemaTypes";

export const getAllBookings = () => {
  return db.query.booking.findMany();
};

//TODO: Add tenant validation
export const getAllBookingLines = async (orgId: string) => {
  return await db.query.bookingLine.findMany({
    where: inArray(
      bookingLine.bookingId, // Assuming bookingLine has a foreign key bookingId
      db
        .select({ id: booking.id })
        .from(booking)
        .where(eq(booking.tenantId, orgId)),
    ),
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
          tenant: true,
          bookingAgent: {
            with: {
              agent: true,
            },
          },
          // bookingAgent:{
          //   with:{
          //     agent:true
          //   }
          // }
        },
      },
      hotelVouchers: {
        with: {
          hotel: true,
          voucherLines: true,
        },
      },
      restaurantVouchers: {
        with: {
          restaurant: true,
          voucherLines: true,
        },
      },
      transportVouchers: {
        with: {
          driver: true,
          guide: true,
          guideVoucherLines: true,
          driverVoucherLines: true,
        },
      },
      activityVouchers: {
        with: {
          activity: true,
          activityVendor: true,
        },
      },
      shopsVouchers: {
        with: {
          shop: true,
        },
      },
    },
  });
};

// export const getBookingLineWithAllData = (id: string) => {
//   return db.query.bookingLine.findFirst({
//     where: eq(bookingLine.id, id),
//     with: {
//       booking: {
//         with: {
//           client: true,
//           tenant: true,
//           bookingAgent: {
//             with: {
//               agent: true,
//             },
//           },
//         },
//       },
//       hotelVouchers: {
//         with: {
//           hotel: true,
//           voucherLines: true,
//         },
//       },
//       restaurantVouchers: {
//         with: {
//           restaurant: true,
//           voucherLines: true,
//         },
//       },
//       transportVouchers: {
//         with: {
//           driver: true,
//           guide: true,
//           guideVoucherLines: true,
//           driverVoucherLines: true, // Add this to include the missing field
//         },
//       },
//       activityVouchers: {
//         with: {
//           activity: true,
//           activityVendor: true,
//         },
//       },
//       shopsVouchers: {
//         with: {
//           shop: true,
//         },
//       },
//     },
//   });
// };

async function generateBookingLineId(
  tenantId: string,
  countryCode: string,
): Promise<string> {
  // Fetch tenant name and country based on tenantId
  const tenantData = await db.query.tenant.findFirst({
    where: eq(tenant.id, tenantId),
  });

  if (!tenantData) {
    throw new Error(`Tenant with ID ${tenantId} not found`);
  }

  // Helper function to generate a 6-digit random number
  const generate6DigitNumber = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

  // Format the ID: <tenantName>-<country>-<6 digits>
  return `${tenantData.name.toUpperCase().slice(0, 3)}-${countryCode}-${generate6DigitNumber()}`;
}

export const generateVoucherLineId = (
  prefix: string,
  bookingLineId: string,
  index: number,
) => {
  const id = `${bookingLineId}-${prefix}/${index}`;

  return id;
};

export const createNewBooking = async (
  orgId: string,
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
      const tenantExist = await tx.query.tenant.findFirst({
        where: eq(tenant.id, orgId),
      });

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
            clientId: bookingClient.id,
            coordinatorId: bookingDetails.general.marketingManager,
            managerId: bookingDetails.general.marketingManager,
            tenantId: tenantId,
            tourType: bookingDetails.general.tourType,
            directCustomer: bookingDetails.general.directCustomer,
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
        ? (parentBooking[0]?.id ?? "")
        : parentBooking.id;

      if (
        bookingDetails.general.agent &&
        !bookingDetails.general.directCustomer
      ) {
        await tx.insert(bookingAgent).values({
          bookingId: parentBookingIdToUse,
          agentId: bookingDetails.general.agent,
        });
      }

      const customId = await generateBookingLineId(
        tenantId,
        bookingDetails.general.country,
      );

      // Create a new booking line within the transaction
      const newBookingLineGeneral: InsertBookingLine = {
        id: customId,
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
          shops: bookingDetails.general.includes.shops,
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
  updateData: Partial<InsertClient>,
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
          updateData.primaryContactNumber ??
          existingClient.primaryContactNumber,
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
      const insertedVouchers = await insertHotelVouchersTx(
        trx,
        vouchers,
        newBookingLineId,
        coordinatorId,
      );

      // If there are additional inserts/updates, you can perform them here using the same trx.

      return insertedVouchers;
    } catch (error) {
      console.error("Error while inserting hotel vouchers:", error);
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
        currentVoucher.voucherLines.map(async (currentVoucherLine, idx) => {
          //generate voucher line id
          const voucherLineId = `${newBookingLineId}-HTL/${idx + 1}`;

          console.log("Voucher Line ID : " + voucherLineId);

          const newVoucherLine = await trx
            .insert(hotelVoucherLine)
            .values({
              id: voucherLineId,
              adultsCount: currentVoucherLine.adultsCount,
              kidsCount: currentVoucherLine.kidsCount,
              roomCount: currentVoucherLine.roomCount,
              checkInDate: currentVoucherLine.checkInDate,
              checkInTime: currentVoucherLine.checkInTime,
              checkOutDate: currentVoucherLine.checkOutDate,
              checkOutTime: currentVoucherLine.checkOutTime,
              basis: currentVoucherLine.basis,
              roomType: currentVoucherLine.roomType,
              roomCategory: currentVoucherLine.roomCategory,
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

export const deleteHotelVoucherLine = async (voucherLineId: string) => {
  try {
    const result = await db.transaction(async (trx) => {
      const voucherLine = await trx
        .select()
        .from(hotelVoucherLine)
        .where(eq(hotelVoucherLine.id, voucherLineId))
        .execute();

      if (!voucherLine || !voucherLine[0]?.hotelVoucherId) {
        throw new Error(`No voucher line found with ID: ${voucherLineId}`);
      }

      const hotelVoucherId = voucherLine[0]?.hotelVoucherId;

      const remainingVoucherLines = await trx
        .select()
        .from(hotelVoucherLine)
        .where(
          and(
            eq(hotelVoucherLine.hotelVoucherId, hotelVoucherId),
            ne(hotelVoucherLine.id, voucherLineId),
          ),
        )
        .execute();

      const deletedVoucherLine = await trx
        .delete(hotelVoucherLine)
        .where(eq(hotelVoucherLine.id, voucherLineId))
        .returning()
        .execute();

      if (!deletedVoucherLine || !deletedVoucherLine[0]?.id) {
        throw new Error(
          `Failed to delete voucher line with ID: ${voucherLineId}`,
        );
      }

      let deletedVoucher = null;
      if (remainingVoucherLines.length === 0) {
        deletedVoucher = await trx
          .delete(hotelVoucher)
          .where(eq(hotelVoucher.id, hotelVoucherId))
          .returning()
          .execute();
      }

      return {
        deletedVoucherLine: deletedVoucherLine[0],
        deletedVoucher: deletedVoucher ? deletedVoucher[0] : null,
      };
    });

    return result;
  } catch (error) {
    throw new Error(`Transaction error`);
  }
};

export const updateSingleHotelVoucherLineTx = async (
  voucherId: string, // ID of the voucher that the line belongs to
  voucherLineId: string, // ID of the voucher line to be updated
  updatedVoucherLineData: Partial<SelectHotelVoucherLine> = {},
) => {
  try {
    // Update the single hotel voucher line
    const updatedVoucherLine = await db
      .update(hotelVoucherLine)
      .set({
        ...updatedVoucherLineData,
      })
      .where(
        and(
          eq(hotelVoucherLine.id, voucherLineId),
          eq(hotelVoucherLine.hotelVoucherId, voucherId),
        ),
      )
      .returning();

    if (!updatedVoucherLine || !updatedVoucherLine[0]?.id) {
      throw new Error(
        `Couldn't update hotel voucher line with ID: ${voucherLineId}`,
      );
    }

    return updatedVoucherLine[0];
  } catch (error) {
    console.error("Error while updating hotel voucher line:", error);
    throw error;
  }
};

export const updateHotelVoucherAndLine = async (
  voucherId: string, // ID of the voucher to be updated
  voucherLineId: string, // ID of the voucher line to be updated
  updatedVoucherData: Partial<SelectHotelVoucher> = {}, // Partial fields to update on the hotel voucher
  updatedVoucherLineData: Partial<SelectHotelVoucherLine> = {}, // Partial fields to update on the voucher line
) => {
  // Start a transaction using Drizzle ORM's `db.transaction`
  return await db.transaction(async (trx) => {
    try {
      // Update the parent hotel voucher if any fields are provided
      if (Object.keys(updatedVoucherData).length > 0) {
        const updatedVoucher = await trx
          .update(hotelVoucher)
          .set(updatedVoucherData)
          .where(eq(hotelVoucher.id, voucherId))
          .returning();

        if (!updatedVoucher || !updatedVoucher[0]?.id) {
          throw new Error(
            `Couldn't update hotel voucher with ID: ${voucherId}`,
          );
        }
      }

      // Update the single hotel voucher line if any fields are provided
      if (Object.keys(updatedVoucherLineData).length > 0) {
        const updatedVoucherLine = await trx
          .update(hotelVoucherLine)
          .set(updatedVoucherLineData)
          .where(
            and(
              eq(hotelVoucherLine.id, voucherLineId),
              eq(hotelVoucherLine.hotelVoucherId, voucherId),
            ),
          )
          .returning();

        if (!updatedVoucherLine || !updatedVoucherLine[0]?.id) {
          throw new Error(
            `Couldn't update hotel voucher line with ID: ${voucherLineId}`,
          );
        }

        return updatedVoucherLine[0]; // Return the updated voucher line
      }

      // If neither voucher nor voucher line was updated, return a message
      return { message: "No updates applied to voucher or voucher line" };
    } catch (error) {
      console.error(
        "Error while updating hotel voucher or voucher line:",
        error,
      );
      throw error; // Rethrow the error to trigger transaction rollback
    }
  });
};

export const updateRestaurantVoucherAndLine = async (
  voucherId: string, // ID of the voucher to be updated
  voucherLineId: string, // ID of the voucher line to be updated
  updatedVoucherData: Partial<SelectRestaurantVoucher> = {}, // Partial fields to update on the hotel voucher
  updatedVoucherLineData: Partial<SelectRestaurantVoucherLine> = {}, // Partial fields to update on the voucher line
) => {
  // Start a transaction using Drizzle ORM's `db.transaction`
  return await db.transaction(async (trx) => {
    try {
      // Update the parent hotel voucher if any fields are provided
      if (Object.keys(updatedVoucherData).length > 0) {
        const updatedVoucher = await trx
          .update(restaurantVoucher)
          .set(updatedVoucherData)
          .where(eq(restaurantVoucher.id, voucherId))
          .returning();

        if (!updatedVoucher || !updatedVoucher[0]?.id) {
          throw new Error(
            `Couldn't update restaurant voucher with ID: ${voucherId}`,
          );
        }
      }

      // Update the single hotel voucher line if any fields are provided
      if (Object.keys(updatedVoucherLineData).length > 0) {
        const updatedVoucherLine = await trx
          .update(restaurantVoucherLine)
          .set(updatedVoucherLineData)
          .where(
            and(
              eq(restaurantVoucherLine.id, voucherLineId),
              eq(restaurantVoucherLine.restaurantVoucherId, voucherId),
            ),
          )
          .returning();

        if (!updatedVoucherLine || !updatedVoucherLine[0]?.id) {
          throw new Error(
            `Couldn't update restaurant voucher line with ID: ${voucherLineId}`,
          );
        }

        return updatedVoucherLine[0]; // Return the updated voucher line
      }

      // If neither voucher nor voucher line was updated, return a message
      return { message: "No updates applied to voucher or voucher line" };
    } catch (error) {
      console.error(
        "Error while updating hotel voucher or voucher line:",
        error,
      );
      throw error; // Rethrow the error to trigger transaction rollback
    }
  });
};

export const addRestaurantVoucherLinesToBooking = async (
  vouchers: RestaurantVoucher[],
  newBookingLineId: string,
  coordinatorId: string,
) => {
  const result = await db.transaction(async (trx) => {
    if (!vouchers) {
      throw new Error("No vouchers were sent");
    }
    try {
      // Wait for all voucher inserts before proceeding
      const insertedVouchers = await insertRestaurantVouchersTx(
        trx,
        vouchers,
        newBookingLineId,
        coordinatorId,
      );

      // Return the result after all inserts are done
      return insertedVouchers;
    } catch (error) {
      console.error("Error during transaction:", error);
      throw error; // Transaction will be rolled back
    }
  });

  return result;
};

export const insertRestaurantVouchersTx = async (
  trx: any, // Replace with actual transaction type
  vouchers: RestaurantVoucher[],
  newBookingLineId: string,
  coordinatorId: string,
) => {
  // console.log("Number of vouchers:", vouchers.length);

  // Use a for loop to ensure sequential processing, avoiding any premature commits or errors
  const restaurantVouchers = [];

  for (let i = 0; i < vouchers.length; i++) {
    const currentVoucher = vouchers[i];
    if (!currentVoucher) {
      throw new Error("Voucher is undefined");
    }
    console.log(`Processing voucher ${i + 1}`);

    // Insert a restaurant voucher
    const newVoucher = await trx
      .insert(restaurantVoucher)
      .values({
        bookingLineId: newBookingLineId,
        coordinatorId: coordinatorId,
        restaurantId: currentVoucher?.restaurant.id,
      })
      .returning();

    if (!newVoucher || !newVoucher[0]?.id) {
      throw new Error("Couldn't add restaurant voucher");
    }

    const voucherId = newVoucher[0]?.id;
    console.log(`Inserted voucher ID: ${voucherId}`);

    // Insert restaurant voucher lines
    const voucherLines = [];

    for (let j = 0; j < currentVoucher.voucherLines.length; j++) {
      const currentVoucherLine = currentVoucher.voucherLines[j];
      if (!currentVoucherLine) {
        throw new Error("Voucher is undefined");
      }
      console.log(`Processing voucher line ${j + 1} for voucher ${voucherId}`);

      //generate voucher line id
      const voucherLineId = `${newBookingLineId}-RES/${j + 1}`;


      const newVoucherLine = await trx
        .insert(restaurantVoucherLine)
        .values({
          id: voucherLineId,
          adultsCount: currentVoucherLine.adultsCount,
          kidsCount: currentVoucherLine.kidsCount,
          mealType: currentVoucherLine.mealType,
          date: currentVoucherLine.date,
          time: currentVoucherLine.time ?? "12:00",
          restaurantVoucherId: voucherId,
          remarks: currentVoucherLine.remarks,
        })
        .returning();

      if (!newVoucherLine || !newVoucherLine[0]?.id) {
        throw new Error("Couldn't add restaurant voucher line");
      }

      voucherLines.push(newVoucherLine[0].id); // Save the new voucher line id
      console.log(`Inserted voucher line ID: ${newVoucherLine[0].id}`);
    }

    restaurantVouchers.push({ voucherId, voucherLines }); // Add voucher and lines to the result array
  }

  return restaurantVouchers; // Return all vouchers and their lines
};

export const deleteRestaurantVoucherLine = async (voucherLineId: string) => {
  try {
    const result = await db.transaction(async (trx) => {
      // Fetch the restaurant voucher line to check if it exists
      const voucherLine = await trx
        .select()
        .from(restaurantVoucherLine)
        .where(eq(restaurantVoucherLine.id, voucherLineId))
        .execute();

      if (!voucherLine || !voucherLine[0]?.restaurantVoucherId) {
        throw new Error(
          `No restaurant voucher line found with ID: ${voucherLineId}`,
        );
      }

      const restaurantVoucherId = voucherLine[0]?.restaurantVoucherId;

      // Check if there are other lines associated with this voucher
      const remainingVoucherLines = await trx
        .select()
        .from(restaurantVoucherLine)
        .where(
          and(
            eq(restaurantVoucherLine.restaurantVoucherId, restaurantVoucherId),
            ne(restaurantVoucherLine.id, voucherLineId),
          ),
        )
        .execute();

      // Delete the specified restaurant voucher line
      const deletedVoucherLine = await trx
        .delete(restaurantVoucherLine)
        .where(eq(restaurantVoucherLine.id, voucherLineId))
        .returning()
        .execute();

      if (!deletedVoucherLine || !deletedVoucherLine[0]?.id) {
        throw new Error(
          `Failed to delete restaurant voucher line with ID: ${voucherLineId}`,
        );
      }

      let deletedVoucher = null;
      // If no more voucher lines remain, delete the associated restaurant voucher
      if (remainingVoucherLines.length === 0) {
        deletedVoucher = await trx
          .delete(restaurantVoucher)
          .where(eq(restaurantVoucher.id, restaurantVoucherId))
          .returning()
          .execute();
      }

      // Return the deleted voucher line and potentially the deleted voucher
      return {
        deletedVoucherLine: deletedVoucherLine[0],
        deletedVoucher: deletedVoucher ? deletedVoucher[0] : null,
      };
    });

    return result;
  } catch (error) {
    throw new Error(`Transaction error`);
  }
};


export const deleteActivityVoucher = async (voucherLineId: string) => {
  try {
    const result = await db.transaction(async (trx) => {
      // Fetch the activity voucher line to check if it exists
      const [voucherLine] = await trx
        .select()
        .from(activityVoucher)  // Assuming activityVoucherLine exists
        .where(eq(activityVoucher.id, voucherLineId))  // Updated for activityVoucherLine.id
        .execute();

      if (!voucherLine || !voucherLine.activityId) {
        throw new Error(`No activity voucher line found with ID: ${voucherLineId}`);
      }

      const { activityId } = voucherLine;  // Ensure voucherLine has activityVoucherId

      // Check if there are other lines associated with this voucher
      const remainingVoucherLines = await trx
        .select()
        .from(activityVoucher)  // Use activityVoucherLine
        .where(
          and(
            eq(activityVoucher.activityId, activityId),  // Check for matching activityVoucherId
            ne(activityVoucher.id, voucherLineId),  // Exclude the current voucher line
          ),
        )
        .execute();

      // Delete the specified activity voucher line
      const [deletedVoucherLine] = await trx
        .delete(activityVoucher)  // Delete from activityVoucherLine
        .where(eq(activityVoucher.id, voucherLineId))  // Where id matches voucherLineId
        .returning()
        .execute();

      if (!deletedVoucherLine?.id) {
        throw new Error(`Failed to delete activity voucher line with ID: ${voucherLineId}`);
      }

      let deletedVoucher = null;
      // If no more voucher lines remain, delete the associated activity voucher
      if (remainingVoucherLines.length === 0) {
        const [deletedVoucherResult] = await trx
          .delete(activityVoucher)  // Delete from activityVoucher
          .where(eq(activityVoucher.id, activityId))  // Where id matches activityVoucherId
          .returning()
          .execute();

        deletedVoucher = deletedVoucherResult ?? null;
      }

      // Return the deleted voucher line and potentially the deleted voucher
      return {
        deletedVoucherLine,
        deletedVoucher,
      };
    });

    return result;
  } catch (error) {
    console.error(`Error deleting voucher line with ID: ${voucherLineId}`, error);
    throw new Error(`Failed to delete activity voucher line or associated voucher`);
  }
};



export const addActivityVouchersToBooking = async (
  vouchers: ActivityVoucher[],
  newBookingLineId: string,
  coordinatorId: string,
) => {
  const result = await db.transaction(async (trx) => {
    try {
      const insertedVouchers = await insertActivityVouchersTx(
        trx,
        vouchers,
        newBookingLineId,
        coordinatorId,
      );
      return insertedVouchers;
    } catch (error) {
      console.error("Error while inserting activity vouchers:", error);
      throw error;
    }
  });

  return result;
};

export const insertActivityVouchersTx = async (
  trx: any,
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

export const addShopVouchersToBooking = async (
  vouchers: ShopVoucher[],
  newBookingLineId: string,
  coordinatorId: string,
) => {
  const result = await db.transaction(async (trx) => {
    try {
      const insertedVouchers = await insertShopVouchersTx(
        trx,
        vouchers,
        newBookingLineId,
        coordinatorId,
      );
      return insertedVouchers;
    } catch (error) {
      console.error("Error while inserting shop vouchers:", error);
      throw error;
    }
  });

  return result;
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

// export const addTransportVouchersToBooking = async (
//   vouchers: TransportVoucher[],
//   newBookingLineId: string,
//   coordinatorId: string,
// ) => {
//   const result = await db.transaction(async (trx) => {
//     try {
//       const insertedVouchers = await insertTransportVoucherTx(trx, vouchers, newBookingLineId, coordinatorId);
//       return insertedVouchers;
//     } catch (error) {
//       console.error('Error while inserting transport vouchers:', error);
//       throw error;
//     }
//   });

//   return result;
// };

// export const insertTransportVoucherTx = async (
//   trx: any,
//   vouchers: TransportVoucher[],
//   newBookingLineId: string,
//   coordinatorId: string,
// ) => {
//   const transportVouchers = await Promise.all(
//     vouchers.map(async (currentVoucher) => {
//       const newVoucher = await trx
//         .insert(transportVoucher)
//         .values({
//           ...currentVoucher.voucher,
//           coordinatorId: coordinatorId,
//           bookingLineId: newBookingLineId,
//         })
//         .returning();

//       if (!newVoucher || !newVoucher[0]?.id) {
//         throw new Error("Couldn't add transport voucher");
//       }

//       const voucherId = newVoucher[0]?.id;

//       return voucherId;
//     }),
//   );
//   return transportVouchers;
// };

export const addTransportVouchersToBooking = async (
  vouchers: TransportVoucher[], // TransportVoucher should have a field to indicate type (e.g., 'guide' or 'driver')
  newBookingLineId: string,
  coordinatorId: string,
) => {
  const result = await db.transaction(async (trx) => {
    try {
      const insertedVouchers = await insertTransportVoucherTx(
        trx,
        vouchers,
        newBookingLineId,
        coordinatorId,
      );
      return insertedVouchers;
    } catch (error) {
      console.error("Error while inserting transport vouchers:", error);
      throw error;
    }
  });

  return result;
};

export const insertTransportVoucherTx = async (
  trx: any,
  vouchers: TransportVoucher[],
  newBookingLineId: string,
  coordinatorId: string,
) => {
  const transportVouchers = await Promise.all(
    vouchers.map(async (currentVoucher) => {
      // Insert into the transport_voucher table
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

      if (currentVoucher.driver?.type !== 'guide') {
        await trx
          .insert(driverVoucherLine)
          .values({
            transportVoucherId: voucherId,
            vehicleType: currentVoucher.driverVoucherLine?.vehicleType,
          })
          .returning();
      } else {
        // Insert into guide_voucher_lines table
        await trx
          .insert(guideVoucherLine)
          .values({
            transportVoucherId: voucherId,
          })
          .returning();
      }

      return voucherId;
    }),
  );
  return transportVouchers;
};

export const updateBookingLine = async (
  bookingLineId: string,
  updatedGeneralData: {
    startDate: string;
    endDate: string;
    adultsCount: number;
    kidsCount: number;
    includes: {
      hotels: boolean;
      restaurants: boolean;
      transport: boolean;
      activities: boolean;
      shops: boolean;
    };
  },
) => {
  try {
    // Start a transaction to update the booking line
    const result = await db.transaction(async (tx) => {
      // Find the existing booking line by ID
      const existingBookingLine = await tx.query.bookingLine.findFirst({
        where: eq(bookingLine.id, bookingLineId),
      });

      if (!existingBookingLine) {
        throw new Error(
          `Couldn't find a booking line with ID: ${bookingLineId}`,
        );
      }

      // Update the booking line with the provided general data
      const updatedBookingLine = await tx
        .update(bookingLine)
        .set({
          startDate: new Date(updatedGeneralData.startDate),
          endDate: new Date(updatedGeneralData.endDate),
          adultsCount: updatedGeneralData.adultsCount,
          kidsCount: updatedGeneralData.kidsCount,
          includes: updatedGeneralData.includes,
        })
        .where(eq(bookingLine.id, bookingLineId))
        .returning();

      if (
        !updatedBookingLine ||
        !Array.isArray(updatedBookingLine) ||
        !updatedBookingLine[0]?.id
      ) {
        throw new Error(
          `Couldn't update the booking line with ID: ${bookingLineId}`,
        );
      }

      return updatedBookingLine[0]?.id;
    });

    return result;
  } catch (error) {
    console.error("Error in updateBookingLine:", error);
    throw error;
  }
};
