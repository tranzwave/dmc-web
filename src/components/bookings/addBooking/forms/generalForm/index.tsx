"use client";
import { Calendar } from "~/components/ui/calendar";
import GeneralForm from "./generalForm";
import { useAddBooking } from "~/app/dashboard/bookings/add/context";
import { PartialClerkUser } from "~/lib/types/marketingTeam";
import { SelectMarketingTeam } from "~/server/db/schemaTypes";
import { Button } from "~/components/ui/button";

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
        {allUsers.length > 0 && <GeneralForm allUsers={allUsers} marketingTeams={marketingTeams}/>}
        {/* {marketingTeams.length === 0 && <div className="text-center text-gray-500">
          No marketing teams found. Please create a marketing team first.
          <div>
            <Button variant={"primaryGreen"}>Create Marketing Team</Button>
          </div>
          </div>} */}
      </div>
    </div>
  );
};

export default GeneralTab;
