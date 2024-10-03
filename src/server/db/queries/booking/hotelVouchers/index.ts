"use server";

import {
  bookingLine,
  hotelVoucherLine,
  hotelVoucher,
  hotel,
  tenant,
} from "./../../../schema";
import { eq } from "drizzle-orm";
import { HotelVoucher } from "~/app/dashboard/bookings/add/context";
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
  voucherLines: SelectHotelVoucherLine[],
  confirmationDetails: {
    availabilityConfirmedBy: string,
    availabilityConfirmedTo: string,
    ratesConfirmedBy: string,
    ratesConfirmedTo: string,
  }
) => {
  try {
    await db.transaction(async (trx) => {
      // Create an array of update operations
      const voucherId = voucherLines[0]?.hotelVoucherId ?? ""
      console.log("Voucher : " + voucherId)
      for (const voucherLine of voucherLines) {
        await trx
          .update(hotelVoucherLine)
          .set({ rate: voucherLine.rate })
          .where(eq(hotelVoucherLine.id, voucherLine.id ?? ""));
      }
      console.log({
        availabilityConfirmedBy: confirmationDetails.availabilityConfirmedBy,
        availabilityConfirmedTo: confirmationDetails.availabilityConfirmedTo,
        ratesConfirmedBy: confirmationDetails.ratesConfirmedBy,
        ratesConfirmedTo: confirmationDetails.ratesConfirmedTo,
      })
      await trx
        .update(hotelVoucher)
        .set({
          availabilityConfirmedBy: confirmationDetails.availabilityConfirmedBy,
          availabilityConfirmedTo: confirmationDetails.availabilityConfirmedTo,
          ratesConfirmedBy: confirmationDetails.ratesConfirmedBy,
          ratesConfirmedTo: confirmationDetails.ratesConfirmedTo,
        })
        .where(eq(hotelVoucher.id, voucherId))
    });

    console.log("All voucher rates updated successfully");
  } catch (error) {
    console.error("Error updating voucher rates:", error);
    throw error; // Ensure to propagate the error for handling by the caller
  }
};

export const updateHotelVoucherStatus = async (voucher: SelectHotelVoucher) => {
  try {
    await db
      .update(hotelVoucher)
      .set({ status: voucher.status })
      .where(eq(hotelVoucher.id, voucher.id ?? ""));
  } catch (error) {
    console.error(`Failed to update voucher rate for ID ${voucher.id}:`, error);
    throw error; // Ensure to propagate the error for transaction handling
  }
};
