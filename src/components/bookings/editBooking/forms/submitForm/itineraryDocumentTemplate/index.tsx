"use client";
import { format } from "date-fns";
import VoucherHeader from "~/components/common/voucher/VoucherHeader";
import { formatDate, getLetterByIndex } from "~/lib/utils/index";
import { Country } from "country-state-city";
import { OrganizationResource, UserResource } from "@clerk/types";
import { BookingDetails, BookingSummary } from "~/app/dashboard/bookings/[id]/edit/context";
import { BookingLineWithAllData } from "~/lib/types/booking";
import { BookingSummaryTable } from "./summaryTable";

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

const ItineraryDocument = ({ summary, booking, bookingLineId, organization, user, agentAndManager }: SummaryDocumentProps) => {

    return (
        <div className="flex flex-col">
            <VoucherHeader organization={organization} />
            <div className="p-4">
                <div className="w-full text-center" style={{ fontWeight: 'bold', fontSize: '20px' }}>
                    Tour Itinerary
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

                    <BookingSummaryTable summary={summary} />

                    {/* <div>
                        {`Hotels have been booked for ${summary.filter(s => s.hotel !== null).length} days out of ${summary.length} days`}
                    </div> */}
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

export default ItineraryDocument;
