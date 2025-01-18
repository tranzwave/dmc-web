"use server";

import {
  bookingLine,
  hotelVoucherLine,
  hotelVoucher,
  hotel,
  tenant,
} from "./../../../schema";
import { eq, sql } from "drizzle-orm";
import { HotelVoucher } from "~/app/dashboard/bookings/add/context";
import { VoucherConfirmationDetails } from "~/lib/types/booking";
import { db } from "~/server/db";
import {
  SelectHotelVoucher,
  SelectHotelVoucherLine,
} from "~/server/db/schemaTypes";

export const getBookingLineById = (id: string) => {
  return db.query.bookingLine.findFirst({
    where: eq(bookingLine.id, id),
  });
};

export const getHotelVouchers = (bookingLineId: string) => {
  return db.query.hotelVoucher.findMany({
    where: eq(hotelVoucher.bookingLineId, bookingLineId),
    with: {
      voucherLines: true,
      hotel: true,
    },
  });
};

// export const getBookingLinesWithHotelVouchers = (bookingLineId:string) => {
//     return db.bookingLine
// }

// export const updateVoucherRate = async (data:SelectHotelVoucherLine) => {
//     return await db.update(hotelVoucherLine).set({rate:data.rate}).where(eq(hotelVoucherLine.id,data.id ?? ""))
// }

export const updateHotelVoucherRate = async (data: SelectHotelVoucherLine) => {
  try {
    await db
      .update(hotelVoucherLine)
      .set({ rate: data.rate })
      .where(eq(hotelVoucherLine.id, data.id ?? ""));
  } catch (error) {
    console.error(`Failed to update voucher rate for ID ${data.id}:`, error);
    throw error; // Ensure to propagate the error for transaction handling
  }
};

export const bulkUpdateHotelVoucherRates = async (
  ratesMap: Map<string,string>,
  voucherId:string,
  confirmationDetails: {
    availabilityConfirmedBy: string;
    availabilityConfirmedTo: string;
    ratesConfirmedBy: string;
    ratesConfirmedTo: string;
    specialNote:string;
    billingInstructions:string
  },
) => {
  try {
    await db.transaction(async (trx) => {
      // Create an array of update operations
      // const voucherId = voucherLines[0]?.hotelVoucherId ?? "";
      console.log("Voucher : " + voucherId);
      let rateAmended = false;
      for (const rateEntry of ratesMap) {
        const existingVoucher = await trx.query.hotelVoucherLine.findFirst({
          where: eq(hotelVoucherLine.id, rateEntry[0]),
        });

        if (existingVoucher && Number(existingVoucher.rate) > 0 && Number(existingVoucher.rate) !== Number(rateEntry[1])) {
          rateAmended = true;
        }
        await trx
          .update(hotelVoucherLine)
          .set({ rate: rateEntry[1] })
          .where(eq(hotelVoucherLine.id, rateEntry[0] ?? ""));
      }

      if (rateAmended) {
        await trx
          .update(hotelVoucher)
          .set({
            availabilityConfirmedBy:
              confirmationDetails.availabilityConfirmedBy,
            availabilityConfirmedTo:
              confirmationDetails.availabilityConfirmedTo,
            ratesConfirmedBy: confirmationDetails.ratesConfirmedBy,
            ratesConfirmedTo: confirmationDetails.ratesConfirmedTo,
            status: "amended",
            reasonToAmend: "Rates updated",
            specialNote:confirmationDetails.specialNote,
            billingInstructions:confirmationDetails.billingInstructions,
            amendedCount: sql`${hotelVoucher.amendedCount} + 1`
          })
          .where(eq(hotelVoucher.id, voucherId));
      } else {
        await trx
          .update(hotelVoucher)
          .set({
            availabilityConfirmedBy:
              confirmationDetails.availabilityConfirmedBy,
            availabilityConfirmedTo:
              confirmationDetails.availabilityConfirmedTo,
            ratesConfirmedBy: confirmationDetails.ratesConfirmedBy,
            ratesConfirmedTo: confirmationDetails.ratesConfirmedTo,
            specialNote:confirmationDetails.specialNote,
            billingInstructions:confirmationDetails.billingInstructions
          })
          .where(eq(hotelVoucher.id, voucherId));
      }
    });

    console.log("All voucher rates updated successfully");
  } catch (error) {
    console.error("Error updating voucher rates:", error);
    throw error; // Ensure to propagate the error for handling by the caller
  }
};

export const updateHotelVoucherStatus = async (voucher: SelectHotelVoucher) => {
  try {
    const updatedRow = await db
      .update(hotelVoucher)
      .set({ status: voucher.status })
      .where(eq(hotelVoucher.id, voucher.id ?? ""))
      .returning();
    return updatedRow ? true : false;
  } catch (error) {
    console.error(`Failed to update voucher rate for ID ${voucher.id}:`, error);
    return false; // Ensure to propagate the error for transaction handling
  }
};

//Update hotel voucher status with confirmation details
export const updateHotelVoucherStatusWithConfirmationDetails = async (voucher: SelectHotelVoucher, confirmationDetails:VoucherConfirmationDetails) => {
  try {
    const updatedRow = await db
      .update(hotelVoucher)
      .set({ 
        status: voucher.status, 
        responsiblePerson:confirmationDetails.responsiblePerson, 
        confirmationNumber:confirmationDetails.confirmationNumber, 
        reminderDate:confirmationDetails.reminderDate 
      })
      .where(eq(hotelVoucher.id, voucher.id ?? ""))
      .returning();
    return updatedRow ? true : false;
  } catch (error) {
    console.error(`Failed to update voucher rate for ID ${voucher.id}:`, error);
    return false;
  }
};
