"use client";
import { useUser } from "@clerk/nextjs";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { useOrganization } from "~/app/dashboard/context";
import LoadingLayout from "~/components/common/dashboardLoading";
import { ShopVoucherData } from "..";

type ShopVoucherPDFProps = {
    voucher: ShopVoucherData;
    cancellation?: boolean;
};

const ShopVoucherPDF = ({ voucher, cancellation }: ShopVoucherPDFProps) => {
    const organization = useOrganization();
    const { isLoaded, user } = useUser();
  
    if (!isLoaded) {
      return <LoadingLayout />;
    }
  
    const shopVoucherColumns: ColumnDef<ShopVoucherData>[] = [
      {
        header: "Shop Name",
        accessorFn: (row) => row.shop.name ?? "N/A",
      },
      {
        header: "Participants Count",
        accessorFn: (row) => row.participantsCount,
      },
      {
        header: "Date",
        accessorFn: (row) => row.date,
      },
      {
        header: "Time",
        accessorFn: (row) => row.time,
      },
      {
        header: "Remarks",
        accessorFn: (row) => row.remarks ?? "N/A",
      },
      {
        header: "Rate",
        accessorFn: (row) => row.rate ?? 0,
      },
    ];
  
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
              <div className="text-red-500">Shop Cancellation Voucher</div>
            ) : (
              'Shopping Voucher'
            )}
          </div>
  
          <div className="flex w-full flex-row justify-between">
            <div className="text-[13px]">
              <div>Client Name: {voucher.client?.name ?? "N/A"}</div> {/* Display Client Name */}
              <div>Tour ID: {voucher.bookingLineId}</div>
              <div>Participants: {voucher.participantsCount}</div>
            </div>
            <div className="text-[13px]">
              <div>Date: {voucher.date}</div>
              <div>Time: {voucher.time}</div>
              <div>Hours: {voucher.hours}</div>
            </div>
          </div>
  
          <div className="mt-4 text-[13px]">
            <table className="min-w-full rounded-md border bg-white">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left font-semibold">Shop</th>
                  <th className="px-4 py-2 text-left font-semibold">Amount of Sale</th>
                  <th className="px-4 py-2 text-left font-semibold">Seal & Signature</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{voucher.shop.name ?? "N/A"}</td>
                  <td className="px-4 py-2">{voucher.participantsCount}</td>
                  <td className="px-4 py-2"></td>
                </tr>
              </tbody>
            </table>
          </div>
  
          <div className="flex w-full flex-row justify-end p-4 text-[13px] font-semibold">
            {`Total (USD) - ${voucher.rate ?? "0.00"}`}
          </div>
          <div className="mt-4 text-[13px]">
            <div>Special Notes: {voucher.remarks}</div>
          </div>
          <div className="mt-10 text-[13px]">
            <div>Date & Time: {new Date().toISOString()}</div>
            <div>Prepared By: {user?.fullName ?? ""}</div>
          </div>
        </div>
        <div className="h-8 w-full bg-primary-green"></div>
      </div>
    );
  };
  
  export default ShopVoucherPDF;
  
