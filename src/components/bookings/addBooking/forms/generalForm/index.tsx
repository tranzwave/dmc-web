"use client";
import { Calendar } from "~/components/ui/calendar";
import GeneralForm from "./generalForm";
import { useAddBooking } from "~/app/dashboard/bookings/add/context";

const GeneralTab = () => {
  const {bookingDetails} = useAddBooking()
  return (
    <div className="mx-4 flex flex-row justify-center gap-3">
            <Calendar
            mode="range"
            selected={{from: new Date(bookingDetails.general.startDate), to:new Date(bookingDetails.general.endDate)}}
            className="rounded-md"
          />
      <div className="card w-full space-y-6">
        <div className="card-title">General Information</div>
        <GeneralForm />
      </div>
    </div>
  );
};

export default GeneralTab;
