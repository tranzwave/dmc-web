"use server"

import { and, eq } from "drizzle-orm";
import { db } from "../..";
import { agent } from "../../schema";
import { InsertAgent } from "../../schemaTypes";

export const getAllCountries = () => {
    return db.query.country.findMany({
    });
};

export const getAllAgents = (tenantId: string) => {
    return db.query.agent.findMany({
        where: eq(agent.tenantId, tenantId),
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


export async function deleteAgentCascade(agentId: string) {
    try {
        // Start the transaction
        const deletedAgentId = await db.transaction(async (trx) => {
            // Delete related driver-vehicle relationships
            const deletedAgent = await trx
                .delete(agent)
                .where(eq(agent.id, agentId)).returning({ id: agent.id });
            return deletedAgent;
        });

        console.log("Agent and related data deleted successfully");
        return deletedAgentId;
    } catch (error) {
        console.error("Error deleting agent and related data:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }
}



export async function updateAgent(
    agentId: string,
    updatedAgent: InsertAgent | null
) {
    console.log(agentId);
    console.log(updatedAgent);

    // Begin a transaction
    const updated = await db.transaction(async (trx) => {
        // Update the agent
        if (!updatedAgent) {
            throw new Error("Please provide updated agent data");
        }

        const updatedAgentResult = await trx
            .update(agent)
            .set({
                name: updatedAgent.name,
                countryCode: updatedAgent.countryCode,
                email: updatedAgent.email,
                primaryContactNumber: updatedAgent.primaryContactNumber,
                agency: updatedAgent.agency,
            })
            .where(eq(agent.id, agentId))
            .returning({ updatedId: agent.id });

        if (updatedAgentResult.length === 0) {
            throw new Error(`Agent with id ${agentId} not found.`);
        }


        return { updatedAgentResult };
    });

    console.log(updated);
    return updated;
}
