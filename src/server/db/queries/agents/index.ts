"use server"

import { eq } from "drizzle-orm";
import { db } from "../..";
import { agent } from "../../schema";

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
