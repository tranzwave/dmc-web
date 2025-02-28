'use client';

import { Suspense, useEffect, useState } from "react";
import { ActivityTypeDTO, useAddActivity } from "~/app/dashboard/activities/add/context"; // Context for adding activities
import { DataTableWithActions } from "~/components/common/dataTableWithActions";
import { Button } from "~/components/ui/button";
import { InsertActivity } from "~/server/db/schemaTypes";
import VendorActivityForm from "./activityForm";
import { columns } from "./columns";
import CityAdder from "~/components/common/cityAdder";
import ActivityAdder from "~/components/common/activityAdder";
import { set } from "date-fns";


const ActivityTab = () => {
    const { addActivity, activityVendorDetails, setActiveTab, deleteActivity, duplicateActivity } = useAddActivity(); // Assuming similar context structure for activities
    const [selectedActivity, setSelectedActivity] = useState<ActivityTypeDTO>({
        name: "",
        activityType: 0,
        capacity: 1,
        activityVendorId:"",
        tenantId:""
      });
      const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const updateActivities = (activity: InsertActivity) => {
        console.log("Adding Activity");
        addActivity(activity); // Adding the activity to the context
        setSelectedActivity({
            name: "",
            activityType: 0,
            capacity: 1,
            activityVendorId:"",
            tenantId:""
        })
        // setAddedActivities((prevActivities) => [...prevActivities, activity]); // Update local state
    };

    const onRowEdit = (row: ActivityTypeDTO) => {
        console.log(row);
        setSelectedActivity(row);
      };

      const onRowDuplicate = (row: ActivityTypeDTO) => {
        console.log(row);
        duplicateActivity(row.name, row.activityType, row.capacity);
      };
    
      const onRowDelete = (row: ActivityTypeDTO) => {
        alert(row.name);
        setIsDeleting(true);
        const deleted = deleteActivity(row).then((deleted) => {
            if (deleted) {
                console.log("Deleted");
                // window.location.reload();
            } else {
                console.log("Failed to delete");
            }
            setIsDeleting(false);
            setSelectedActivity({
                name: "",
                activityType: 0,
                capacity: 1,
                activityVendorId:"",
                tenantId:""
            })
            
        }
        );
      };

      useEffect(() => {
        console.log("Activities:", activityVendorDetails.activities);
      }
        , [activityVendorDetails.activities]);

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
                    {isDeleting ? (<Suspense>
                        <DataTableWithActions columns={columns} data={activityVendorDetails.activities.map((activity) => {
                            if (activity.id === selectedActivity.id) {
                                return {
                                    ...activity,
                                    id: activity.id,
                                    activityType: 0,
                                    name: "Deleting...",
                                    capacity: 0,
                                    activityVendorId: "",
                                    tenantId: "",
                                    typeName: "",
                                }
                            } else {
                                return activity;
                            }

                        }
                        )}
                            onEdit={()=> {console.log("Edit Clicked")}}
                            onRowClick={()=> {console.log("Row Clicked")}}
                        />
                    </Suspense> ): (
                        <DataTableWithActions columns={columns} data={activityVendorDetails.activities}
                            onDelete={onRowDelete}
                            onEdit={onRowEdit}
                            onRowClick={onRowEdit}
                            onDuplicate={onRowDuplicate} 
                        />
                    )}

                </div>
                <div className="w-full flex justify-end">
                    <Button variant={"primaryGreen"} onClick={()=> {setActiveTab("submit")}}>Next</Button>
                </div>
            </div>
            {/* Delete modal */}

        </div>
    );
};

export default ActivityTab;
