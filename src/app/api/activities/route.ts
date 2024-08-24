import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { activityVendors } from '~/server/db/schema';

export async function POST(req: Request, res: NextApiResponse) {
    if (req.method === 'POST') {
        const requestBody = await req.json();
        try {
            const {
                activityGeneral
            } = requestBody;

            console.log(req.body)

            // Insert into the activities table
            const [newActivity] = await db.insert(activityVendors).values({
                name: activityGeneral.name,
                activityType: activityGeneral.type,
                contactNumber: activityGeneral.primary_contact_number,
            }).returning({ id: activityVendors.id });

            const newActivityId = newActivity?.id;

            if (!newActivity) {
                throw new Error('Failed to add activity');
            }


            console.log("New activity added with ID:", newActivityId);

            // return res.status(200).json({ activityId: newActivityId });
            return NextResponse.json({ activityId: newActivityId }, { status: 200 });

        } catch (error) {
            console.error("Error adding activity:", error);
            return NextResponse.json({ error: 'Failed to add activity' }, { status: 500 });
        }
    } else {
        return res.status(405).json({ message: 'Method not allowed' });
    }
}


export async function GET(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Fetch all activities
        const allActivities = await db.select().from(activityVendors);

        // Return combined result
        return NextResponse.json({ allActivities }, { status: 200 });

    } catch (error) {
        console.error("Error fetching activities:", error);
        return res.status(500).json({ error: 'Failed to fetch activities' });
    }
}
