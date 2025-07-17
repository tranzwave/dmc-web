"use server"
import { eq } from "drizzle-orm"
import { db } from "~/server/db"
import { shopVoucher } from './../../../schema';
import { StatusKey } from "~/app/dashboard/bookings/[id]/edit/context";


export const getShopsVouchers = (bookingLineId:string) => {

    return db.query.shopVoucher.findMany({
        where: eq(shopVoucher.bookingLineId, bookingLineId),
        with: {
            shop:true
        }
    })
}

// git test commen

export const updateShopVoucherStatus = async (shopVoucherId: string, status: | "inprogress" | "confirmed" | "cancelled" | "sentToVendor" | "vendorConfirmed" | "sentToClient" | "amended" ) => {
    try {
      const updatedVoucher = await db
        .update(shopVoucher)
        .set({ status })
        .where(eq(shopVoucher.id, shopVoucherId))
        .returning();
  
      return updatedVoucher;
    } catch (error) {
      console.error("Error updating shop voucher status:", error);
      throw new Error("Failed to update shop voucher status.");
    }
  };

export const deleteShopVoucher = async (shopVoucherId: string) => {
    try {
      await db.delete(shopVoucher).where(eq(shopVoucher.id, shopVoucherId));
      return true
    } catch (error) {
      console.error("Error deleting shop voucher:", error);
      throw new Error("Failed to delete shop voucher.");
    }
  }

  