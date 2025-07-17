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
import { and, eq, inArray, or, SQL, sql } from "drizzle-orm";
import {
  InsertHotel,
  InsertHotelRoom,
  InsertHotelStaff,
  SelectCity,
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

export const getAllHotels = (tenantId:string) => {
  return db.query.hotel.findMany({
    where: eq(hotel.tenantId, tenantId),
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

export const getAllHotelsV2 = (tenantId:string) => {
  return db.query.hotel.findMany({
    where:eq(hotel.tenantId, tenantId),
    with: {
      hotelRoom: true,
    }
  });
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
      roomCategory:hotelVoucherLine.roomCategory,
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
      hotelVoucher: {
        id: hotelVoucher.id,
        hotelId: hotelVoucher.hotelId,
        bookingLineId: hotelVoucher.bookingLineId,
        status: hotelVoucher.status,
        createdAt: hotelVoucher.createdAt,
        updatedAt: hotelVoucher.updatedAt,
      }
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
    roomCategory: row.roomCategory,
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
    hotelVoucher: row.hotelVoucher
  }));
};

export async function insertHotel(hotels: CompleteHotel[]) {
  const cities = await Promise.all(
    hotels.map(async (currentHotel) => {
      const foundCity = await db.query.city.findFirst({
        where: or(
          eq(city.id, currentHotel.hotel.cityId),
          eq(city.name, currentHotel.hotel.city ?? "")
        ),
      });

      const foundTenant = await db.query.tenant.findFirst({
        where: eq(tenant.id, currentHotel.hotel.tenantId),
      });

      if (!foundTenant) {
        throw new Error("Couldn't find any tenant");
      }

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
        (city) => city?.id === currentHotel.hotel.cityId || city?.name === currentHotel.hotel.city,
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
            tenantId: currentHotel.hotel.tenantId,
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
      const foundCity: SelectCity[] = await db.select().from(city).where(
        or(
        eq(city.id, currentHotel.hotel.cityId),
        eq(city.name, currentHotel.hotel.city ?? "")
        )
      )

      console.log(foundCity);

      if (!foundCity) {
        // Create a new city if it does not exist
        if (!currentHotel.hotel.city) {
          throw new Error("Couldn't add city");
        }
        const newCity = await db
          .insert(city)
          .values({
            name: currentHotel.hotel.city,
            country: foundTenant.country,
          })
          .returning({
            id: city.id,
            name: city.name,
          });

        return newCity[0];
      }

      return foundCity[0];
    }),
  );

  // Flatten cities array
  const citiesList = [...new Set(cities)]; // Remove duplicates

  console.log(citiesList);

  const updatedHotels = await Promise.all(
    hotels.map(async (currentHotel) => {
      const cityObject = citiesList.find(
        (currentCity) => currentCity?.id === currentHotel.hotel.cityId,
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
  updatedHotel: InsertHotel & { city?: string },
  updatedRooms: InsertHotelRoom[],
  updatedStaff: InsertHotelStaff[]
) {
  console.log(hotelId);
  console.log(updatedHotel);

  // Begin a transaction
  const updated = await db.transaction(async (trx) => {

    //Insert new city if cityId is 0
    let newCity : {id:number, name:string}[] = [{id:-1, name:""}];
    if(updatedHotel.cityId === 0){
      // Create a new city if it does not exist
      const foundTenant = await trx
        .query.tenant.findFirst({
          where: eq(tenant.id, updatedHotel.tenantId),
        });

      if (!foundTenant) {
        throw new Error("Couldn't find any tenant");
      }

      if (!updatedHotel.city) {
        throw new Error("Couldn't add city");
      }
      newCity = await trx
        .insert(city)
        .values({
          country: foundTenant.country,
          name: updatedHotel.city,
        })
        .returning({
          id: city.id,
          name: city.name,
        });

      if(newCity.length === 0 || newCity[0]?.id === -1){
        throw new Error("Couldn't add city");
      }
    }
    // Update the hotel
    const updatedHotelResult = await trx
      .update(hotel)
      .set({
        name: updatedHotel.name,
        stars: updatedHotel.stars,
        primaryEmail: updatedHotel.primaryEmail,
        primaryContactNumber: updatedHotel.primaryContactNumber,
        streetName: updatedHotel.streetName,
        cityId: updatedHotel.cityId === 0 ? newCity[0]?.id : updatedHotel.cityId,
        province: updatedHotel.province
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
// async function updateHotelRooms(trx: any, hotelId: string, updatedRooms: InsertHotelRoom[]) {
//   if (updatedRooms.length > 0) {
//     const roomSqlChunks: SQL[] = [];
//     const roomIds: string[] = [];

//     roomSqlChunks.push(sql`(case`);

//     for (const room of updatedRooms) {
//       roomSqlChunks.push(
//         sql`when ${hotelRoom.id} = ${room.id} then ${room}` // Replace 'name' with the actual fields being updated
//       );
//       roomIds.push(room.id ?? ""); // Collect room IDs
//     }

//     roomSqlChunks.push(sql`end)`);
//     const finalRoomSql: SQL = sql.join(roomSqlChunks, sql.raw(' '));

//     await trx
//       .update(hotelRoom)
//       .set({ name: finalRoomSql }) // Update other fields similarly
//       .where(inArray(hotelRoom.id, roomIds));

//     return roomIds;
//   }

//   return [];
// }

async function updateHotelRooms(trx: any, hotelId: string, updatedRooms: InsertHotelRoom[]) {
  if (updatedRooms.length === 0) return [];

  const roomIds: string[] = [];
  const newRooms: InsertHotelRoom[] = [];

  for (const room of updatedRooms) {
    if (room.id) {
      // If room has an ID, update it
      await trx.update(hotelRoom)
        .set({ ...room })
        .where(eq(hotelRoom.id, room.id));
      roomIds.push(room.id);
    } else {
      // If room has no ID, it's a new room to insert
      newRooms.push({ ...room, hotelId });
    }
  }

  // Insert new rooms
  if (newRooms.length > 0) {
    const insertedRooms = await trx.insert(hotelRoom).values(newRooms).returning({ id: hotelRoom.id });
    roomIds.push(...insertedRooms.map((r: any) => r.id));
  }

  return roomIds;
}

export async function deleteHotelRoom(roomId: string) {
  try {
    const deletedRoomId = await db.transaction(async (trx) => {
      const deletedRoom = await trx
        .delete(hotelRoom)
        .where(eq(hotelRoom.id, roomId)).returning({id:hotelRoom.id});
      return deletedRoom;
    });

    console.log("Room deleted successfully");
    return deletedRoomId;
  } catch (error) {
    console.error("Error deleting room:", error);
    throw error; // Re-throw the error to handle it elsewhere if needed
  }
}


// Function to update hotel staff
async function updateHotelStaff(trx: any, hotelId: string, updatedStaff: InsertHotelStaff[]) {
  if (updatedStaff.length === 0) return [];

  const staffIds: string[] = [];
  const newStaff: InsertHotelStaff[] = [];

  for (const staff of updatedStaff) {
    if (staff.id) {
      // If staff has an ID, update it
      await trx.update(hotelStaff)
        .set({ ...staff })
        .where(eq(hotelStaff.id, staff.id));
      staffIds.push(staff.id);
    } else {
      // If staff has no ID, it's a new staff to insert
      newStaff.push({ ...staff, hotelId });
    }
  }

  // Insert new staff
  if (newStaff.length > 0) {
    const insertedStaff = await trx.insert(hotelStaff).values(newStaff).returning({ id: hotelStaff.id });
    staffIds.push(...insertedStaff.map((s: any) => s.id));
  }

  return staffIds;
}

export async function deleteHotelStaff(staffId: string) {
  try {
    const deletedStaffId = await db.transaction(async (trx) => {
      const deletedStaff = await trx
        .delete(hotelStaff)
        .where(eq(hotelStaff.id, staffId)).returning({id:hotelStaff.id});
      return deletedStaff;
    });

    console.log("Staff deleted successfully");
    return deletedStaffId;
  } catch (error) {
    console.error("Error deleting staff:", error);
    throw error; // Re-throw the error to handle it elsewhere if needed
  }
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

