"use client";
import html2pdf from "html2pdf.js";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useEditBooking } from "~/app/dashboard/bookings/[id]/edit/context";
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

const AddBookingSubmitTab = () => {
  const { bookingDetails, getBookingSummary } = useEditBooking();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [id, setId] = useState("0");
  const pathname = usePathname();
  const router = useRouter();
  const summaryRef = useRef(null); // Ref to hold the summary section

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const bookingData = {
        newBooking: bookingDetails.general,
        generalData: bookingDetails.general,
        hotelVouchers: bookingDetails.vouchers,
      };
    } catch (error) {
      setMessage("An error occurred while processing the booking.");
      console.error("Error in handleSubmit:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleYes = () => {
    setShowModal(false);
    router.push(`${pathname.split("add")[0]}/${id}/tasks`); // Redirect to tasks page
  };

  const handleNo = () => {
    setShowModal(false);
  };

  const downloadPDF = () => {
    const bookingId = pathname.split('/')[3] ?? 'Unknown'
    const summaryFileName = `${bookingId}_summary.pdf`
    const element = summaryRef.current;
    const options = {
      filename: summaryFileName,
      jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
      html2canvas: { scale: 2 }, 
      margin: [10, 10, 10, 10], 
    };
    html2pdf().set(options).from(element).save();
  };

  const summary = getBookingSummary();

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
            {/* <Button
              variant="primaryGreen"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <div className="flex flex-row gap-2">
                  <div>
                    <Loader2Icon className="animate-spin" />
                  </div>{" "}
                  <div> Saving </div>
                </div>
              ) : (
                "Submit Booking"
              )}
            </Button> */}
          </div>
          <div ref={summaryRef} className="pdf-summary">
            {summary.map((sum, index) => {
              return <SummaryCard summary={sum} key={index} />;
            })}
          </div>
        </div>
      </div>
      <div className="flex flex-col w-[20%] justify-end">
        <Button onClick={downloadPDF} variant="primaryGreen">
          Download Summary as PDF
        </Button>
        <div className="text-[8px] font-normal text-neutral-400">
          Please expand all the dates before downloading
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{pathname.includes("edit") ? "Booking Updated!" : "Booking Added!"}</DialogTitle>
            <DialogDescription>
              {message}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="primaryGreen" onClick={handleYes}>
              Yes
            </Button>
            <Button variant="secondary" onClick={handleNo}>
              No
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddBookingSubmitTab;
