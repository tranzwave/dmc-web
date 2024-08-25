"use server"

import { db } from '../..';
import { booking } from './../../schema';



export const getAllBookings = ()=>{
    return db.query.booking.findMany();
}