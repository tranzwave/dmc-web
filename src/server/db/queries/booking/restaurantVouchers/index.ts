"use server"
import { eq } from "drizzle-orm"
import { db } from "~/server/db"
import { restaurantVoucher, restaurant, restaurantMeal } from './../../../schema';


export const getAllRestaurants = ()=>{
    return db.query.restaurant.findMany({
        with: {
            restaurantMeal: true
        }
    })
}

export const getRestaurantVouchers = (bookingLineId:string) => {

    return db.query.restaurantVoucher.findMany({
        where: eq(restaurantVoucher.bookingLineId, bookingLineId),
        with: {
            // voucherLine: true,
            // hotel:true,
            // bookingLine:true
            restaurantVoucherLine:true,
            restaurant:true,
            bookingLine:true
        }
    })

}

export const getMeals = (restaurantId:string)=>{
    return db.query.restaurantMeal.findMany({
        where: eq(restaurantMeal.restaurantId, restaurantId)
    })
}

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



