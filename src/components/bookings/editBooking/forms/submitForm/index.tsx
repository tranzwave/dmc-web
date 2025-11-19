"use client";
import html2pdf from "html2pdf.js";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BookingDetails, BookingSummary, useEditBooking } from "~/app/dashboard/bookings/[id]/edit/context";
import { Button } from "~/components/ui/button";
import ContactBox from "~/components/ui/content-box";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import SummaryCard, { formatDateToWeekdayMonth } from "./summaryCard";

import './pdfStyles.css';
import { useOrganization, useUser } from "@clerk/nextjs";
import LoadingLayout from "~/components/common/dashboardLoading";
import VoucherButton from "~/components/bookings/tasks/hotelsTaskTab/taskTab/VoucherButton";
import SummaryDocument from "./summaryDocumentTemplate";
import { OrganizationMembershipResource, UserResource } from "@clerk/types";
import { SelectAgent } from "~/server/db/schemaTypes";
import { getAgentVendorById } from "~/server/db/queries/agents";
import ItineraryDocument from "./itineraryDocumentTemplate";

const AddBookingSubmitTab = () => {
  const { bookingDetails, getBookingSummary } = useEditBooking();
  const [showModal, setShowModal] = useState(false);
  const [showItineraryModal, setShowItineraryModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [id, setId] = useState("0");
  const pathname = usePathname();
  const router = useRouter();
  const summaryRef = useRef(null); // Ref to hold the summary section
  const [summary, setSummary] = useState<BookingSummary[]>([]);
  const { organization, isLoaded: isOrgLoaded } = useOrganization();
  const { isLoaded, user } = useUser();
  const [coordinatorAndManager, setCoordinatorAndManager] = useState<string[]>(['init-c', 'init-m'])
  const [members, setMembers] = useState<OrganizationMembershipResource[]>([]); // Correct type for members
  const [agent, setAgent] = useState<SelectAgent>();

  const fetchMembers = async () => {
    if (organization) {
      try {
        setLoading(true);
        const memberships = await organization.getMemberships();
        const agent = await getAgentVendorById(bookingDetails.general.agent ?? "");
        setMembers(memberships.data); // Set the 'items' array containing memberships
        console.log(memberships);
        setLoading(false);
        console.log(memberships)
        if (memberships && bookingDetails) {
          const manager = memberships?.data?.find(m => m.id === bookingDetails.general.marketingManager)
          const managerFullName = manager ? `${manager.publicUserData.firstName} ${manager.publicUserData.lastName}` : ''

          setCoordinatorAndManager(['', managerFullName])
        }
        if (agent) {
          setAgent(agent);
        }

      } catch (error) {
        console.error("Error fetching members:", error);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const bookingId = pathname.split('/')[3] ?? 'Unknown'
    setId(bookingId);
    const summary = getBookingSummary();
    setSummary(summary);

    if (isLoaded && bookingDetails) {
      fetchMembers();
    }
  }
    , []);
  // Helper to detect cancelled items in various voucher shapes
  const isCancelled = (item: any) => {
    if (!item) return false;
    const candidates: any[] = [];
    if (item.voucher) candidates.push(item.voucher.status, item.voucher.voucherStatus);
    if (item.voucherLines && item.voucherLines.length > 0) candidates.push(item.voucherLines[0].status, item.voucherLines[0].voucherStatus);
    if (item.status) candidates.push(item.status, item.voucherStatus);
    return candidates.some((c) => typeof c === "string" && /cancel/i.test(c));
  };

  // Produce a summary with cancelled vouchers removed for both preview and dialogs
  const filteredSummary: BookingSummary[] = summary.map((s) => {
    return {
      ...(s as any),
      hotel: s.hotel && !isCancelled(s.hotel) ? s.hotel : null,
      restaurants: Array.isArray(s.restaurants) ? s.restaurants.filter((r: any) => !isCancelled(r)) : [],
      activities: Array.isArray(s.activities) ? s.activities.filter((a: any) => !isCancelled(a)) : [],
      transport: Array.isArray(s.transport) ? s.transport.filter((t: any) => !isCancelled(t)) : [],
      shops: Array.isArray(s.shops) ? s.shops.filter((sh: any) => !isCancelled(sh)) : [],
    } as BookingSummary;
  });
  return (
    <div className="mt-4 flex h-full flex-col gap-3">
      <div className="flex flex-row gap-2">
        <div>
          <ContactBox
            title={`Client - ${bookingDetails.general.clientName}`}
            description={`A ${bookingDetails.general.numberOfDays} day ${bookingDetails.general.tourType} trip from ${formatDateToWeekdayMonth(bookingDetails.general.startDate)} to ${formatDateToWeekdayMonth(bookingDetails.general.endDate)}`}
            location={bookingDetails.general.country}
            address={`Expecting ${bookingDetails.general.adultsCount} Adults and ${bookingDetails.general.kidsCount} Kids`}
            phone={"No contact number provided"}
            email={`Client - ${bookingDetails.general.primaryEmail}`}
          />
        </div>

        <div
          className="card flex w-[80%] flex-row gap-2 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 300px)" }}
        >
          <div className="card-title flex w-full flex-row justify-between">
            <div>Booking Summary</div>
            <div className="flex flex-row items-center gap-2">
              <Button onClick={() => { setShowModal(true) }} variant="primaryGreen">
                Download Tour Summary
              </Button>
              <Button onClick={() => { setShowItineraryModal(true) }} variant="primaryGreen">
                Download Itinerary
              </Button>
            </div>
          </div>
          <div ref={summaryRef} className="pdf-summary">
            {filteredSummary.map((sum, index) => {
              return <SummaryCard summary={sum} key={index} />;
            })}
          </div>
        </div>
      </div>
      {/* <div className="flex flex-col w-[20%] justify-end">

        <div className="text-[8px] font-normal text-neutral-400">
          Please expand all the dates before downloading
        </div>
      </div> */}

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-fit max-h-[90%] overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>{`Tour Summary | ${id}`}</DialogTitle>
            <DialogDescription>
              {message}
            </DialogDescription>
          </DialogHeader>
          <ProceedContent summary={filteredSummary} bookingLineId={id} bookingLine={bookingDetails} agentAndManager={
            {
              agent: agent?.name ?? '',
              manager: coordinatorAndManager[1] ?? ''
            }
          } type="summary" />
        </DialogContent>
      </Dialog>

      <Dialog open={showItineraryModal} onOpenChange={setShowItineraryModal}>
        <DialogContent className="max-w-fit max-h-[90%] overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>{`Tour Itinerary | ${id}`}</DialogTitle>
            <DialogDescription>
              {message}
            </DialogDescription>
          </DialogHeader>
          <ProceedContent summary={filteredSummary} bookingLineId={id} bookingLine={bookingDetails} agentAndManager={
            {
              agent: agent?.name ?? '',
              manager: coordinatorAndManager[1] ?? ''
            }
          } type="itinerary" />
        </DialogContent>
      </Dialog>
    </div>
  );
};



export default AddBookingSubmitTab;


interface ProceedContentProps {
  summary: BookingSummary[];
  bookingLineId: string;
  bookingLine: BookingDetails;
  agentAndManager: {
    agent: string;
    manager: string;
  };
  type: string;
}

const ProceedContent: React.FC<ProceedContentProps> = ({
  summary,
  bookingLineId,
  bookingLine,
  agentAndManager,
  type
}) => {

  const { organization, isLoaded: isOrgLoaded } = useOrganization();
  const { isLoaded, user } = useUser();

  if (!isLoaded || !isOrgLoaded) {
    return (
      <LoadingLayout />
    )
  }

  if (type === "summary") {
    return (
      <div className="mb-9 space-y-6">
        <div className="flex flex-row justify-end">
          {organization && user && (
            <VoucherButton voucherComponent={
              <div>
                <SummaryDocument summary={summary} booking={bookingLine} bookingLineId={bookingLineId} organization={organization} user={user as UserResource} agentAndManager={agentAndManager} />
              </div>
            } buttonText="Download Tour Summary as PDF" />

          )}
        </div>
        <div>
          {organization && user && (
            <SummaryDocument summary={summary} booking={bookingLine} bookingLineId={bookingLineId} organization={organization} user={user as UserResource} agentAndManager={agentAndManager} />
          )}
        </div>
      </div>
    );
  } else if (type === "itinerary") {
    return (
      <div className="mb-9 space-y-6 w-[1000px]">
        <div className="flex flex-row justify-end">
          {organization && user && (
            <VoucherButton voucherComponent={
              <div>
                <ItineraryDocument summary={summary} booking={bookingLine} bookingLineId={bookingLineId} organization={organization} user={user as UserResource} agentAndManager={agentAndManager}/>
                {/* {summary.map((sum, index) => {
                  return <SummaryCard summary={sum} key={index} />;
                })} */}
              </div>
            } buttonText="Download Tour Itinerary as PDF" />

          )}
        </div>
        <div>
          {organization && user && (
            <ItineraryDocument summary={summary} booking={bookingLine} bookingLineId={bookingLineId} organization={organization} user={user as UserResource} agentAndManager={agentAndManager}/>
            // <div>
            //   {summary.map((sum, index) => {
            //     return <SummaryCard summary={sum} key={index} />;
            //   })}
            // </div>
          )}
        </div>
      </div>
    );
  }

};
