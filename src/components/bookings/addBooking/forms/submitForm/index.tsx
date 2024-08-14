'use client'
import { Loader2Icon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAddBooking } from "~/app/dashboard/bookings/add/context";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "~/components/ui/dialog";
import { addBooking } from "~/lib/api";

const SummaryCard = ({ day }: { day: number }) => {
  return (
    <div className="space-y-0">
      <div className="bg-primary-green text-white font-bold text-sm p-1 rounded-t-xl w-24 flex justify-center items-center">
        <div>Day {day}</div>
      </div>
      <div className="grid grid-cols-3 border rounded-lg mb-2 shadow-md">
        <div className="border-r p-2">
          <div className="text-sm font-bold text-primary-green">
            Hotel Name
          </div>
          <div className="text-xs font-normal">
            <div>20 Guests</div>
            <div>5 Double beds | 2 Kings bed | 4 single beds</div>
            <div>Dinner at plates restaurant</div>
          </div>
        </div>
        <div className="border-r p-2">
          <div className="text-sm font-bold text-primary-green">Activity Name</div>
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
  const [id,setId] = useState('0');
  const pathname = usePathname();
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    try {
        const response = await addBooking(bookingDetails);

        if (response.success) {
            setId(response.id);
            setMessage("Booking Added! Do you want to continue finalizing the tasks for this booking?");
            setShowModal(true);
        } else {
            setMessage("Failed to add booking.");
        }
    } catch (error) {
        setMessage("An error occurred while adding the booking.");
    } finally {
        setLoading(false);
    }
};

  const handleYes = () => {
    setShowModal(false);
    router.push(`${pathname.split('add')[0]}/${id}/tasks`)

  };

  const handleNo = () => {
    // Handle not continuing to finalize tasks
    setShowModal(false);
  };

  const numberOfDays = bookingDetails.general?.numberOfDays || 0;

  return (
    <div className="flex flex-col gap-3 h-full justify-center items-center mt-4">
      <div className="flex w-[80%] justify-start card-title">
        Booking Summary
      </div>
      <div className="flex flex-col gap-2 overflow-y-auto w-[80%] card" style={{ maxHeight: 'calc(100vh - 300px)' }}>
        {Array.from({ length: numberOfDays }, (_, index) => (
          <SummaryCard key={index} day={index + 1} />
        ))}
      </div>
      <div className="flex w-[80%] justify-end">
        <Button variant="primaryGreen" onClick={handleSubmit} disabled={loading}>
          {loading ? <div className="flex flex-row gap-2"><div><Loader2Icon className="animate-spin"/></div> <div> Saving </div></div>: 'Submit'}
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
