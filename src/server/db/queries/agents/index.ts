"use server"

import { eq } from "drizzle-orm";
import { db } from "../..";
import { agent } from "../../schema";


export const getAllAgents = () => {
    return db.query.agent.findMany({
    })
}

export const getAgentVendorById = (id: string) => {
    return db.query.agent.findFirst({
        where: eq(agent.id, id),
    })
}