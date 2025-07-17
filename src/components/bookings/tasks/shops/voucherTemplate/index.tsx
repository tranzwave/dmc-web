"use client";
import { format } from "date-fns";
import { ShopVoucherData } from "..";
import VoucherHeader from "~/components/common/voucher/VoucherHeader";
import { formatDate } from "~/lib/utils/index";
import { OrganizationResource, UserResource } from "@clerk/types";
import { BookingLineWithAllData } from "~/lib/types/booking";

type ShopVoucherPDFProps = {
  vouchers: ShopVoucherData[];
  organization: OrganizationResource;
  user: UserResource;
  bookingData:BookingLineWithAllData;
  cancellation?: boolean;
};

const ShopVoucherPDF = ({ vouchers, cancellation, organization, user, bookingData }: ShopVoucherPDFProps) => {

  console.log(vouchers)

  const driverNames = bookingData.transportVouchers.map((v) => v.driver?.name).filter((v) => v);
  const guideNames = bookingData.transportVouchers.map((v) => v.guide?.name).filter((v) => v);

  return (
    <div className="flex flex-col border">
      <VoucherHeader organization={organization}/>
      <div className="p-4">
      <div className="w-full text-center" style={{ fontWeight: 'bold', fontSize: '20px' }}>
          {cancellation ? (
            <div className="text-red-500">Shop Cancellation Voucher</div>
          ) : (
            "Shopping Voucher"
          )}
        </div>

        <div className="flex w-full flex-row justify-between">
          <div className="text-[12px]">
            {/* <div>Booking Name: {vouchers[0]?.client?.name ?? "N/A"}</div> */}
            <div>Tour ID: {vouchers[0]?.bookingLineId ?? "N/A"}</div>
            <div>Booking Name: {bookingData.booking.client.name}</div>
            <div>Participants: {`Adults - ${vouchers[0]?.adultsCount ?? "N/A"} | Kids - ${vouchers[0]?.kidsCount ?? "N/A"}`}</div>
          </div>

          <div>
            {driverNames.length > 0 && <div className="text-[12px]">Drivers: {driverNames.join(" | ")}</div>}
            {guideNames.length > 0 && <div className="text-[12px]">Guides: {guideNames.join(" | ")}</div>}
          </div>
        </div>

        <div className="mt-4 text-[13px]">
          <table className="min-w-full rounded-md border bg-white">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left font-semibold">Shop</th>
                <th className="px-4 py-2 text-left font-semibold">City</th>
                <th className="px-4 py-2 text-left font-semibold">Date</th>

                <th className="px-4 py-2 text-left font-semibold">
                  Amount of Sale
                </th>
                <th className="px-4 py-2 text-left font-semibold">
                  Seal & Signature
                </th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map((v,index) => {
                if(v.status === "cancelled") return null;
                return (
                  <tr className="border-b hover:bg-gray-50 h-36 text-[12px]" key={index}>
                    <td className="px-4 py-2">{v.shop.name ?? "N/A"}</td>
                    <td className="px-4 py-2">{v.city ?? "N/A"}</td>

                    <td className="px-4 py-2">{formatDate(v.date) ?? "N/A"}</td>

                    <td className="px-4 py-2"></td>
                    <td className="px-4 py-2"></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-10 text-[12px]">
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

export default ShopVoucherPDF;
