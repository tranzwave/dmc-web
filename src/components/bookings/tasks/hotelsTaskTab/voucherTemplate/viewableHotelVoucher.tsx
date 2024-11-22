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

type HotelVoucherPDFProps = {
  voucher: HotelVoucherData;
  bookingName:string
  cancellation?: boolean
};

const HotelVoucherView = ({ voucher, cancellation, bookingName }: HotelVoucherPDFProps) => {
  const organization = useOrganization();
  const { isLoaded, user } = useUser();

  if (!isLoaded || !organization) {
    return <LoadingLayout />;
  }

  const orgData = {
    address: organization.publicMetadata.address as string ?? "Address",
    contactNumber: organization.publicMetadata.contactNumber as string ?? "Number",
    website: organization.publicMetadata.website as string ?? "Website"
  }
  const calculateTotal = ()=>{
    let sum = 0
    voucher.voucherLines.forEach(l => {
      sum += l.roomCount * (Number(l.rate) ?? 0)
    })
    return sum;
  }


  return (
    <div className="flex flex-col border">
      <div className="flex flex-col items-center justify-center bg-primary-green p-4">
        <Image
          src={organization?.imageUrl ?? ""}
          height={0}
          width={0}
          className="h-8 w-auto"
          alt="orgLogo"
        />
        <div className="text-base font-semibold text-white">
          {organization?.name}
        </div>
        {orgData.address && orgData.contactNumber && orgData.website && (
          <>
            <div className="text-[13px] text-white">{orgData.address}</div>
            <div className="text-[13px] text-white">{orgData.contactNumber}</div>
            <div className="text-[13px] text-white">{orgData.website}</div>
          </>
        )}

      </div>
      <div className="p-4">
        <div className="card-title w-full text-center">
          {cancellation ? (<div className="text-red-500">Cancellation Voucher</div>) : `Hotel Reservation Voucher-${voucher.status === 'amended' ? 'Amendment' : ''}`}

        </div>
        <div className="flex w-full flex-row justify-between">
          <div className="text-[13px]">
            {/* <div>Bill to : {organization?.name}</div> */}
            <div>Hotel Name : {voucher?.hotel.name}</div>
            <div>Tour ID : {voucher.bookingLineId}</div>
            <div>Booking Name : {bookingName}</div>
            <div>
              Country : {voucher.bookingLineId.split("-")[1]?.split("-")[0]}
            </div>
            <div>{`Adults : ${voucher.voucherLines[0]?.adultsCount}`}</div>
            <div>{`Kids : ${voucher.voucherLines[0]?.kidsCount}`}</div>
          </div>
          <div className="text-[13px]">
            <div>Voucher ID : {voucher?.voucherLines[0]?.id + `${voucher.status === "amended" ? '/a' : ''}`}</div>
            {/* <div>Check In : {voucher?.voucherLines[0]?.checkInDate}</div>
            <div>Check Out : {voucher?.voucherLines[0]?.checkOutDate}</div> */}
            {/* <div>
              Number of Nights :{" "}
              {calculateDaysBetween(
                voucher.voucherLines[0]?.checkInDate ?? "",
                voucher.voucherLines[0]?.checkOutDate ?? "",
              )}
            </div> */}
          </div>
        </div>

        <div className="mt-4 text-[13px]">
          <table className="min-w-full rounded-md border bg-white">
            <thead>
              <tr className="border-b ">
                <th className="px-4 py-2 text-left font-semibold">Occupancy</th>
                <th className="px-4 py-2 text-left font-semibold">Meal Plan</th>
                <th className="px-4 py-2 text-left font-semibold">
                  Room Category
                </th>
                <th className="px-4 py-2 text-left font-semibold">Check In</th>
                <th className="px-4 py-2 text-left font-semibold">Check Out</th>

                <th className="px-4 py-2 text-left font-semibold">Quantity</th>
                <th className="px-4 py-2 text-left font-semibold">Price</th>
                <th className="px-4 py-2 text-left font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {voucher.voucherLines?.map((line, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{line.roomType ?? "N/A"}</td>
                  <td className="px-4 py-2">{line.basis ?? "N/A"}</td>
                  <td className="px-4 py-2">{line.roomCategory ?? "N/A"}</td>
                  <td className="px-4 py-2">{line.checkInDate ?? "N/A"}</td>
                  <td className="px-4 py-2">{line.checkOutDate ?? "N/A"}</td>
                  <td className="px-4 py-2">{line.roomCount}</td>
                  <td className="px-4 py-2">{line.rate ?? '-'}</td>
                  <td className="px-4 py-2">
                    {line.rate ? ((Number(line.rate) ?? 0) * line.roomCount).toFixed(2) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>



        {/* <div className="mt-4 text-[13px]">
          <table className="min-w-full rounded-md border bg-white">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left font-semibold">
                  Availability Confirmed By 
                </th>
                <th className="px-4 py-2 text-left font-semibold">
                  Availability Confirmed To
                </th>
                <th className="px-4 py-2 text-left font-semibold">
                  Rates Confirmed By
                </th>
                <th className="px-4 py-2 text-left font-semibold">
                  Rates Confirmed To
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">
                  {voucher.availabilityConfirmedBy ?? ""}
                </td>
                <td className="px-4 py-2">
                  {voucher.availabilityConfirmedTo ?? ""}
                </td>
                <td className="px-4 py-2">{voucher.ratesConfirmedBy ?? ""}</td>
                <td className="px-4 py-2">{voucher.ratesConfirmedTo ?? ""}</td>
              </tr>
            </tbody>
          </table>
        </div> */}

        <div className="flex w-full flex-row justify-end p-4 text-[13px] font-semibold">
          {`Total(USD) - ${calculateTotal()}`}
        </div>

        <div className="text-[14px] font-normal">
          {voucher.availabilityConfirmedTo && (
            <div>{`Availability confirmed by ${voucher.availabilityConfirmedBy} ${voucher.availabilityConfirmedTo ? 'to ' + voucher.availabilityConfirmedTo : ''}`}</div>
          )}

          {voucher.ratesConfirmedTo && (
            <div>{`Rates confirmed by ${voucher.ratesConfirmedBy} ${voucher.ratesConfirmedTo ? ' to ' + voucher.ratesConfirmedTo : ''}`}</div>
          )}
        </div>
        <div className="mt-4 text-[13px]">
          <div>Special Notes : {voucher.voucherLines[0]?.remarks}</div>
          {voucher.status === 'amended' && (
            <div>Reason for amendment : {voucher.reasonToAmend}</div>
          )}
          {voucher.status === 'cancelled' && (
            <div>Reason for cancellation : {voucher.id}</div>
          )}
        </div>
        <div className="mt-10 text-[13px]">
          <div>Printed Date : {format(Date.now(), "dd/MM/yyyy")}</div>
          <div>Prepared By : {user?.fullName ?? ""}</div>
          <div>Contact Number : {(user?.publicMetadata as any)?.info?.contact ?? ""}</div>
          <div>This is a computer generated Voucher & does not require a signature</div>
        </div>
      </div>
      <div className="h-8 w-full bg-primary-green"></div>
    </div>
  );
};

export default HotelVoucherView;
