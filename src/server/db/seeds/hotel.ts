import { and, eq } from "drizzle-orm";
import { DB } from "..";
import hotels from './data/hotels.json'
import { city,hotel,tenant, hotelRoom, hotelStaff } from "../schema";

export default async function seed(db:DB) {
    //Fetch a tenant
    const foundTenant = await db.query.tenant.findFirst();

    if(!foundTenant){
        throw new Error("Couldn't find any tenant")
    }

    //Fetch or create city
    // Fetch or create city
    const cities = await Promise.all(
      hotels.map(async (currentHotel) => {
        const foundCity = await db.query.city.findFirst({
          where: eq(city.name, currentHotel.hotel.city),
        });
  
        if (!foundCity) {
          // Create a new country if it does not exist
          const newCity = await db.insert(city).values(
            {
                "name": currentHotel.hotel.city,
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

    await Promise.all(
      hotels.map(async (currentHotel) => {
        const cityObject = citiesList.find(city => city?.name === currentHotel.hotel.city);
  
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
        }
      })
    );
  }
  