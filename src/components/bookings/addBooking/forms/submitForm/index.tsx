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
import { addBooking } from "~/lib/api";
import {
  createBookingLine,
  createNewBooking,
} from "~/server/db/queries/booking";

const SummaryCard = ({ day }: { day: number }) => {
  return (
    <div className="space-y-0">
      <div className="flex w-24 items-center justify-center rounded-t-xl bg-primary-green p-1 text-sm font-bold text-white">
        <div>Day {day}</div>
      </div>
      <div className="mb-2 grid grid-cols-3 rounded-lg border shadow-md">
        <div className="border-r p-2">
          <div className="text-sm font-bold text-primary-green">Hotel Name</div>
          <div className="text-xs font-normal">
            <div>20 Guests</div>
            <div>5 Double beds | 2 Kings bed | 4 single beds</div>
            <div>Dinner at plates restaurant</div>
          </div>
        </div>
        <div className="border-r p-2">
          <div className="text-sm font-bold text-primary-green">
            Activity Name
          </div>
          <div className="text-xs font-normal">
            <div>20 Guests</div>
            <div>5</div>
            <div>D</div>
          </div>
        </div>
        <div className="border-r p-2">
          <div className="text-sm font-bold text-primary-green">Shop Name</div>
          <div className="text-xs font-normal">
            <div>20 Guests</div>
            <div>5</div>
            <div>D</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddBookingSubmitTab = () => {
  const { bookingDetails } = useAddBooking();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [id, setId] = useState("0");
  const pathname = usePathname();
  const router = useRouter();

  const handleSubmit = async () => {
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
        setId(createdBooking)
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

  const numberOfDays = bookingDetails.general?.numberOfDays || 0;

  return (
    <div className="mt-4 flex h-full flex-col items-center justify-center gap-3">
      <div className="card-title flex w-[80%] justify-start">
        Booking Summary
      </div>
      <div
        className="card flex w-[80%] flex-col gap-2 overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 300px)" }}
      >
        {Array.from({ length: numberOfDays }, (_, index) => (
          <SummaryCard key={index} day={index + 1} />
        ))}
      </div>
      <div className="flex w-[80%] justify-end">
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
            "Submit"
          )}
        </Button>
      </div>

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
