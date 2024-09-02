import { NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { db } from '~/server/db';

export async function POST(req: Request, res: NextApiResponse) {
  if (req.method === 'POST') {
    const requestBody = await req.json();
    try {
      const {
        transportGeneral,
        vehicle: vehicle,
        driver: driver,
      } = requestBody;

      console.log(req.body)

      // Insert into the drivers table
      const [newDriver] = await db.insert(driver).values([]).returning({ id: driver.id });

      const newDriverId = newDriver?.id;

      if (!newDriverId) {
        throw new Error('Failed to add driver');
      }

      // Insert into the driver table
      await db.insert(vehicle).values(
        vehicle.map((vehicle: any) => ({
          driverId: newDriverId,
          tenantId: vehicle.roomType,
          vehicleType: vehicle.typeName,
          numberPlate: vehicle.count,
          seats: vehicle.amenities,
          make: vehicle.floor,
          model: vehicle.bedCount,
          year: vehicle.additionalComments,
          revenueLicense: vehicle.revenueLicense
        }))
      );

      console.log("New driver added with ID:", newDriverId);

      // return res.status(200).json({ driverId: newdriverId });
      return NextResponse.json({ driverId: newDriverId }, { status: 200 });

    } catch (error) {
      console.error("Error adding driver:", error);
      return NextResponse.json({ error: 'Failed to add driver' }, { status: 500 });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}