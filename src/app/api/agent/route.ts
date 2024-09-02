import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { agent } from '~/server/db/schema';

export async function POST(req: Request, res: NextApiResponse) {
    if (req.method === 'POST') {
        const requestBody = await req.json();
        try {
            const { agentGeneral } = requestBody;

            console.log(req.body);

            // Insert into the agents table
            const [newAgent] = await db.insert(agent).values({
                tenantId: agentGeneral.tenant_id,
                country: agentGeneral.country_code,
                name: agentGeneral.name,
                email: agentGeneral.email,
            }).returning({ id: agent.id });

            const newAgentId = newAgent?.id;

            if (!newAgent) {
                throw new Error('Failed to add agent');
            }

            console.log("New agent added with ID:", newAgentId);

            return NextResponse.json({ agentId: newAgentId }, { status: 200 });

        } catch (error) {
            console.error("Error adding agent:", error);
            return NextResponse.json({ error: 'Failed to add agent' }, { status: 500 });
        }
    } else {
        return res.status(405).json({ message: 'Method not allowed' });
    }
}

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Fetch all agents
        const allAgents = await db.select().from(agent);

        // Return combined result
        return NextResponse.json({ allAgents }, { status: 200 });

    } catch (error) {
        console.error("Error fetching agents:", error);
        return res.status(500).json({ error: 'Failed to fetch agents' });
    }
}
