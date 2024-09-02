'use client'
import { useEffect, useState } from "react"
import { DataTable } from "~/components/bookings/home/dataTable"
import { columns, Activity } from "./columns"
import ActivitiesForm from "./actvitiesForm"
import { ActivityVoucher, useAddBooking } from "~/app/dashboard/bookings/add/context"
import { SelectActivity, SelectActivityType, SelectCity } from "~/server/db/schemaTypes"
import { getAllActivityTypes, getAllCities } from "~/server/db/queries/activities"
import { Divide } from "lucide-react"

const ActivitiesTab = () => {
    const [addedActivities, setAddedActivities] = useState<ActivityVoucher[]>([])
    const { addActivity,bookingDetails } = useAddBooking();
    const [loading, setLoading] = useState(false);
    const [activityTypes, setActivityTypes] = useState<SelectActivityType[]>([]);
    const [cities, setCities] = useState<SelectCity[]>([])
    const [error, setError] = useState<string | null>();

    const updateActivities = (voucher: ActivityVoucher) => {
        setAddedActivities((prev) => [...prev, voucher]);
        addActivity(voucher)
    }
    const fetchData = async () => {
        try {
          // Run both requests in parallel
          setLoading(true);
          //TODO: Dynamic country code
          const [activityResponse, cityResponse] =
            await Promise.all([getAllActivityTypes(), getAllCities("LKA")]);
    
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
        fetchData();
      }, []);

      if(loading){
        return (<div>Loading...</div>)
      }

    return (
        <div className="flex flex-col gap-3">
            <div className='flex flex-row gap-2 justify-center mx-9'>
                <div className='w-[25%]'>
                    <div className='card'>
                        Calendar
                    </div>
                </div>
                <div className='card w-[70%] space-y-6'>
                    <div className='card-title'>Activities Information</div>
                    <ActivitiesForm onAddActivity={updateActivities} activityTypes={activityTypes} cities={cities}/>
                </div>
            </div>
            <div className='flex flex-row gap-2 justify-center mx-9'>
                <div className='w-full'>
                    <DataTable columns={columns} data={bookingDetails.activities} />
                </div>
            </div>
        </div>
    );
}

export default ActivitiesTab;
