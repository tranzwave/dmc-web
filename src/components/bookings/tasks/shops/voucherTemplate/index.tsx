"use client";
import { useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import Image from "next/image";
import { useOrganization } from "~/app/dashboard/context";
import LoadingLayout from "~/components/common/dashboardLoading";
import { ShopVoucherData } from "..";
import VoucherHeader from "~/components/common/voucher/VoucherHeader";
import { formatDate } from "~/lib/utils/index";
import { OrganizationResource, UserResource } from "@clerk/types";

type ShopVoucherPDFProps = {
  vouchers: ShopVoucherData[];
  organization: OrganizationResource;
  user: UserResource
  cancellation?: boolean;
};

const ShopVoucherPDF = ({ vouchers, cancellation, organization, user }: ShopVoucherPDFProps) => {

  console.log(vouchers)

  return (
    <div className="flex flex-col border">
      <VoucherHeader organization={organization}/>
      <div className="p-4">
        <div className="card-title w-full text-center">
          {cancellation ? (
            <div className="text-red-500">Shop Cancellation Voucher</div>
          ) : (
            "Amount of Sales"
          )}
        </div>

        <div className="flex w-full flex-row justify-between">
          <div className="text-[13px]">
            {/* <div>Booking Name: {vouchers[0]?.client?.name ?? "N/A"}</div> */}
            <div>Tour ID: {vouchers[0]?.bookingLineId ?? "N/A"}</div>
            <div>Participants: {`Adults - ${vouchers[0]?.adultsCount ?? "N/A"} | Kids - ${vouchers[0]?.kidsCount ?? "N/A"}`}</div>
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
                return (
                  <tr className="border-b hover:bg-gray-50 h-36" key={index}>
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

        <div className="mt-10 text-[13px]">
          <div>Printed Date : {format(Date.now(), "dd/MM/yyyy")}</div>
          <div>Prepared By : {user?.fullName ?? ""}</div>
          <div>Contact Number : {(user?.publicMetadata as any)?.info?.contact ?? ""}</div>
          <div className="text-[12px] text-center text-gray-700">This is a computer generated Voucher & does not require a signature</div>
        </div>
      </div>
      <div className="h-8 w-full bg-primary-green"></div>
    </div>
  );
};

export default ShopVoucherPDF;
