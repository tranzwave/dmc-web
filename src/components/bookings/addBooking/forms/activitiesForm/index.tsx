"use client";
import { useEffect, useState } from "react";
import {
  ActivityVoucher,
  useAddBooking,
} from "~/app/dashboard/bookings/add/context";
import { DataTableWithActions } from "~/components/common/dataTableWithActions";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { useToast } from "~/hooks/use-toast";
import {
  getAllActivityTypes,
  getAllCities,
} from "~/server/db/queries/activities";
import {
  SelectActivityType,
  SelectCity
} from "~/server/db/schemaTypes";
import ActivitiesForm from "./actvitiesForm";
import { columns } from "./columns";

const ActivitiesTab = () => {
  const [addedActivities, setAddedActivities] = useState<ActivityVoucher[]>([]);
  const { addActivity, bookingDetails, setActiveTab, deleteActivity } = useAddBooking();
  const [loading, setLoading] = useState(false);
  const [activityTypes, setActivityTypes] = useState<SelectActivityType[]>([]);
  const [cities, setCities] = useState<SelectCity[]>([]);
  const [error, setError] = useState<string | null>();
  const { toast } = useToast();

  const updateActivities = (voucher: ActivityVoucher) => {
    setAddedActivities((prev) => [...prev, voucher]);
    addActivity(voucher);
  };
  const fetchData = async () => {
    try {
      // Run both requests in parallel
      setLoading(true);
      //TODO: Dynamic country code
      const [activityResponse, cityResponse] = await Promise.all([
        getAllActivityTypes(),
        getAllCities("LK"),
      ]);

      // Check for errors in the responses
      if (!activityResponse) {
        throw new Error("Error fetching agents");
      }

      if (!cityResponse) {
        throw new Error("Error fetching users");
      }

      console.log("Fetched Agents:", activityResponse);
      console.log("Fetched Users:", cityResponse);

      // Set states after successful fetch
      setActivityTypes(activityResponse);
      setCities(cityResponse);

      setLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if(!bookingDetails.general.includes.activities){
      setActiveTab("transport")
      return ()=>{console.log("Return")};
    }
    fetchData();
  }, []);

  const onNextClick = () => {
    console.log(bookingDetails);
    if (bookingDetails.activities.length > 0) {
      setActiveTab("transport");
    } else {
      toast({
        title: "Uh Oh!",
        description: "You must add activities to continue",
      });
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  const onRowEdit = (row: ActivityVoucher) => {
    console.log(row);
    // setSelectedActivity(row);
  };

  const onRowDelete = (row: ActivityVoucher) => {
    alert(row.vendor.name);
    deleteActivity(row.vendor.name);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row justify-center gap-3">
      <Calendar
            mode="range"
            selected={{
              from: new Date(bookingDetails.general.startDate),
              to: new Date(bookingDetails.general.endDate),
            }}
            className="rounded-md"
          />
        <div className="card w-full space-y-3">
          <div className="card-title">Activities Information</div>
          <ActivitiesForm
            onAddActivity={updateActivities}
            activityTypes={activityTypes}
            cities={cities}
          />
        </div>
      </div>
      <div className=" flex flex-row justify-center gap-2">
        <div className="w-full">
          <DataTableWithActions columns={columns} data={bookingDetails.activities} 
                      onDelete={onRowDelete}
                      onEdit={onRowEdit}
                      onRowClick={onRowEdit}
                      onDuplicate={onRowEdit}/>
        </div>
      </div>
      <div className="flex w-full justify-end">
        <Button variant={"primaryGreen"} onClick={onNextClick}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default ActivitiesTab;
