"use server"
import { eq, or } from "drizzle-orm"
import { db } from "~/server/db"
import { restaurantVoucher, restaurant, restaurantMeal, restaurantVoucherLine, user } from './../../../schema';
import { SelectRestaurantVoucher, SelectRestaurantVoucherLine } from "~/server/db/schemaTypes";


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
            voucherLines:true,
            restaurant:true
        }
    })

}

export const getCoordinatorAndManager = (cooridnatorId:string, managerId:string) =>{
  return db.query.user.findMany({
    where:or(eq(user.id, cooridnatorId), eq(user.id, managerId))
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


    export const updateRestaurantVoucherRate = async (data: SelectRestaurantVoucherLine) => {
        try {
          await db.update(restaurantVoucherLine)
            .set({ rate: data.rate })
            .where(eq(restaurantVoucherLine.id, data.id ?? ""));
        } catch (error) {
          console.error(`Failed to update voucher rate for ID ${data.id}:`, error);
          throw error; 
        }
      };
    
    
      export const bulkUpdateRestaurantVoucherRates = async (voucherLines: SelectRestaurantVoucherLine[]) => {
        try {
          await db.transaction(async (trx) => {
            
            for (const voucherLine of voucherLines) {
              await trx.update(restaurantVoucherLine)
                .set({ rate: voucherLine.rate })
                .where(eq(restaurantVoucherLine.id, voucherLine.id ?? ""));
            }
          });
      
          console.log('All voucher rates updated successfully');
        } catch (error) {
          console.error('Error updating voucher rates:', error);
          throw error;
        }
      };


      export const updateRestaurantVoucherStatus = async (voucher: SelectRestaurantVoucher) =>{
        try {
          await db.update(restaurantVoucher)
            .set({ status: voucher.status })
            .where(eq(restaurantVoucher.id, voucher.id ?? ""));
        } catch (error) {
          console.error(`Failed to update voucher rate for ID ${voucher.id}:`, error);
          throw error; // Ensure to propagate the error for transaction handling
        }
      }