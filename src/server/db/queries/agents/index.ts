"use server"

import { agent } from './../../schema';
import { db } from "../.."


export const getAllAgents = ()=>{
    return db.query.agent.findMany()
}