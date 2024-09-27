// pages/api/users/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { getUserById } from '~/app/dashboard/admin/_actions';

export async function GET(req: NextApiRequest,{ params }: { params: { id: string } }, res: NextApiResponse) {
  const id = params.id;

      try {
      const id = params.id
      // Fetch all hotels
      const user = await getUserById(id)

      console.log(user)
      // Return combined result
      return NextResponse.json({ result: user }, { status: 200 });
      
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ error: 'Failed to fetch user' });
    }
}
