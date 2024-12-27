"use client";
import { useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import Image from "next/image";
import { useOrganization } from "~/app/dashboard/context";
import LoadingLayout from "~/components/common/dashboardLoading";
import { HotelVoucherData } from "..";
import { SelectBooking } from "~/server/db/schemaTypes";
import { useEffect, useState } from "react";
import { getBookingById, getBookingLineWithAllData } from "~/server/db/queries/booking";
import { Country } from "country-state-city";
import { calculateNights, formatDate, getLetterByIndex } from "~/lib/utils/index";
import VoucherHeader from "~/components/common/voucher/VoucherHeader";
import { OrganizationResource, UserResource } from "@clerk/types";

type HotelVoucherPDFProps = {
  voucher: HotelVoucherData;
  bookingName: string;
  organization: OrganizationResource;
  user: UserResource;
  currency: string;
  cancellation?: boolean;
};

const HotelVoucherView = ({ voucher, cancellation, bookingName, organization, user, currency }: HotelVoucherPDFProps) => {
  // const organization = useOrganization();
  // const { isLoaded, user } = useUser();

  // if (!isLoaded || !organization) {
  //   return <LoadingLayout />;
  // }

  const calculateTotal = () => {
    let sum = 0
    voucher.voucherLines.forEach(l => {
      sum += l.roomCount * (Number(l.rate) ?? 0)
    })
    return sum;
  }


  return (
    <div className="flex flex-col border">
      <VoucherHeader organization={organization}/>
      <div className="p-4">
        <div className="card-title w-full text-center text-[15px] font-bold">
          {cancellation ? (<div className="text-red-500">Cancellation Voucher</div>) : `Hotel Reservation Voucher-${voucher.status === 'amended' ? 'Amendment' : ''}`}

        </div>
        <div className="flex w-full flex-row justify-between">
          <div className="text-[13px]">
            {/* <div>Bill to : {organization?.name}</div> */}
            <div>Voucher ID : {voucher?.id + `${voucher.status === "amended" ? `/a${voucher.amendedCount}` : ''}`}</div>
            <div>Hotel Name : {voucher?.hotel.name}</div>
            <div>Tour ID : {voucher.bookingLineId}</div>
            <div>Booking Name : {bookingName}</div>
            <div>
              Nationality : {Country.getCountryByCode(voucher.bookingLineId.split("-")[1]?.split("-")[0] ?? "")?.name}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <table className="w-[100%] rounded-md border bg-white">
            <thead>
              <tr className="border-b text-[12px]">
                <th className="px-4 py-2 text-left font-semibold">Check In</th>
                <th className="px-4 py-2 text-left font-semibold">Check Out</th>
                <th className="px-4 py-2 text-left font-semibold">
                  Room Category
                </th>
                <th className="px-4 py-2 text-left font-semibold">Occupancy</th>
                <th className="px-4 py-2 text-left font-semibold">Meal Plan</th>
                <th className="px-4 py-2 text-left font-semibold">Quantity</th>
                <th className="px-4 py-2 text-left font-semibold">No of Nights</th>
                <th className="px-4 py-2 text-left font-semibold">Adults</th>
                <th className="px-4 py-2 text-left font-semibold">Kids</th>
                <th className="px-4 py-2 text-left font-semibold">Price</th>
                <th className="px-4 py-2 text-left font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {voucher.voucherLines?.map((line, index) => (
                <tr key={index} className="border-b hover:bg-gray-50 text-[13px]">
                  <td className="px-4 py-2">{formatDate(line.checkInDate) ?? "N/A"}</td>
                  <td className="px-4 py-2">{formatDate(line.checkOutDate) ?? "N/A"}</td>
                  <td className="px-4 py-2">{line.roomCategory ?? "N/A"}</td>
                  <td className="px-4 py-2">{line.roomType ?? "N/A"}</td>
                  <td className="px-4 py-2">{line.basis ?? "N/A"}</td>
                  <td className="px-4 py-2">{line.roomCount}</td>
                  <td className="px-4 py-2">{calculateNights(line.checkInDate, line.checkOutDate)}</td>
                  <td className="px-4 py-2">{line.adultsCount ?? "N/A"}</td>
                  <td className="px-4 py-2">{line.kidsCount ?? "N/A"}</td>
                  <td className="px-4 py-2">{line.rate ?? '-'}</td>
                  <td className="px-4 py-2">
                    {line.rate ? ((Number(line.rate) ?? 0) * line.roomCount).toFixed(2) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex w-full flex-row justify-end p-4 text-[13px] font-semibold">
          {`Total(${currency}) - ${calculateTotal()}`}
        </div>

        <div className="text-[13px] font-normal">


          {voucher.ratesConfirmedTo && (
            <div>{`Rates have been confirmed by ${voucher.ratesConfirmedBy} ${voucher.ratesConfirmedTo ? ' and communicated to ' + voucher.ratesConfirmedTo : ''}`}</div>
          )}

          <div>Other Instructions : {voucher.specialNote}</div>

          {voucher.availabilityConfirmedTo && (
            <div>{`Above arrangement is confirmed on the telephone by ${voucher.availabilityConfirmedBy} ${voucher.availabilityConfirmedTo ? ' and communicated to ' + voucher.availabilityConfirmedTo : ''}`}</div>
          )}
        </div>
        <div className="mt-4 text-[13px]">
          
          <div>Billing Instructions : {voucher.billingInstructions}</div>

          {voucher.status === 'amended' && (
            <div>Reference(s) : {voucher.reasonToAmend}</div>
          )}
          {voucher.status === 'cancelled' && (
            <div>Reason for cancellation : {voucher.id}</div>
          )}
        </div>
        <div className="mt-10 text-[13px]">
          <div>Printed Date : {format(Date.now(), "dd/MM/yyyy")}</div>
          <div>Prepared By : {user?.fullName ?? ""}</div>
          <div>Contact Number : {(user?.publicMetadata as any)?.info?.contact ?? ""}</div>
          {/* <div className="text-[12px] text-center text-gray-700">This is a computer generated Voucher & does not require a signature</div> */}
        </div>
      </div>
      {/* <div className="h-8 w-full bg-primary-green"></div> */}
    </div>
  );
};

export default HotelVoucherView;
