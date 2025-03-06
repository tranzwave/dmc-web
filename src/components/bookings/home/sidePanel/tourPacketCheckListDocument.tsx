"use client";
import { useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import Image from "next/image";
import { useOrganization } from "~/app/dashboard/context";
import LoadingLayout from "~/components/common/dashboardLoading";
import VoucherHeader from "~/components/common/voucher/VoucherHeader";
import { formatDate } from "~/lib/utils/index";
import { OrganizationResource, UserResource } from "@clerk/types";
import { BookingDTO } from "../columns";
import { useEffect } from "react";

type TourPacketChecklistDocumentProps = {
  organization: OrganizationResource;
  user: UserResource;
  bookingData:BookingDTO;
};

const TourPacketCheckListPDF = ({ organization, user, bookingData }: TourPacketChecklistDocumentProps) => {

  console.log(bookingData.tourPacket)

  useEffect(() => {
    console.log("refetching tour packet checklist");
  }
  , [bookingData]);

  return (
    <div className="flex flex-col border text-lg">
      <VoucherHeader organization={organization}/>
      <div className="p-4">
        <div className="card-title w-full text-center text-[15px] font-bold">
          Tour Packet - Checklist
        </div>

        <div className="flex w-full flex-row justify-between">
          <div className="text-[13px]">
            {/* <div>Booking Name: {vouchers[0]?.client?.name ?? "N/A"}</div> */}
            <div>Tour ID: {bookingData.id ?? "N/A"}</div>
            <div>Booking Name: {bookingData.booking.client.name}</div>
            <div>Participants: {`Adults - ${bookingData.adultsCount ?? "N/A"} | Kids - ${bookingData.kidsCount ?? "N/A"}`}</div>
          </div>
        </div>
        <div>Documents</div>
        <div className="mt-4 text-[13px]">
          <table className="min-w-full rounded-md border bg-white">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left font-semibold">No.</th>
                <th className="px-4 py-2 text-left font-semibold">Document</th>
                <th className="px-4 py-2 text-left font-semibold">Check</th>
              </tr>
            </thead>
            <tbody>
              {bookingData.tourPacket?.documents.map((d,index) => {
                return (
                  <tr className="border-b hover:bg-gray-50" key={index}>
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{d.item ?? "N/A"}</td>
                    <td className="px-4 py-2">{d.count ?? "N/A"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div>Tour Accessories</div>
        <div className="mt-4 text-[13px]">
          <table className="min-w-full rounded-md border bg-white">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left font-semibold">No.</th>
                <th className="px-4 py-2 text-left font-semibold">Accessory</th>
                <th className="px-4 py-2 text-left font-semibold">Check</th>
              </tr>
            </thead>
            <tbody>
              {bookingData.tourPacket?.accessories.map((a,index) => {
                return (
                  <tr className="border-b hover:bg-gray-50" key={index}>
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{a.item ?? "N/A"}</td>
                    <td className="px-4 py-2">{a.count ?? "N/A"}</td>
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
          {/* <div className="text-[12px] text-center text-gray-700">This is a computer generated Voucher & does not require a signature</div> */}
        </div>
      </div>
      {/* <div className="h-8 w-full bg-primary-green"></div> */}
    </div>
  );
};

export default TourPacketCheckListPDF;
