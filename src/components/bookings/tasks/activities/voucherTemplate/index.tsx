"use client";
import { useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import Image from "next/image";
import { useOrganization } from "~/app/dashboard/context";
import LoadingLayout from "~/components/common/dashboardLoading";
import { ActivityVoucherData } from "..";
import VoucherHeader from "~/components/common/voucher/VoucherHeader";
import { formatDate, getLetterByIndex } from "~/lib/utils/index";
import { Country } from "country-state-city";
import { OrganizationResource, UserResource } from "@clerk/types";

type ActivityVoucherPDFProps = {
  vouchers: ActivityVoucherData[];
  bookingName: string;
  organization: OrganizationResource;
  user: UserResource
  cancellation?: boolean;
};

const ActivityVoucherPDF = ({ vouchers, cancellation, bookingName, organization, user }: ActivityVoucherPDFProps) => {

  return (
    <div className="flex flex-col border">
      <VoucherHeader organization={organization} />
      <div className="p-4">
        <div className="card-title w-full text-center">
          Activities by Date
        </div>

        <div className="flex w-full flex-row justify-between">
          <div className="text-[13px]">
            <div>Tour ID : {vouchers[0]?.bookingLineId}</div>
            <div>Booking Name : {bookingName}</div>
            <div>
              Nationality : {Country.getCountryByCode(vouchers[0]?.bookingLineId.split("-")[1]?.split("-")[0] ?? "")?.name}
            </div>
          </div>
        </div>
        <div className="mt-4 text-[13px]">
          <table className="min-w-full rounded-md border bg-white">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left font-semibold">Vendor</th>
                <th className="px-4 py-2 text-left font-semibold">Activity</th>
                <th className="px-4 py-2 text-left font-semibold">City</th>
                <th className="px-4 py-2 text-left font-semibold">Date</th>
                <th className="px-4 py-2 text-left font-semibold">Time</th>
                <th className="px-4 py-2 text-left font-semibold">Participants</th>
                <th className="px-4 py-2 text-left font-semibold">Remarks</th>
                {/* <th className="px-4 py-2 text-left font-semibold">Status</th> */}
                <th className="px-4 py-2 text-left font-semibold">Seal & Signature</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map((v) => {
                if (v.status !== 'cancelled') {
                  return (
                    <tr className="border-b hover:bg-gray-50 h-36" key={v.id}>
                      <td className="px-4 py-2">{v.activityVendor.name ?? "N/A"}</td>
                      <td className="px-4 py-2">{v.activityName ?? "N/A"}</td>
                      <td className="px-4 py-2">{v.city ?? "N/A"}</td>
                      <td className="px-4 py-2">{formatDate(v.date) ?? "N/A"}</td>
                      <td className="px-4 py-2">{v.time ?? "N/A"}</td>
                      <td className="px-4 py-2">{`Adults - ${vouchers[0]?.adultsCount ?? "N/A"} | Kids - ${vouchers[0]?.kidsCount ?? "N/A"}`}</td>
                      <td className="px-4 py-2">{v.remarks ?? "N/A"}</td>
                      {/* <td className="px-4 py-2">{v.status ?? "N/A"}</td> */}
                    </tr>
                  );
                }

              })}
            </tbody>
          </table>
        </div>

        <div className="mt-10 text-[13px]">
          <div>Printed Date: {format(Date.now(), 'dd/MM/yyyy')}</div>
          <div>Prepared By: {user?.fullName ?? ""}</div>
          <div>Contact Number : {(user?.publicMetadata as any)?.info?.contact ?? ""}</div>

          <div className="text-[12px] text-center text-gray-700">This is a computer generated Voucher & does not require a signature</div>
          
        </div>
      </div>
      <div className="h-8 w-full bg-primary-green"></div>
    </div>
  );
};

export default ActivityVoucherPDF;
