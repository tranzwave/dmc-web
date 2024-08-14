// src/pages/api/hotels.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { shopsMockData } from '~/lib/mockData';
import { db } from '~/server/db'; // Import your database connection
import { hotelRooms, hotels, hotelStaff } from '~/server/db/schema';


export async function POST(req: NextApiRequest, res: NextApiResponse) {
  console.log("Here in the hotels route")
  if (req.method === 'POST') {
    try {
      const { hotelName, stars, primaryEmail, primaryContactNumber, streetName, city, province, hasRestaurant, restaurants } = req.body;

      const newHotelIdArray = await db.insert(hotels).values({
        hotelName: "Grand Plaza",
        stars: 5,
        primaryEmail: "info@grandplaza.com",
        primaryContactNumber: "+1234567890",
        streetName: "123 Main St",
        city: "Metropolis",
        province: "Central Province",
        hasRestaurant: true,
        restaurants: [
          {
            restaurantName: "Sunset Grill",
            mealType: "Breakfast",
            startTime: "07:00",
            endTime: "10:00",
          },
          {
            restaurantName: "Ocean Breeze",
            mealType: "Dinner",
            startTime: "18:00",
            endTime: "22:00",
          },
        ],
      }).returning({ id: hotels.id });

      const newHotelId = newHotelIdArray?.[0]?.id;

      if(!newHotelId){
        throw Error('Failed to add hotel')
      }

        // Step 2: Insert into the hotelRooms table
        await db.insert(hotelRooms).values([
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

      // res.status(200).json({ hotel: newHotelId });

      return new Response(`New hotel added with ID:${newHotelId}`,{
        status:200
      })
      console.log(res)
    } catch (error) {
      res.status(500).json({ error: 'Failed to add hotel' });
    }
  } else {
     res.status(405).json({ message: 'Method not allowed' });
  }
}
