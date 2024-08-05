'use client'
import { useState } from "react"
import { DataTable } from "~/components/bookings/home/dataTable"
import { columns, Activity } from "./columns"
import ActivitiesForm from "./actvitiesForm"
import { useAddBooking } from "~/app/dashboard/bookings/add/context"

const ActivitiesTab = () => {
    const [addedActivities, setAddedActivities] = useState<Activity[]>([])
    const { addActivity,bookingDetails } = useAddBooking();

    const updateActivities = (activity: Activity) => {
        setAddedActivities((prev) => [...prev, activity]);
        addActivity(activity)
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
                    <ActivitiesForm onAddActivity={updateActivities} />
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
