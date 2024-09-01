"use server"

import { user } from './../../schema';
import { db } from "../.."

export const getAllUsers = ()=>{
    return db.query.user.findMany()
}