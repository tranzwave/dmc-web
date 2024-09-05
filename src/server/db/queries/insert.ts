import { db } from "..";
import { hotelRoom, hotel, hotelStaff } from "../schema";

export async function createHotel(){
      // Step 1: Insert into the hotels table
  const newHotelIdArray = await db.insert(hotel).values([]).returning({ id: hotel.id });

  const newHotelId = newHotelIdArray?.[0]?.id;

  if(!newHotelId){
    throw new Error("Failed to insert new hotel")
  }
    // Step 2: Insert into the hotelRooms table
    await db.insert(hotelRoom).values([
        {
          hotelId: newHotelId,
          roomType: "Suite",
          typeName: "King Suite",
          count: 10,
          amenities: "Wi-Fi, TV, Minibar",
          floor: 5,
          bedCount: 1,
          additionalComments: "Sea view",
        },
        {
          hotelId: newHotelId,
          roomType: "Deluxe",
          typeName: "Double Deluxe",
          count: 20,
          amenities: "Wi-Fi, TV, Minibar, Balcony",
          floor: 3,
          bedCount: 2,
          additionalComments: "Pool view",
        },
      ]);


      // Step 3: Insert into the hotelStaff table
  await db.insert(hotelStaff).values([
    {
      hotelId: newHotelId,
      name: "John Doe",
      email: "john.doe@grandplaza.com",
      contactNumber: "+1234567891",
      occupation: "Manager",
    },
    {
      hotelId: newHotelId,
      name: "Jane Smith",
      email: "jane.smith@grandplaza.com",
      contactNumber: "+1234567892",
      occupation: "Receptionist",
    },
  ]);

  console.log("New hotel added with ID:", newHotelId);

}