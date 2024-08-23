import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { hotelRooms, hotels, hotelStaff } from '~/server/db/schema';

export async function POST(req: Request, res: NextApiResponse) {
  if (req.method === 'POST') {
    const requestBody = await req.json();
    try {
      const {
        hotelGeneral,
        hotelStaff: staffMembers,
        hotelRooms: rooms,
      } = requestBody;

      console.log(req.body)

      // Insert into the hotels table
      const [newHotel] = await db.insert(hotels).values({
        hotelName: hotelGeneral.hotelName,
        stars: hotelGeneral.stars,
        primaryEmail: hotelGeneral.primaryEmail,
        primaryContactNumber: hotelGeneral.primaryContactNumber,
        streetName: hotelGeneral.streetName,
        city: hotelGeneral.city,
        province: hotelGeneral.province,
        hasRestaurant: hotelGeneral.hasRestaurant,
      }).returning({ id: hotels.id });

      const newHotelId = newHotel?.id;

      if (!newHotelId) {
        throw new Error('Failed to add hotel');
      }

      // Insert into the hotelRooms table
      await db.insert(hotelRooms).values(
        rooms.map((room: any) => ({
          hotelId: newHotelId,
          roomType: room.roomType,
          typeName: room.typeName,
          count: room.count,
          amenities: room.amenities,
          floor: room.floor,
          bedCount: room.bedCount,
          additionalComments: room.additionalComments,
        }))
      );

      // Insert into the hotelStaff table
      await db.insert(hotelStaff).values(
        staffMembers.map((staff: any) => ({
          hotelId: newHotelId,
          name: staff.name,
          email: staff.email,
          contactNumber: staff.contactNumber,
          occupation: staff.occupation,
        }))
      );

      console.log("New hotel added with ID:", newHotelId);

      // return res.status(200).json({ hotelId: newHotelId });
      return NextResponse.json({ hotelId: newHotelId }, { status: 200 });

    } catch (error) {
      console.error("Error adding hotel:", error);
      return NextResponse.json({ error: 'Failed to add hotel' }, { status: 500 });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}


export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Fetch all hotels
    const allHotels = await db.select().from(hotels);

    // Return combined result
    return NextResponse.json({ allHotels }, { status: 200 });

  } catch (error) {
    console.error("Error fetching hotels:", error);
    return res.status(500).json({ error: 'Failed to fetch hotels' });
  }
}
