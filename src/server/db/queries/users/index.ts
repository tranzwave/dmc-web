"use server"

import { db } from "../.."


export const getAllUsers = ()=>{
    return db.query.user.findMany()
}


