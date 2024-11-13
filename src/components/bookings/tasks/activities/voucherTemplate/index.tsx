"use client";
import { useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import Image from "next/image";
import { useOrganization } from "~/app/dashboard/context";
import LoadingLayout from "~/components/common/dashboardLoading";
import { ActivityVoucherData } from "..";

type ActivityVoucherPDFProps = {
  vouchers: ActivityVoucherData[];
  cancellation?: boolean;
};

const ActivityVoucherPDF = ({ vouchers, cancellation }: ActivityVoucherPDFProps) => {
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
          {cancellation ? (
            <div className="text-red-500">Activity Cancellation Voucher</div>
          ) : (
            "Activity Voucher"
          )}
        </div>

        <div className="flex w-full flex-row justify-between">
          <div className="text-[13px]">
            <div>Booking Line ID: {vouchers[0]?.bookingLineId ?? "N/A"}</div>
            <div>Activity: {vouchers[0]?.activityName ?? "N/A"}</div>
            <div>Participants: {`Adults - ${vouchers[0]?.adultsCount ?? "N/A"} | Kids - ${vouchers[0]?.kidsCount ?? "N/A"}`}</div>
          </div>
        </div>

        <div className="mt-4 text-[13px]">
          <table className="min-w-full rounded-md border bg-white">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left font-semibold">Vendor</th>
                <th className="px-4 py-2 text-left font-semibold">City</th>
                <th className="px-4 py-2 text-left font-semibold">Date</th>
                <th className="px-4 py-2 text-left font-semibold">Time</th>
                <th className="px-4 py-2 text-left font-semibold">Participants</th>
                <th className="px-4 py-2 text-left font-semibold">Remarks</th>
                <th className="px-4 py-2 text-left font-semibold">Status</th>
                <th className="px-4 py-2 text-left font-semibold">Seal & Signature</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map((v) => {
                if(v.status !== 'cancelled'){
                  return (
                    <tr className="border-b hover:bg-gray-50 h-36" key={v.id}>
                      <td className="px-4 py-2">{v.activityVendor.name?? "N/A"}</td>
                      <td className="px-4 py-2">{v.city ?? "N/A"}</td>
                      <td className="px-4 py-2">{v.date ?? "N/A"}</td>
                      <td className="px-4 py-2">{v.time ?? "N/A"}</td>
                      <td className="px-4 py-2">{`Adults - ${vouchers[0]?.adultsCount ?? "N/A"} | Kids - ${vouchers[0]?.kidsCount ?? "N/A"}`}</td>
                      <td className="px-4 py-2">{v.remarks ?? "N/A"}</td>
                      <td className="px-4 py-2"></td>
                    </tr>
                  );
                }

              })}
            </tbody>
          </table>
        </div>

        <div className="mt-10 text-[13px]">
          <div>Date: {format(Date.now(), 'dd/MM/yyyy')}</div>
          <div>Prepared By: {user?.fullName ?? ""}</div>
          <div>This is a computer generated Voucher & does not require a signature</div>
        </div>
      </div>
      <div className="h-8 w-full bg-primary-green"></div>
    </div>
  );
};

export default ActivityVoucherPDF;
