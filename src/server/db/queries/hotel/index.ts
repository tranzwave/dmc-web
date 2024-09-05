"use server"

import { city, hotel, hotelRoom, hotelStaff, tenant, country, hotelVoucher, hotelVoucherLine } from '~/server/db/schema';
import { and, eq } from "drizzle-orm";
import { InsertHotel, InsertHotelRoom, InsertHotelStaff } from "../../schemaTypes";
import { db } from "../..";

export type CompleteHotel = {
    hotel: InsertHotel & {city?:string},
    hotelRooms:InsertHotelRoom[],
    hotelStaffs:InsertHotelStaff[]
}

export const getAllHotels = ()=>{
    return db.query.hotel.findMany({
        columns:{
            cityId: false
        },
        with: {
            city: {
                columns:{
                    id:false
                }
            }
        }
    })
}

export const getAllHotelsV2 = ()=>{
  return db.query.hotel.findMany()
}

export const getHotelByIdQuery = (id:string)=>{
    return db.query.hotel.findFirst({
        where: eq(hotel.id, id),
        columns:{
            cityId: false
        },
        with: {
            city: {
                columns:{
                    id:false
                }
            }
        }
    })
}

export const getHotelRooms = (hotelId:string) => {
    return db.query.hotelRoom.findMany({
        where: eq(hotelRoom.hotelId,hotelId)
    })
}

export const getHotelStaffs = (hotelId:string) => {
    return db.query.hotelStaff.findMany({
        where: eq(hotelRoom.hotelId,hotelId)
    })
}

export const getHotelVouchersForHotel = (hotelId:string) => {
    return db.query.hotelVoucher.findMany({
        where: eq(hotelVoucher.hotelId,hotelId),
    })
}

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
          voucherLineId: hotelVoucherLine.id,
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
      .leftJoin(hotelVoucher, eq(hotelVoucherLine.hotelVoucherId, hotelVoucher.id))
      .where(eq(hotelVoucher.hotelId, hotelId));

  return voucherLines.map(row => ({
      voucherLineId: row.voucherLineId,
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


export async function insertHotel(hotels:CompleteHotel[]) {
    //Fetch a tenant
    const foundTenant = await db.query.tenant.findFirst();

    if(!foundTenant){
        throw new Error("Couldn't find any tenant")
    }

    // Fetch or create city
    const cities = await Promise.all(
      hotels.map(async (currentHotel) => {
        const foundCity = await db.query.city.findFirst({
          where: eq(city.id, currentHotel.hotel.cityId),
        });
  
        if (!foundCity) {
          // Create a new city if it does not exist
          if(!currentHotel.hotel.city){
            throw new Error("Couldn't add city")
          }
          const newCity = await db.insert(city).values(
            {
                "name": currentHotel.hotel?.city ?? "",
                "country": foundTenant.country
            },
          ).returning({
            id: city.id,
            name: city.name
          });
  
          return newCity[0];
        }
  
        return foundCity;
      })
    );
  
    // Flatten cities array
    const citiesList = [...new Set(cities)]; // Remove duplicates

    console.log(citiesList)

    const newHotels = await Promise.all(
      hotels.map(async (currentHotel) => {
        const cityObject = citiesList.find(city => city?.id === currentHotel.hotel.cityId);
  
        if (!cityObject) {
          throw new Error("City not found for hotel: " + currentHotel.hotel.city);
        }
  
        // Check if hotel already exists
        const foundHotel = await db.query.hotel.findFirst({
          where: and(eq(hotel.tenantId, tenant.id),eq(hotel.cityId,cityObject.id),eq(hotel.name,currentHotel.hotel.name)),
        });
  
        if (!foundHotel) {
          // Create a new hotel if it does not exist
          const newHotelId = await db.insert(hotel).values({
            ...currentHotel.hotel,
            "tenantId" : foundTenant.id,
            "cityId" : cityObject.id
          }).returning({
            id: hotel.id
          });

          if(!newHotelId[0]){
            throw new Error(`Couldn't add hotel: ${currentHotel.hotel.name}`)
          }

          //Add hotel rooms
          await db.insert(hotelRoom).values(
            currentHotel.hotelRooms.map((room) => ({
              ...room,
              hotelId: newHotelId[0]?.id ?? room.hotelId
            }))
          );

          //Add hotel staff
          await db.insert(hotelStaff).values(
            currentHotel.hotelStaffs.map((staff) => ({
                ...staff,
                hotelId: newHotelId[0]?.id ?? staff.hotelId
              }))
            
          )

          return newHotelId
        }
      })
    );
    return newHotels;
  }
  