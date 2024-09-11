'use client';

import { useState } from "react";
import { useAddActivity } from "~/app/dashboard/activities/add/context"; // Context for adding activities
import { DataTable } from "~/components/bookings/home/dataTable";
import { Button } from "~/components/ui/button";
import { InsertActivity } from "~/server/db/schemaTypes";
import VendorActivityForm from "./activityForm";
import { columns } from "./columns";

const ActivityTab = () => {
    const [addedActivities, setAddedActivities] = useState<InsertActivity[]>([]); // State to handle added activities
    const { addActivity, activityVendorDetails } = useAddActivity(); // Assuming similar context structure for activities

    const updateActivities = (activity: InsertActivity) => {
        console.log("Adding Activity");
        addActivity(activity); // Adding the activity to the context
        setAddedActivities((prevActivities) => [...prevActivities, activity]); // Update local state
    };

    return (
        <div className="flex flex-col gap-3 justify-center items-center">
            <div className='w-full flex flex-row gap-2 justify-center'>
                <div className='card w-[90%] space-y-6'>
                    <div className='card-title'>Activity Information</div>
                    <VendorActivityForm onAddActivity={updateActivities} /> {/* Updated to use ActivityForm */}
                </div>
            </div>
            <div className='flex flex-col gap-2 items-center justify-center w-[90%]'>
                <div className='w-full'>
                    <DataTable columns={columns} data={activityVendorDetails.activities} /> {/* Displaying activities */}
                </div>
                <div className="w-full flex justify-end">
                    <Button variant={"primaryGreen"}>Next</Button>
                </div>
            </div>
        </div>
    );
};

export default ActivityTab;
