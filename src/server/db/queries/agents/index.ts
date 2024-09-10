"use server"

import { db } from "../..";


export const getAllAgents = () => {
    return db.query.agent.findMany()
}