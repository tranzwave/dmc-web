"use server"
import { and, eq, ne } from "drizzle-orm";
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

export const deleteDriverTransportVoucher = async (transportVoucherId: string, reasonToDelete: string) => {
  try {
    const result = await db.transaction(async (trx) => {
      // Fetch the activity voucher line to check if it exists
      const [voucherLine] = await trx
        .select()
        .from(transportVoucher)  // Assuming activityVoucher exists
        .where(eq(transportVoucher.id, transportVoucherId))  // Updated for activityVoucher.id
        .execute();

      if (!voucherLine || !voucherLine.driverId) {
        throw new Error(`No activity voucher line found with ID: ${transportVoucherId}`);
      }

      const { driverId } = voucherLine;

      // Check if there are other lines associated with this voucher
      const remainingVoucherLines = await trx
        .select()
        .from(transportVoucher)  // Use activityVoucher
        .where(
          and(
            eq(transportVoucher.driverId, driverId),  // Check for matching activityId
            ne(transportVoucher.id, transportVoucherId),  // Exclude the current voucher line
          ),
        )
        .execute();

      // Update the status of the selected activity voucher line to "deleted"
      const [updatedVoucherLine] = await trx
        .update(transportVoucher)  // Update activityVoucher
        .set({
          status: 'cancelled',  // Update the status to "deleted"
          reasonToDelete: reasonToDelete
        })
        .where(eq(transportVoucher.id, transportVoucherId))  // Where id matches voucherLineId
        .returning()
        .execute();

      if (!updatedVoucherLine?.id) {
        throw new Error(`Failed to update the status of voucher line with ID: ${transportVoucherId}`);
      }

      let updatedVoucher = null;
      // If no more voucher lines remain, update the associated activity voucher status to "deleted"
      if (remainingVoucherLines.length === 0) {
        const [updatedVoucherResult] = await trx
          .update(transportVoucher)  // Update the activityVoucher
          .set({
            status: 'cancelled',  // Update the status to "deleted"
          })
          .where(eq(transportVoucher.id, driverId))  // Where id matches activityId
          .returning()
          .execute();

        updatedVoucher = updatedVoucherResult ?? null;
      }

      // Return the updated voucher line and potentially the updated voucher
      return {
        updatedVoucherLine,
        updatedVoucher,
      };
    });

    return result;
  } catch (error) {
    console.error(`Error updating voucher line with ID: ${transportVoucherId}`, error);
    throw new Error(`Failed to update activity voucher line or associated voucher`);
  }
};

export const deleteGuideTransportVoucher = async (transportVoucherId: string, reasonToDelete: string) => {
  try {
    const result = await db.transaction(async (trx) => {
      // Fetch the activity voucher line to check if it exists
      const [voucherLine] = await trx
        .select()
        .from(transportVoucher)  // Assuming activityVoucher exists
        .where(eq(transportVoucher.id, transportVoucherId))  // Updated for activityVoucher.id
        .execute();

      if (!voucherLine || !voucherLine.guideId) {
        throw new Error(`No transport voucher line found with ID: ${transportVoucherId}`);
      }

      const { guideId } = voucherLine;

      // Check if there are other lines associated with this voucher
      const remainingVoucherLines = await trx
        .select()
        .from(transportVoucher)  // Use activityVoucher
        .where(
          and(
            eq(transportVoucher.guideId, guideId),  // Check for matching activityId
            ne(transportVoucher.id, transportVoucherId),  // Exclude the current voucher line
          ),
        )
        .execute();

      // Update the status of the selected activity voucher line to "deleted"
      const [updatedVoucherLine] = await trx
        .update(transportVoucher)  // Update activityVoucher
        .set({
          status: 'cancelled',  // Update the status to "deleted"
          reasonToDelete: reasonToDelete
        })
        .where(eq(transportVoucher.id, transportVoucherId))  // Where id matches voucherLineId
        .returning()
        .execute();

      if (!updatedVoucherLine?.id) {
        throw new Error(`Failed to update the status of voucher line with ID: ${transportVoucherId}`);
      }

      let updatedVoucher = null;
      // If no more voucher lines remain, update the associated activity voucher status to "deleted"
      if (remainingVoucherLines.length === 0) {
        const [updatedVoucherResult] = await trx
          .update(transportVoucher)  // Update the activityVoucher
          .set({
            status: 'cancelled',  // Update the status to "deleted"
          })
          .where(eq(transportVoucher.id, guideId))  // Where id matches activityId
          .returning()
          .execute();

        updatedVoucher = updatedVoucherResult ?? null;
      }

      // Return the updated voucher line and potentially the updated voucher
      return {
        updatedVoucherLine,
        updatedVoucher,
      };
    });

    return result;
  } catch (error) {
    console.error(`Error updating voucher line with ID: ${transportVoucherId}`, error);
    throw new Error(`Failed to update activity voucher line or associated voucher`);
  }
};
