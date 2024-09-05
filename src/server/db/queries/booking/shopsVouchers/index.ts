"use server"
import { eq } from "drizzle-orm"
import { db } from "~/server/db"
import { shopVoucher } from './../../../schema';


export const getShopsVouchers = (bookingLineId:string) => {

    return db.query.shopVoucher.findMany({
        where: eq(shopVoucher.bookingLineId, bookingLineId),
        with: {
            shop:true
        }
    })
}