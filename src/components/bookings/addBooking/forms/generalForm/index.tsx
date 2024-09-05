"use client";
import { Calendar } from "~/components/ui/calendar";
import GeneralForm from "./generalForm";
import { useAddBooking } from "~/app/dashboard/bookings/add/context";

const GeneralTab = () => {
  const {bookingDetails} = useAddBooking()
  return (
    <div className="mx-9 flex flex-row justify-center gap-2">
      <div className="w-[25%]">
        <div className="card w-[85%]">
          {/* <Calendar
                        mode="single"
                        className="rounded-md"
                    /> */}
          <Calendar
            mode="range"
            selected={{from: new Date(bookingDetails.general.startDate), to:new Date(bookingDetails.general.endDate)}}
            className="rounded-md"
          />
        </div>
      </div>
      <div className="card w-[70%] space-y-6">
        <div className="card-title">General Information</div>
        <GeneralForm />
      </div>
    </div>
  );
};

export default GeneralTab;
