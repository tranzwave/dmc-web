"use client";
import { useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import Image from "next/image";
import { useState } from "react"; // Import useState
import { useOrganization } from "~/app/dashboard/context";
import LoadingLayout from "~/components/common/dashboardLoading";
import { TransportVoucherData } from ".."; // Assuming TransportVoucherData is defined in the schema types
import VoucherHeader from "~/components/common/voucher/VoucherHeader";
import { BookingLineWithAllData } from "~/lib/types/booking";
import { OrganizationResource, UserResource } from "@clerk/types";
import { TransportVoucher } from "~/app/dashboard/bookings/[id]/edit/context";

type TransportVoucherPDFProps = {
  voucher: TransportVoucher;
  bookingData: BookingLineWithAllData;
  organization: OrganizationResource;
  user: UserResource
  cancellation?: boolean;
};

const DriverTransportVoucherPDF = ({
  voucher,
  cancellation,
  bookingData,
  organization,
  user
}: TransportVoucherPDFProps) => {
  const [dynamicName, setDynamicName] = useState(""); // State for dynamic name

  return (
    <div className="flex flex-col border">
      <VoucherHeader organization={organization} />

      <div className="p-4">
      <div className="w-full text-center" style={{ fontWeight: 'bold', fontSize: '20px' }}>
          {cancellation ? (
            <div className="text-red-500">Cancellation Voucher</div>
          ) : (
            "Transport Log Sheet"
          )}
        </div>
        <div className="flex w-full flex-row justify-between">
          {/* Tour Details */}
          <div className="text-[13px]">
            <div>Tour ID: {voucher.voucher.bookingLineId}</div>
            <div>Booking Name: {bookingData.booking.client.name}</div>
            <div>Transport Type : {voucher.driver?.type}</div>
            <div>Vehicle Type : {voucher.driverVoucherLine?.vehicleType}</div>
            <div>Driver Name : {voucher.driver?.name}</div>
            <div>No of Pax: {`${bookingData.adultsCount} Adults | ${bookingData.kidsCount} Kids`}</div>
            <div>Language : {voucher.voucher.language}</div>
          </div>

          <div className="text-[13px]">
            <div>Voucher ID : {voucher.voucher.id}</div>
            <div className="font-bold">Flight Details</div>
            <div>
              Arrival by: {voucher.voucher.startDate}
            </div>
            <div>
              Departure by: {voucher.voucher.endDate}
            </div>
          </div>
        </div>

        <div className="mt-4 text-[13px]">
          <table className="min-w-full rounded-md border bg-white">
            <thead>
              <tr className="border-b">
                <th className="border-r px-4 py-2 text-left font-semibold">
                  Date
                </th>
                <th className="border-r px-4 py-2 text-left font-semibold">
                  Day by Day Running Details
                </th>
                <th className="border-r px-4 py-2 text-left font-semibold">
                  Start
                </th>
                <th className="border-r px-4 py-2 text-left font-semibold">
                  End
                </th>
                <th className="px-4 py-2 text-left font-semibold">Kms</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(15)].map((_, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="border-r px-4 py-2"></td>
                  <td className="border-r px-4 py-2"></td>
                  <td className="border-r px-4 py-2"></td>
                  <td className="border-r px-4 py-2"></td>
                  <td className="px-4 py-2"></td>
                </tr>
              ))}
              <tr className="border-b">
                <td
                  colSpan={4}
                  className="border-r px-4 py-2 text-right font-semibold"
                >
                  Total Kms:
                </td>
                <td className="px-4 py-2 font-semibold">
                  {" "}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* 
        <div className="flex w-full flex-row justify-end p-4 text-[13px] font-semibold">
          Total -
        </div> */}

        <div className="mt-4 w-full border border-black p-4 text-[12px]">
          <div>
            Total KMS: <span>......................</span> x
            <span>.............................</span> per kms =
            <span>.............................</span>
          </div>

          <div className="mt-2">
            BATTA: <span>......................</span> per night x
            <span>.............................</span> nights =
            <span>.............................</span>
          </div>

          <div className="mt-2">
            Other Expenses: <span>.............................</span>
          </div>

          <div className="mt-4 font-bold">
            TOTAL PAYABLE: <span>.............................</span>
          </div>

          <div className="mt-2 text-xs">
            NOTE: ALL ENTRANCE TICKETS, PARKING TICKETS, SHOPPING VOUCHERS,
            GUEST FEEDBACK, AND ALL OTHER PAYMENT RECEIPTS SHOULD BE ATTACHED.
          </div>

          <div className="mt-4 flex justify-between">
            <div className="text-center">
              <div>...........................</div>
              Driver
            </div>

            <div className="text-center">
              <div>...........................</div>
              <input
                type="text"
                value={dynamicName}
                onChange={(e) => setDynamicName(e.target.value)} // Update dynamic name on change
                className="h-10 bg-transparent text-center focus:outline-none"
                placeholder="Enter Name"
              />
            </div>

            <div className="text-center">
              <div>...........................</div>
              Finance Department
            </div>
          </div>
        </div>

        <div className="mt-10 text-[13px]">
          <div>Printed Date : {format(Date.now(), "dd/MM/yyyy")}</div>
          <div>Prepared By : {user?.fullName ?? ""}</div>
          <div>Contact Number : {(user?.publicMetadata as any)?.info?.contact ?? ""}</div>
          {/* <div className="text-[12px] text-center text-gray-700">This is a computer generated Voucher & does not require a signature</div> */}
        </div>
      </div>
    </div>
  );
};

export default DriverTransportVoucherPDF;
