'use client';

import { useState } from "react";
import { ActivityTypeDTO, useAddActivity } from "~/app/dashboard/activities/add/context"; // Context for adding activities
import { DataTableWithActions } from "~/components/common/dataTableWithActions";
import { Button } from "~/components/ui/button";
import { InsertActivity } from "~/server/db/schemaTypes";
import VendorActivityForm from "./activityForm";
import { columns } from "./columns";


const ActivityTab = () => {
    const [addedActivities, setAddedActivities] = useState<InsertActivity[]>([]); // State to handle added activities
    const { addActivity, activityVendorDetails, setActiveTab, deleteActivity } = useAddActivity(); // Assuming similar context structure for activities
    const [selectedActivity, setSelectedActivity] = useState<ActivityTypeDTO>({
        name: "",
        activityType: 0,
        capacity: 1,
        activityVendorId:"",
        tenantId:""
      });

    const updateActivities = (activity: InsertActivity) => {
        console.log("Adding Activity");
        addActivity(activity); // Adding the activity to the context
        setAddedActivities((prevActivities) => [...prevActivities, activity]); // Update local state
    };

    const onRowEdit = (row: ActivityTypeDTO) => {
        console.log(row);
        setSelectedActivity(row);
      };
    
      const onRowDelete = (row: ActivityTypeDTO) => {
        alert(row.name);
        deleteActivity(row.name);
      };

    return (
        <div className="flex flex-col gap-3 justify-center items-center">
            <div className='w-full flex flex-row gap-2 justify-center'>
                <div className='card w-[90%] space-y-6'>
                    <div className='card-title'>Activity Information</div>
                    <VendorActivityForm onAddActivity={updateActivities} selectedActivity={selectedActivity} /> {/* Updated to use ActivityForm */}
                </div>
            </div>
            <div className='flex flex-col gap-2 items-center justify-center w-[90%]'>
                <div className='w-full'>
                    <DataTableWithActions columns={columns} data={activityVendorDetails.activities}
                                onDelete={onRowDelete}
                                onEdit={onRowEdit}
                                onRowClick={onRowEdit}
                                onDuplicate={onRowEdit} /> {/* Displaying activities */}
                </div>
                <div className="w-full flex justify-end">
                    <Button variant={"primaryGreen"} onClick={()=> {setActiveTab("submit")}}>Next</Button>
                </div>
            </div>
        </div>
    );
};

export default ActivityTab;
