"use client";
import { format } from "date-fns";
import VoucherHeader from "~/components/common/voucher/VoucherHeader";
import { formatDate, getLetterByIndex } from "~/lib/utils/index";
import { Country } from "country-state-city";
import { OrganizationResource, UserResource } from "@clerk/types";
import { BookingDetails, BookingSummary } from "~/app/dashboard/bookings/[id]/edit/context";
import { BookingLineWithAllData } from "~/lib/types/booking";

type SummaryDocumentProps = {
  summary: BookingSummary[];
  bookingLineId: string;
  booking: BookingDetails;
  organization: OrganizationResource;
  user: UserResource,
  agentAndManager: {
    agent: string;
    manager: string;
  };
};

const SummaryDocument = ({ summary, booking, bookingLineId, organization, user, agentAndManager }: SummaryDocumentProps) => {

  return (
    <div className="flex flex-col">
      <VoucherHeader organization={organization} />
      <div className="p-4">
        <div className="w-full text-center" style={{ fontWeight: 'bold', fontSize: '20px' }}>
          Tour Summary
        </div>

        <div className="flex w-full flex-row justify-between">
          <div className="text-[13px]">
            <div>Tour ID : {bookingLineId}</div>
            <div>Agent : {agentAndManager.agent}</div>
            <div>Start Date : {formatDate(booking.general.startDate)}</div>
            <div>End Date : {formatDate(booking.general.endDate)}</div>
            <div>Days : {booking.general.numberOfDays}</div>
          </div>
          <div className="text-[13px]">
            <div>Booking Name : {booking.general.clientName}</div>
            <div>Nationality : {Country.getCountryByCode(bookingLineId.split("-")[1]?.split("-")[0] ?? "")?.name}</div>
            <div>Handled By : {agentAndManager.manager}</div>
            {/* find a guide from transport vouchers and show his name */}
            <div>Guide : {booking.transport?.find(t => t.guide)?.guide?.name ?? "Not Assigned"}</div>
            {/* find a driver from vouchers and show his name */}
            <div>Driver : {booking.transport?.find(t => t.driver)?.driver?.name ?? "Not Assigned"}</div>
          </div>
        </div>
        <div className="mt-4 text-[13px] mx-auto">
          <div className="w-full font-medium text-[14px] underline underline-offset-2">
            Accommodation & Meal Plan
          </div>
          <table className="max-w-full rounded-md border bg-white mt-4">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left font-semibold">Hotel Name</th>
                <th className="px-4 py-2 text-left font-semibold">Voucher No</th>
                <th className="px-4 py-2 text-left font-semibold">Date</th>
                <th className="px-4 py-2 text-left font-semibold">Room Type</th>
                <th className="px-4 py-2 text-left font-semibold">Rooms</th>
                <th className="px-4 py-2 text-left font-semibold">Confirm No</th>
                <th className="px-4 py-2 text-left font-semibold whitespace-nowrap">Confirmed By</th>
              </tr>
            </thead>
            <tbody>
              {booking.vouchers.map((voucher) =>
                voucher.voucherLines.map((line, index) => (
                  <tr className="border-b hover:bg-gray-50" key={line.id}>
                    {index === 0 && (
                      <>
                        <td className="px-4 py-2" rowSpan={voucher.voucherLines.length}>
                          {voucher.hotel?.name ?? "N/A"}
                        </td>
                        <td className="px-4 py-2" rowSpan={voucher.voucherLines.length}>
                          {voucher.voucher.id}
                        </td>
                      </>
                    )}

                    <td className="px-4 py-2">
                      {format(new Date(line.checkInDate), 'dd/MM/yyyy')}
                      <br /> to <br />
                      {format(new Date(line.checkOutDate), 'dd/MM/yyyy')}
                    </td>

                    <td className="px-4 py-2 whitespace-nowrap">
                      {`${line.roomType} - ${line.roomCategory} - ${line.basis}`}
                    </td>

                    <td className="px-4 py-2">{line.roomCount}</td>

                    {index === 0 && (
                      <>
                        <td className="px-4 py-2" rowSpan={voucher.voucherLines.length}>
                          {voucher.voucher.status === "vendorConfirmed"
                            ? voucher.voucher.confirmationNumber
                            : "Not Confirmed"}
                        </td>
                        <td className="px-4 py-2" rowSpan={voucher.voucherLines.length}>
                          {voucher.voucher.availabilityConfirmedBy ?? "N/A"}
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* <div>
            {`Hotels have been booked for ${summary.filter(s => s.hotel !== null).length} days out of ${summary.length} days`}
          </div> */}
        </div>

        <div className="mt-4 text-[13px]">
          <div className="font-medium text-[14px] underline underline-offset-2">
            Transportation & Guide
          </div>
          <div className="mt-4 text-[13px] grid grid-cols-1 gap-4">
            {/* Driver Details Table */}
            {booking.transport?.length > 0 && booking.transport.some(t => t.driver) && (
              <table className="w-full border bg-white text-center">
                <thead>
                  <tr>
                    <th colSpan={4} className="border font-semibold py-2">Driver Details</th>
                  </tr>
                  <tr>
                    <th className="border px-2 py-1">Driver Name</th>
                    <th className="border px-2 py-1">Vehicle Type</th>
                    <th className="border px-2 py-1">Vehicle No</th>
                    <th className="border px-2 py-1">License No</th>
                  </tr>
                </thead>
                <tbody>
                  {booking.transport?.map((transport) => {
                    if (transport.driver) {
                      return (
                        <tr key={transport.voucher.id}>
                          <td className="border px-2 py-1">{transport.driver.name}</td>
                          <td className="border px-2 py-1">{transport.driverVoucherLine?.vehicleType}</td>
                          <td className="border px-2 py-1">{ }</td>
                          <td className="border px-2 py-1">{transport.driver.driversLicense}</td>
                        </tr>
                      );
                    }

                  }
                  )}
                </tbody>
              </table>
            )}

            {/* Guide Details Table */}
            {booking.transport?.length > 0 && booking.transport.some(t => t.guide) && (
              <table className="w-full border bg-white text-center">
                <thead>
                  <tr>
                    <th colSpan={4} className="border  font-semibold py-2">Guide Details</th>
                  </tr>
                  <tr>
                    <th className="border px-2 py-1">Guide Name</th>
                    <th className="border px-2 py-1">Language</th>
                    <th className="border px-2 py-1">License No</th>
                    <th className="border px-2 py-1">Mobile</th>
                  </tr>
                </thead>
                <tbody>
                  {booking.transport?.map((transport) => {
                    if (transport.guide) {
                      return (
                        <tr key={transport.voucher.id}>
                          <td className="border px-2 py-1">{transport.guide.name}</td>
                          <td className="border px-2 py-1">{transport.voucher.language}</td>
                          <td className="border px-2 py-1">{transport.guide.guideLicense}</td>
                          <td className="border px-2 py-1">{transport.guide.primaryContactNumber}</td>
                        </tr>
                      );
                    }
                  }
                  )}
                </tbody>
              </table>
            )}

            {/* Other Transport Details Table */}
            {booking.transport?.length > 0 && booking.transport.some(t => t.otherTransport) && (
              <table className="w-full border bg-white text-center">
                <thead>
                  <tr>
                    <th colSpan={4} className="border  font-semibold py-2">Other Transport Details</th>
                  </tr>
                  <tr>
                    <th className="border px-2 py-1">Transport Type</th>
                    <th className="border px-2 py-1">Vehicle Type</th>
                    <th className="border px-2 py-1">Vehicle No</th>
                    <th className="border px-2 py-1">License No</th>
                  </tr>
                </thead>
                <tbody>
                  {booking.transport?.map((transport) => {
                    if (transport.otherTransport) {
                      return (
                        <tr key={transport.voucher.id}>
                          <td className="border px-2 py-1">{transport.otherTransport.name}</td>
                          <td className="border px-2 py-1">{transport.otherTransport.vehicleType}</td>
                          <td className="border px-2 py-1">{ }</td>
                          <td className="border px-2 py-1">{ }</td>
                        </tr>
                      );
                    }
                  }
                  )}
                </tbody>
              </table>
            )}
          </div>

        </div>

        <div className="mt-10 text-[13px]">
          <div>Printed Date: {format(Date.now(), 'dd/MM/yyyy')}</div>
          <div>Prepared By: {user?.fullName ?? ""}</div>
          <div>Contact Number : {(user?.publicMetadata as any)?.info?.contact ?? ""}</div>

          {/* <div className="text-[12px] text-center text-gray-700">This is a computer generated Voucher & does not require a signature</div> */}

        </div>
      </div>
      {/* <div className="h-8 w-full bg-primary-green"></div> */}
    </div>
  );
};

export default SummaryDocument;
