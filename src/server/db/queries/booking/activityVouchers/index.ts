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

export const updateActivityVoucherStatus = async (activityVoucherId: string, status: | "inprogress" | "confirmed" | "cancelled" | "sentToVendor" | "vendorConfirmed" | "sentToClient" | "amended" ) => {
    try {
      const updatedVoucher = await db
        .update(activityVoucher)
        .set({ status })
        .where(eq(activityVoucher.id, activityVoucherId))
        .returning();
  
      return updatedVoucher;
    } catch (error) {
      console.error("Error updating shop voucher status:", error);
      throw new Error("Failed to update shop voucher status.");
    }
  };