"use client";
import { format } from "date-fns";
import { RestaurantVoucherData } from "..";
import VoucherHeader from "~/components/common/voucher/VoucherHeader";
import { Country } from "country-state-city";
import { OrganizationResource, UserResource } from "@clerk/types";
import { useEffect } from "react";

type RestaurantVoucherPDFProps = {
  voucher: RestaurantVoucherData;
  bookingName: string
  organization: OrganizationResource;
  currency: string;
  user: UserResource
  cancellation?: boolean
};

const RestaurantVoucherView = ({ voucher, cancellation, bookingName, organization, user, currency }: RestaurantVoucherPDFProps) => {

  useEffect(() => {
    console.log('voucher', voucher)
  }
  , [voucher])

  return (
    <div className="flex flex-col border">
      <VoucherHeader organization={organization} />
      <div className="p-4">
        <div className="w-full text-center" style={{ fontWeight: 'bold', fontSize: '20px' }}>
          {voucher.status === "cancelled" || cancellation ? (<div className="text-red-500">Cancellation Voucher</div>) : `Restaurant Reservation Voucher${voucher.status === 'amended' ? ' - Amendment' : ''}`}

        </div>
        <div className="flex w-full flex-row justify-between">
          <div className="text-[13px]">
            {/* <div>Bill to : {organization?.name}</div> */}
            <div>Voucher ID : {voucher?.id + `${voucher.status === "amended" ? `/a${voucher.amendedCount}` : ''}`}</div>
            <div>Tour ID : {voucher.bookingLineId}</div>
            <div>Restaurant Name : {voucher?.restaurant.name}</div>
            <div>Booking Name : {bookingName}</div>
            <div>
              Nationality : {Country.getCountryByCode(voucher.bookingLineId.split("-")[1]?.split("-")[0] ?? "")?.name}
            </div>
          </div>
        </div>

        <div className="mt-4 text-[13px]">
          <table className="min-w-full rounded-md border bg-white">
            <thead>
              <tr className="border-b ">
                <th className="px-4 py-2 text-left font-semibold">
                  Date
                </th>
                <th className="px-4 py-2 text-left font-semibold">Meal</th>
                <th className="px-4 py-2 text-left font-semibold">Adults</th>
                <th className="px-4 py-2 text-left font-semibold">Kids</th>
                <th className="px-4 py-2 text-left font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {voucher.voucherLines?.map((line, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{line.date ?? "N/A"}</td>
                  <td className="px-4 py-2">{line.mealType ?? "N/A"}</td>
                  <td className="px-4 py-2">{line.adultsCount ?? "N/A"}</td>
                  <td className="px-4 py-2">{line.kidsCount ?? "N/A"}</td>
                  <td className="px-4 py-2">{line.rate ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex w-full flex-row justify-end p-4 text-[13px] font-semibold">
          {`Total(${currency}) - ${voucher.voucherLines[0]?.rate ?? 0}`}
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
            <div>Reason for cancellation : {voucher.reasonToCancel}</div>
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

export default RestaurantVoucherView;
