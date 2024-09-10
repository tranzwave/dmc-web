"use client";
import { Loader2Icon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAddBooking } from "~/app/dashboard/bookings/add/context";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { createNewBooking } from "~/server/db/queries/booking";
import SummaryCard, { formatDateToWeekdayMonth } from "./summaryCard";
import ContactBox from "~/components/ui/content-box";

const AddBookingSubmitTab = () => {
  const { bookingDetails, getBookingSummary } = useAddBooking();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [id, setId] = useState("0");
  const pathname = usePathname();
  const router = useRouter();

  const handleSubmit = async () => {
    console.log(bookingDetails);
    setLoading(true);
    try {
      // Prepare the data to pass to the createNewBooking function
      const bookingData = {
        newBooking: bookingDetails.general,
        generalData: bookingDetails.general,
        hotelVouchers: bookingDetails.vouchers,
      };

      // Call the createNewBooking function with the necessary data
      const createdBooking = await createNewBooking(bookingDetails);

      if (createdBooking) {
        // If createNewBooking succeeds, set the success message and show modal
        setMessage(
          "Booking Added! Do you want to continue finalizing the tasks for this booking?",
        );
        setId(createdBooking);
        setShowModal(true);
      }
    } catch (error) {
      // Catch any errors and set error message
      setMessage("An error occurred while adding the booking.");
      console.error("Error in handleSubmit:", error);
    } finally {
      // Always stop the loading spinner
      setLoading(false);
    }
  };

  const handleYes = () => {
    setShowModal(false);
    router.push(`${pathname.split("add")[0]}/${id}/tasks`);
  };

  const handleNo = () => {
    // Handle not continuing to finalize tasks
    setShowModal(false);
  };

  const numberOfDays = bookingDetails.general?.numberOfDays ?? 0;
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
            <Button
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
            </Button>
          </div>
          <div>
            {summary.map((sum, index) => {
              return <SummaryCard summary={sum} key={index} />;
            })}
          </div>
        </div>
      </div>
      <div className="flex w-[80%] justify-end"></div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Added!</DialogTitle>
            <DialogDescription>
              Do you want to continue finalizing the tasks for this booking?
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
