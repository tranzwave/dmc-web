"use server"

import { bookingLine, hotelVoucherLine, hotelVoucher, hotel } from './../../../schema';
import { eq } from "drizzle-orm"
import { HotelVoucher } from '~/app/dashboard/bookings/add/context';
import { db } from "~/server/db"

export const getBookingLineById = (id:string) => {
    return db.query.bookingLine.findFirst({
        where: eq(bookingLine.id,id)
    })
}


export const getHotelVouchers = (bookingLineId:string) => {

    return db.query.hotelVoucher.findMany({
        where: eq(hotelVoucher.bookingLineId, bookingLineId),
        with: {
            voucherLine: true,
            hotel:true,
            bookingLine:true
        }
    })

    // return db.query.hotel.findMany({
    //     with: {
    //         hotelVoucher: {
    //             where: eq(hotelVoucher.bookingLineId,bookingLineId),
    //             with:{
    //                 voucherLine:true
    //             }
    //         }
    //     }
    // })


}

// export const getBookingLinesWithHotelVouchers = (bookingLineId:string) => {
//     return db.bookingLine
// }