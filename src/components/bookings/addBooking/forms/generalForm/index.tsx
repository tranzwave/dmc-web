"use client";
import { Calendar } from "~/components/ui/calendar";
import GeneralForm from "./generalForm";
import { useAddBooking } from "~/app/dashboard/bookings/add/context";
import { PartialClerkUser } from "~/lib/types/marketingTeam";
import { SelectMarketingTeam } from "~/server/db/schemaTypes";

interface GeneralTabProps {
  allUsers: PartialClerkUser[];
  marketingTeams: SelectMarketingTeam[];
}

const GeneralTab = ({allUsers, marketingTeams}: GeneralTabProps) => {
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
        {allUsers.length > 0 && marketingTeams.length > 0 && <GeneralForm allUsers={allUsers} marketingTeams={marketingTeams}/>}
      </div>
    </div>
  );
};

export default GeneralTab;
