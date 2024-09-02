"use server"
import { eq } from "drizzle-orm"
import { db } from "~/server/db"
import { transportVoucher } from './../../../schema';


export const getTransportVouchers = (bookingLineId:string) => {

    return db.query.transportVoucher.findMany({
        where: eq(transportVoucher.bookingLineId, bookingLineId),
        with: {
            driver:true
        }
    })
}