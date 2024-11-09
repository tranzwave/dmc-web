"use server";

import {
  city,
  hotel,
  hotelRoom,
  hotelStaff,
  tenant,
  country,
  hotelVoucher,
  hotelVoucherLine,
} from "~/server/db/schema";
import { and, eq, inArray, SQL, sql } from "drizzle-orm";
import {
  InsertHotel,
  InsertHotelRoom,
  InsertHotelStaff,
  SelectHotel,
  SelectHotelRoom,
  SelectHotelStaff,
} from "../../schemaTypes";
import { db } from "../..";

export type CompleteHotel = {
  hotel: InsertHotel & { city?: string };
  hotelRooms: InsertHotelRoom[];
  hotelStaffs: InsertHotelStaff[];
};

export const getAllHotels = () => {
  return db.query.hotel.findMany({
    columns: {
      cityId: false,
    },
    with: {
      city: {
        columns: {
          id: false,
        },
      },
    },
  });
};

export const getAllHotelsV2 = () => {
  return db.query.hotel.findMany();
};

export const getHotelByIdQuery = (id: string) => {
  return db.query.hotel.findFirst({
    where: eq(hotel.id, id),
    columns: {
      cityId: false,
    },
    with: {
      city: {
        columns: {
          id: false,
        },
      },
    },
  });
};

export const getRawHotelById = (id: string) => {
  return db.query.hotel.findFirst({
    where: eq(hotel.id, id),
    with: {
      hotelStaff: true,
      hotelRoom: true,
    },
  });
};

export const getHotelRooms = (hotelId: string) => {
  return db.query.hotelRoom.findMany({
    where: eq(hotelRoom.hotelId, hotelId),
  });
};

export const getHotelStaffs = (hotelId: string) => {
  return db.query.hotelStaff.findMany({
    where: eq(hotelRoom.hotelId, hotelId),
  });
};

export const getHotelVouchersForHotel = (hotelId: string) => {
  return db.query.hotelVoucher.findMany({
    where: eq(hotelVoucher.hotelId, hotelId),
  });
};

// export const getHotelVoucherLinesForVoucherAndHotel = (voucherId:string, hotelId:string) => {
//     return db.query.hotelVoucherLine.findMany({
//         where: eq(hotelVoucherLine.hotelVoucherId, voucherId),
//         with: {
//             hotelVoucher:{
//                 where: eq(hotelVoucher.id, voucherId),
//                 with: {
//                     hotel:{
//                         where: eq(hotel.id,hotelId)
//                     }
//                 }
//             }
//         }
//     })
// }

export const getVoucherLinesByHotelId = async (hotelId: string) => {
  const voucherLines = await db
    .select({
      id: hotelVoucherLine.id,
      hotelVoucherId: hotelVoucherLine.hotelVoucherId,
      rate: hotelVoucherLine.rate,
      roomType: hotelVoucherLine.roomType,
      basis: hotelVoucherLine.basis,
      checkInDate: hotelVoucherLine.checkInDate,
      checkInTime: hotelVoucherLine.checkInTime,
      checkOutDate: hotelVoucherLine.checkOutDate,
      checkOutTime: hotelVoucherLine.checkOutTime,
      adultsCount: hotelVoucherLine.adultsCount,
      kidsCount: hotelVoucherLine.kidsCount,
      roomCount: hotelVoucherLine.roomCount,
      remarks: hotelVoucherLine.remarks,
      createdAt: hotelVoucherLine.createdAt,
      updatedAt: hotelVoucherLine.updatedAt,
    })
    .from(hotelVoucherLine)
    .leftJoin(
      hotelVoucher,
      eq(hotelVoucherLine.hotelVoucherId, hotelVoucher.id),
    )
    .where(eq(hotelVoucher.hotelId, hotelId));

  return voucherLines.map((row) => ({
    id: row.id,
    hotelVoucherId: row.hotelVoucherId,
    rate: row.rate,
    roomType: row.roomType,
    basis: row.basis,
    checkInDate: row.checkInDate,
    checkInTime: row.checkInTime,
    checkOutDate: row.checkOutDate,
    checkOutTime: row.checkOutTime,
    adultsCount: row.adultsCount,
    kidsCount: row.kidsCount,
    roomCount: row.roomCount,
    remarks: row.remarks,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }));
};

export async function insertHotel(hotels: CompleteHotel[]) {
  //Fetch a tenant
  const foundTenant = await db.query.tenant.findFirst();

  if (!foundTenant) {
    throw new Error("Couldn't find any tenant");
  }

  // Fetch or create city
  const cities = await Promise.all(
    hotels.map(async (currentHotel) => {
      const foundCity = await db.query.city.findFirst({
        where: eq(city.id, currentHotel.hotel.cityId),
      });

      if (!foundCity) {
        // Create a new city if it does not exist
        if (!currentHotel.hotel.city) {
          throw new Error("Couldn't add city");
        }
        const newCity = await db
          .insert(city)
          .values({
            name: currentHotel.hotel?.city ?? "",
            country: foundTenant.country,
          })
          .returning({
            id: city.id,
            name: city.name,
          });

        return newCity[0];
      }

      return foundCity;
    }),
  );

  // Flatten cities array
  const citiesList = [...new Set(cities)]; // Remove duplicates

  console.log(citiesList);

  const newHotels = await Promise.all(
    hotels.map(async (currentHotel) => {
      const cityObject = citiesList.find(
        (city) => city?.id === currentHotel.hotel.cityId,
      );

      if (!cityObject) {
        throw new Error("City not found for hotel: " + currentHotel.hotel.city);
      }

      // Check if hotel already exists
      const foundHotel = await db.query.hotel.findFirst({
        where: and(
          eq(hotel.tenantId, tenant.id),
          eq(hotel.cityId, cityObject.id),
          eq(hotel.name, currentHotel.hotel.name),
        ),
      });

      if (!foundHotel) {
        // Create a new hotel if it does not exist
        const newHotelId = await db
          .insert(hotel)
          .values({
            ...currentHotel.hotel,
            tenantId: foundTenant.id,
            cityId: cityObject.id,
          })
          .returning({
            id: hotel.id,
          });

        if (!newHotelId[0]) {
          throw new Error(`Couldn't add hotel: ${currentHotel.hotel.name}`);
        }

        //Add hotel rooms
        await db.insert(hotelRoom).values(
          currentHotel.hotelRooms.map((room) => ({
            ...room,
            hotelId: newHotelId[0]?.id ?? room.hotelId,
          })),
        );

        //Add hotel staff
        await db.insert(hotelStaff).values(
          currentHotel.hotelStaffs.map((staff) => ({
            ...staff,
            hotelId: newHotelId[0]?.id ?? staff.hotelId,
          })),
        );

        return newHotelId;
      }
    }),
  );
  return newHotels;
}

export async function insertOrUpdateHotel(hotels: CompleteHotel[]) {
  // Fetch a tenant
  const foundTenant = await db.query.tenant.findFirst();

  if (!foundTenant) {
    throw new Error("Couldn't find any tenant");
  }

  // Fetch or create city
  const cities = await Promise.all(
    hotels.map(async (currentHotel) => {
      const foundCity = await db.query.city.findFirst({
        where: eq(city.id, currentHotel.hotel.cityId),
      });

      if (!foundCity) {
        // Create a new city if it does not exist
        if (!currentHotel.hotel.city) {
          throw new Error("Couldn't add city");
        }
        const newCity = await db
          .insert(city)
          .values({
            name: currentHotel.hotel.city ?? "",
            country: foundTenant.country,
          })
          .returning({
            id: city.id,
            name: city.name,
          });

        return newCity[0];
      }

      return foundCity;
    }),
  );

  // Flatten cities array
  const citiesList = [...new Set(cities)]; // Remove duplicates

  console.log(citiesList);

  const updatedHotels = await Promise.all(
    hotels.map(async (currentHotel) => {
      const cityObject = citiesList.find(
        (city) => city?.id === currentHotel.hotel.cityId,
      );

      if (!cityObject) {
        throw new Error("City not found for hotel: " + currentHotel.hotel.city);
      }

      // Define the CTE for foundHotel
      const foundHotelCTE = db.$with("foundHotel").as(
        db
          .select({
            id: hotel.id,
          })
          .from(hotel)
          .where(
            and(
              eq(hotel.tenantId, foundTenant.id),
              eq(hotel.cityId, cityObject.id),
              eq(hotel.name, currentHotel.hotel.name),
            ),
          ),
      );

      // Use CTE to update or insert hotel
      const result = await db
        .with(foundHotelCTE)
        .update(hotel)
        .set({
          ...currentHotel.hotel,
          tenantId: foundTenant.id,
          cityId: cityObject.id,
        })
        .where(eq(hotel.id, sql`(select id from ${foundHotelCTE})`))
        .returning({
          id: hotel.id,
        });

      let hotelId: string;

      if (result.length === 0) {
        // If no rows were updated, insert the hotel
        const newHotelId = await db
          .insert(hotel)
          .values({
            ...currentHotel.hotel,
            tenantId: foundTenant.id,
            cityId: cityObject.id,
          })
          .returning({
            id: hotel.id,
          });

        if (!newHotelId[0]) {
          throw new Error(`Couldn't add hotel: ${currentHotel.hotel.name}`);
        }

        hotelId = newHotelId[0]?.id;

        // Add hotel rooms
        await Promise.all(
          currentHotel.hotelRooms.map(async (room) => {
            await db.insert(hotelRoom).values({
              ...room,
              hotelId: hotelId,
            });
          }),
        );

        // Add hotel staff
        await Promise.all(
          currentHotel.hotelStaffs.map(async (staff) => {
            await db.insert(hotelStaff).values({
              ...staff,
              hotelId: hotelId,
            });
          }),
        );
      } else {
        hotelId = result[0]?.id ?? "";

        // Update or insert hotel rooms and staff if the hotel was updated
        await Promise.all(
          currentHotel.hotelRooms.map(async (room) => {
            const existingRoom = await db.query.hotelRoom.findFirst({
              where: and(
                eq(hotelRoom.hotelId, hotelId),
                eq(hotelRoom.id, room.id ?? ""),
              ),
            });

            if (existingRoom) {
              // Update existing room
              await db
                .update(hotelRoom)
                .set(room)
                .where(eq(hotelRoom.id, existingRoom.id));
            } else {
              // Insert new room
              await db.insert(hotelRoom).values({
                ...room,
                hotelId: hotelId,
              });
            }
          }),
        );

        await Promise.all(
          currentHotel.hotelStaffs.map(async (staff) => {
            const existingStaff = await db.query.hotelStaff.findFirst({
              where: and(
                eq(hotelStaff.hotelId, hotelId),
                eq(hotelStaff.id, staff.id ?? ""),
              ),
            });

            if (existingStaff) {
              // Update existing staff
              await db
                .update(hotelStaff)
                .set(staff)
                .where(eq(hotelStaff.id, existingStaff.id));
            } else {
              // Insert new staff
              await db.insert(hotelStaff).values({
                ...staff,
                hotelId: hotelId,
              });
            }
          }),
        );
      }

      return hotelId;
    }),
  );

  return updatedHotels;
}

export async function updateHotelAndRelatedData(
  hotelId: string,
  updatedHotel: InsertHotel,
  updatedRooms: InsertHotelRoom[],
  updatedStaff: InsertHotelStaff[]
) {
  console.log(hotelId);
  console.log(updatedHotel);

  // Begin a transaction
  const updated = await db.transaction(async (trx) => {
    // Update the hotel
    const updatedHotelResult = await trx
      .update(hotel)
      .set({
        name: updatedHotel.name,
        stars: updatedHotel.stars,
      })
      .where(eq(hotel.id, hotelId))
      .returning({ updatedId: hotel.id });

    if (updatedHotelResult.length === 0) {
      throw new Error(`Hotel with id ${hotelId} not found.`);
    }

    // Call the separate functions to update rooms and staff
    const updatedRoomsData = await updateHotelRooms(trx, hotelId, updatedRooms);
    const updatedStaffData = await updateHotelStaff(trx, hotelId, updatedStaff);

    return { updatedHotelResult, updatedRoomsData, updatedStaffData };
  });

  console.log(updated);
  return updated;
}




// Function to update hotel rooms
async function updateHotelRooms(trx: any, hotelId: string, updatedRooms: InsertHotelRoom[]) {
  if (updatedRooms.length > 0) {
    const roomSqlChunks: SQL[] = [];
    const roomIds: string[] = [];

    roomSqlChunks.push(sql`(case`);

    for (const room of updatedRooms) {
      roomSqlChunks.push(
        sql`when ${hotelRoom.id} = ${room.id} then ${room}` // Replace 'name' with the actual fields being updated
      );
      roomIds.push(room.id ?? ""); // Collect room IDs
    }

    roomSqlChunks.push(sql`end)`);
    const finalRoomSql: SQL = sql.join(roomSqlChunks, sql.raw(' '));

    await trx
      .update(hotelRoom)
      .set({ name: finalRoomSql }) // Update other fields similarly
      .where(inArray(hotelRoom.id, roomIds));

    return roomIds;
  }

  return [];
}

// Function to update hotel staff
async function updateHotelStaff(trx: any, hotelId: string, updatedStaff: InsertHotelStaff[]) {
  if (updatedStaff.length > 0) {
    const staffSqlChunks: SQL[] = [];
    const staffIds: string[] = [];

    staffSqlChunks.push(sql`(case`);

    for (const staff of updatedStaff) {
      staffSqlChunks.push(
        sql`when ${hotelStaff.id} = ${staff.id} then ${staff.name}` // Replace 'name' with the actual fields being updated
      );
      staffIds.push(staff.id ?? ""); // Collect staff IDs
    }

    staffSqlChunks.push(sql`end)`);
    const finalStaffSql: SQL = sql.join(staffSqlChunks, sql.raw(' '));

    await trx
      .update(hotelStaff)
      .set({ name: finalStaffSql }) // Update other fields similarly
      .where(inArray(hotelStaff.id, staffIds));

    return staffIds;
  }

  return [];
}



export async function deleteHotelCascade(hotelId: string) {
  try {
    // Start the transaction
    const deletedHotelId = await db.transaction(async (trx) => {
      // Delete related hotel staff
      await trx
        .delete(hotelStaff)
        .where(eq(hotelStaff.hotelId, hotelId));

      // Delete related hotel rooms
      await trx
        .delete(hotelRoom)
        .where(eq(hotelRoom.hotelId, hotelId));

      // Delete related hotel vouchers
      await trx
        .delete(hotelVoucher)
        .where(eq(hotelVoucher.hotelId, hotelId));

      // Finally, delete the hotel
      const deletedHotel = await trx
        .delete(hotel)
        .where(eq(hotel.id, hotelId)).returning({id:hotel.id});
      return deletedHotel;
    });

    
    console.log("Hotel and related data deleted successfully");
    return deletedHotelId;
  } catch (error) {
    console.error("Error deleting hotel and related data:", error);
    throw error; // Re-throw the error to handle it elsewhere if needed
  }
}

