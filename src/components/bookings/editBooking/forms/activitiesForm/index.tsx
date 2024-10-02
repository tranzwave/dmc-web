"use client";
import { useEffect, useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import { columns, Activity } from "./columns";
import ActivitiesForm from "./actvitiesForm";
import {
  ActivityVoucher
} from "~/app/dashboard/bookings/add/context";
import {
  SelectActivity,
  SelectActivityType,
  SelectCity,
} from "~/server/db/schemaTypes";
import {
  getAllActivityTypes,
  getAllCities,
} from "~/server/db/queries/activities";
import { Divide, LoaderCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { Calendar } from "~/components/ui/calendar";
import { useEditBooking } from "~/app/dashboard/bookings/[id]/edit/context";
import { usePathname } from "next/navigation";
import { addActivityVouchersToBooking } from "~/server/db/queries/booking";

const ActivitiesTab = () => {
  const [addedActivities, setAddedActivities] = useState<ActivityVoucher[]>([]);
  const { addActivity, bookingDetails, setActiveTab } = useEditBooking();
  const [loading, setLoading] = useState(false);
  const [activityTypes, setActivityTypes] = useState<SelectActivityType[]>([]);
  const [cities, setCities] = useState<SelectCity[]>([]);
  const [error, setError] = useState<string | null>();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false)

  const pathname = usePathname()
  const bookingLineId = pathname.split("/")[3]

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

  const onSaveClick = async()=>{
    console.log(bookingDetails.vouchers)
    const newVouchers = bookingDetails.activities.filter(v => v.voucher?.id ? false : true);

    if(newVouchers.length == 0){
      toast({
        title: "Uh Oh!",
        description: "No new vouchers to add!",
      });

      return
    }
    try {
      setSaving(true)
      const newResponse = await addActivityVouchersToBooking(newVouchers,bookingLineId ?? "", bookingDetails.general.marketingManager);

      if (!newResponse) {
        throw new Error(`Error: Couldn't add activity vouchers`);
      }
      console.log("Fetched restaurant vouchers:", newResponse);

      setSaving(false);
      toast({
        title: "Success",
        description: "Activity Vouchers Added!",
      });
    } catch (error) {
      if (error instanceof Error) {
        // setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error("Error:", error);
      setSaving(false)
      toast({
        title: "Uh Oh!",
        description: "Couldn't add activity vouchers!",
      });
    }

  }

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
          <DataTable columns={columns} data={bookingDetails.activities} />
        </div>
      </div>
      <div className="flex w-full justify-end">
      <Button variant={"primaryGreen"} onClick={onSaveClick} disabled={saving}>
            {saving ? (<div className="flex flex-row gap-1"><div><LoaderCircle className="animate-spin" size={10}/></div>Saving</div>): ('Save')}
          </Button>
      </div>
    </div>
  );
};

export default ActivitiesTab;
