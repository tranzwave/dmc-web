"use server"
import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { transportVoucher } from './../../../schema';


export const getTransportVouchers = (bookingLineId: string) => {

  return db.query.transportVoucher.findMany({
    where: eq(transportVoucher.bookingLineId, bookingLineId),
    with: {
      driver: true
    }
  })
}

export const updateTransportVoucherStatus = async (transportVoucherId: string, status: | "inprogress" | "confirmed" | "cancelled" | "sentToVendor" | "vendorConfirmed" | "sentToClient" | "amended") => {
  try {
    const updatedVoucher = await db
      .update(transportVoucher)
      .set({ status })
      .where(eq(transportVoucher.id, transportVoucherId))
      .returning();

    return updatedVoucher;
  } catch (error) {
    console.error("Error updating shop voucher status:", error);
    throw new Error("Failed to update shop voucher status.");
  }
};

export const deleteTransportVoucher = async (transportVoucherId: string) => {
  try {
    const deletedVoucher = await db
      .delete(transportVoucher)
      .where(eq(transportVoucher.id, transportVoucherId))
      .returning();

    return deletedVoucher;
  } catch (error) {
    console.error("Error deleting transport voucher:", error);
    throw new Error("Failed to delete transport voucher.");
  }
};
