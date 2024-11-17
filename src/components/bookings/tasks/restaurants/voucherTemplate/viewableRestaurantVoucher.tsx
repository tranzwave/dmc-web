"use client";
import { useUser } from "@clerk/nextjs";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import Image from "next/image";
import { useOrganization } from "~/app/dashboard/context";
import LoadingLayout from "~/components/common/dashboardLoading";
import {
  SelectHotelVoucher,
  SelectHotelVoucherLine,
} from "~/server/db/schemaTypes";
import { RestaurantVoucherData } from "..";

type RestaurantVoucherPDFProps = {
  voucher: RestaurantVoucherData;
  cancellation?:boolean
};

const RestaurantVoucherView = ({ voucher,cancellation }: RestaurantVoucherPDFProps) => {
  const organization = useOrganization();
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return <LoadingLayout />;
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
        <div className="text-[13px] text-white">Address will be shown here</div>
      </div>
      <div className="p-4">
        <div className="card-title w-full text-center">
            {cancellation ? (<div className="text-red-500">Cancellation Voucher</div>): 'Restaurant Reservation Voucher'}
          
        </div>
        <div className="flex w-full flex-row justify-between">
          <div className="text-[13px]">
            {/* <div>Bill to : {organization?.name}</div> */}
            <div>Hotel Name : {voucher?.restaurant.name}</div>
            <div>Tour ID : {voucher.bookingLineId}</div>
            <div>
              Country : {voucher.bookingLineId.split("-")[1]?.split("-")[0]}
            </div>
            <div>{`Adults : ${voucher.voucherLines[0]?.adultsCount}`}</div>
            <div>{`Kids : ${voucher.voucherLines[0]?.kidsCount}`}</div>
          </div>
          <div className="text-[13px]">
            <div>Voucher ID : {voucher?.voucherLines[0]?.id}</div>
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
          {`Total(USD) - ${voucher.voucherLines[0]?.rate ?? 0}`}
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
        </div>
        <div className="mt-10 text-[13px]">
          <div>Printed Date : {format(Date.now(), "dd/MM/yyyy")}</div>
          <div>Prepared By : {user?.fullName ?? ""}</div>
          <div>This is a computer generated Voucher & does not require a signature</div>
        </div>
      </div>
      <div className="h-8 w-full bg-primary-green"></div>
    </div>
  );
};

export default RestaurantVoucherView;
