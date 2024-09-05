// import { eq } from "drizzle-orm";
// import { NextApiRequest, NextApiResponse } from "next";
// import { NextResponse } from "next/server";
// import { db } from "~/server/db";
// import { getHotelByIdQuery } from "~/server/db/queries/hotel";
// import { hotel } from "~/server/db/schema";



// export async function GET(req: NextApiRequest,{ params }: { params: { id: string } }, res: NextApiResponse) {
//     try {
//       const id = params.id
//       // Fetch all hotels
//       const hotel = await getHotelByIdQuery(id)
  
//       // Return combined result
//       return NextResponse.json({ hotel }, { status: 200 });
      
//     } catch (error) {
//       console.error("Error fetching hotels:", error);
//       return res.status(500).json({ error: 'Failed to fetch hotels' });
//     }
//   }