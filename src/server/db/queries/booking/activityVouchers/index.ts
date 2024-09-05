"use server"
import { eq } from "drizzle-orm"
import { db } from "~/server/db"
import { activityVoucher } from './../../../schema';


export const getActivityVouchers = (bookingLineId:string) => {

    return db.query.activityVoucher.findMany({
        where: eq(activityVoucher.bookingLineId, bookingLineId),
        with: {
            activityVendor:true
        }
    })
}