"use server"

import { and, eq } from "drizzle-orm";
import { db } from "../..";
import { agent } from "../../schema";
import { InsertAgent } from "../../schemaTypes";

export const getAllCountries = () => {
    return db.query.country.findMany({
    });
};

export const getAllAgents = () => {
    return db.query.agent.findMany({
    })
}

export const getAgentVendorById = (id: string) => {
    return db.query.agent.findFirst({
        where: eq(agent.id, id),
    })
}

export const saveAgent = async (agentData: {
    name: string,
    countryCode: string,
    email: string,
    primaryContactNumber: string,
    agency: string,
    tenantId: string
}) => {
    const insertedAgents = await db.insert(agent).values({
        name: agentData.name,
        countryCode: agentData.countryCode,
        email: agentData.email,
        primaryContactNumber: agentData.primaryContactNumber,
        agency: agentData.agency,
        tenantId: agentData.tenantId
    }).returning();

    const newAgent = insertedAgents[0];

    if (!newAgent) {
        throw new Error("Failed to insert agent data");
    }

    // Return the inserted agent or some result object
    return newAgent;
};

export const insertAgent = async (
    agents: InsertAgent[],
) => {
    try {
        const newAgennt = await db.transaction(async (tx) => {
            const foundTenant = await tx.query.tenant.findFirst();

            if (!foundTenant) {
                throw new Error("Couldn't find any tenant");
            }

            for (const currentAgent of agents) {
                const foundAgent = await tx.query.agent.findFirst({
                    where: and(
                        eq(agent.tenantId, foundTenant.id),
                        eq(agent.primaryContactNumber, currentAgent.primaryContactNumber),
                        eq(agent.email, currentAgent.email)
                    ),
                });

                if (!foundAgent) {
                    const newAgentId = await tx
                        .insert(agent)
                        .values({
                            ...currentAgent,
                            tenantId: foundTenant.id,
                        })
                        .returning({
                            id: agent.id,
                        });

                    if (!newAgentId[0]) {
                        throw new Error(`Couldn't add agent: ${currentAgent.name}`);
                    }
                }
            }
        });
        return newAgennt
    } catch (error: any) {
        console.error("Error in insertAgent:", error?.detail ?? error);
        throw error;
    }
};
