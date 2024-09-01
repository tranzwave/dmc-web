"use server"

import { country } from './../../schema';
import { db } from "../.."


export const getAllCountries = ()=>{
    return db.query.country.findMany()
}