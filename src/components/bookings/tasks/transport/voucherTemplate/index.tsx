"use client";
import { useUser } from "@clerk/nextjs";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import Image from "next/image";
import { useOrganization } from "~/app/dashboard/context";
import LoadingLayout from "~/components/common/dashboardLoading";
import { TransportVoucherData } from ".."; // Assuming TransportVoucherData is defined in the schema types

type TransportVoucherPDFProps = {
  voucher: TransportVoucherData;
  cancellation?: boolean;
};

const TransportVoucherPDF = ({
  voucher,
  cancellation,
}: TransportVoucherPDFProps) => {
  const organization = useOrganization();
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return <LoadingLayout />;
  }

  const transportDetailsColumns: ColumnDef<TransportVoucherData>[] = [
    {
      header: "Date",
      accessorFn: (row) => row.driver.name ?? "N/A", // Assuming driverName is part of the voucher data
    },
    {
      header: "Day by Day Running Details",
    },
    {
      header: "Start",
    },
    {
      header: "End",
    },
    {
      header: "Kms",
    },
    {
      header: "Remarks",
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
            <div className="text-red-500">Cancellation Voucher</div>
          ) : (
            "Transport Log Sheet"
          )}
        </div>
        <div className="flex w-full flex-row justify-between">
          <div className="text-[13px]">
            <div>Bill to : {organization?.name}</div>
            <div>Client Name: {voucher.client?.name ?? "N/A"}</div>
            <div>Tour ID : {voucher.bookingLineId}</div>
            <div>Driver ID : {voucher.driverId}</div>
            <div>Vehicle Type : {voucher.vehicleType}</div>
            <div>Language : {voucher.language}</div>
          </div>
          <div className="text-[13px]">
            <div>Voucher ID : {voucher.id}</div>
          </div>
        </div>

        <div className="mt-4 text-[13px]">
          <table className="min-w-full rounded-md border bg-white">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left font-semibold">Date</th>
                <th className="px-4 py-2 text-left font-semibold">
                  Day by Day Running Details
                </th>
                <th className="px-4 py-2 text-left font-semibold">Start</th>
                <th className="px-4 py-2 text-left font-semibold">End</th>
                <th className="px-4 py-2 text-left font-semibold">Kms</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(15)].map((_, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2"></td>
                  <td className="px-4 py-2"></td>
                  <td className="px-4 py-2"></td>
                  <td className="px-4 py-2"></td>
                  <td className="px-4 py-2"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex w-full flex-row justify-end p-4 text-[13px] font-semibold">
          Total -
        </div>

        <div className="mt-4 w-full border border-black p-4 text-[13px]">
          <div>
            Total KMS: <span className="underline">......................</span>{" "}
            x<span className="underline">.............................</span>{" "}
            per kms =
            <span className="underline">.............................</span>
          </div>

          <div className="mt-2">
            BATTA: <span className="underline">......................</span> per
            night x
            <span className="underline">.............................</span>{" "}
            nights =
            <span className="underline">.............................</span>
          </div>

          <div className="mt-2">
            Other Expenses:{" "}
            <span className="underline">.............................</span>
          </div>

          <div className="mt-4 font-bold">
            TOTAL PAYABLE:{" "}
            <span className="underline">.............................</span>
          </div>

          <div className="mt-2 text-xs">
            NOTE: ALL ENTRANCE TICKETS, PARKING TICKETS, SHOPPING VOUCHERS,
            GUEST FEEDBACK, AND ALL OTHER PAYMENT RECEIPTS SHOULD BE ATTACHED.
          </div>

          <div className="mt-4 flex justify-between">
            <div className="text-center">
              <div className="underline">...........................</div>
              Driver
            </div>

            <div className="text-center">
              <div className="underline">...........................</div>
              Prabath Madhanayake
            </div>

            <div className="text-center">
              <div className="underline">...........................</div>
              Finance Department
            </div>
          </div>
        </div>

        <div className="mt-10 text-[13px]">
          <div>Date : {format(Date.now(), "dd/MM/yyyy")}</div>
          <div>Prepared By : {user?.fullName ?? ""}</div>
        </div>
      </div>
    </div>
  );
};

export default TransportVoucherPDF;
