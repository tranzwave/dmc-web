import React, { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from '~/hooks/use-toast';
import { deleteActivityFromVendor, deleteActivityVendorCascade } from '~/server/db/queries/activities';
import { InsertActivity, InsertActivityVendor, SelectCity } from '~/server/db/schemaTypes'; // Import the activity type definition

export type ActivityVendorDTO = InsertActivityVendor & {
  city?:SelectCity
}

export type ActivityTypeDTO = InsertActivity & {
  typeName?:string
}

export interface ActivityVendorDetails {
  general: ActivityVendorDTO;
  activities: ActivityTypeDTO[];
}

// Define context properties
interface AddActivityContextProps {
  activityVendorDetails: ActivityVendorDetails;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setGeneralDetails: (details: ActivityVendorDTO) => void;
  addActivity: (activity: ActivityTypeDTO) => void;
  deleteActivity: (activity: ActivityTypeDTO) => Promise<boolean>;
  duplicateActivity: (name: string, activityType:number, capacity:number) => void

}

// Provide default values
const defaultGeneral: ActivityVendorDTO = {
  name: "",
  streetName: "",
  province: "",
  cityId:0,
  contactNumber:"",
  primaryEmail:"",
  tenantId:"",
  city:{
    id:0,
    name:'',
    country:''
  }
};

const defaultActivityVendorDetails: ActivityVendorDetails = {
  general: defaultGeneral,
  activities: [],
};

const AddActivityContext = createContext<AddActivityContextProps | undefined>(undefined);

export const AddActivityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activityVendorDetails, setActivityVendorDetails] = useState<ActivityVendorDetails>(defaultActivityVendorDetails);
  const [activeTab, setActiveTab] = useState<string>("general");
  const setGeneralDetails = (details: InsertActivityVendor) => {
    setActivityVendorDetails(prev => ({ ...prev, general: details }));
  };

  const addActivity = (activity: InsertActivity) => {
    try {
      console.log("Adding or editing activity:", activity);

      setActivityVendorDetails((prev) => {
          const activityIndex = prev.activities.findIndex(a => a.id === activity.id && a.id !== undefined && a.id !== "");

          if (activityIndex !== -1) {
              // Check if changing activity type or name duplicates another existing activity
              const isDuplicate = prev.activities.some(
                  (a, index) => index !== activityIndex && a.name === activity.name && a.activityType === activity.activityType && a.capacity === activity.capacity
              );

              if (isDuplicate) {
                  throw new Error(`Activity with name "${activity.name}" and type "${activity.activityType}" already exists with the same capacity.`);
              }

              // Update existing activity
              const updatedActivities = [...prev.activities];
              updatedActivities[activityIndex] = { ...prev.activities[activityIndex], ...activity };
              console.log(`Updated activity with ID: ${activity.id}`);
              return { ...prev, activities: updatedActivities };
          }

          // Check if a similar activity already exists (for adding)
          const activityExists = prev.activities.some(
              (a) => a.name === activity.name && a.activityType === activity.activityType && a.capacity === activity.capacity
          );

          if (activityExists) {
              throw new Error(`Activity with name "${activity.name}" and type "${activity.activityType}" already exists.`);
          }

          // Add new activity
          console.log("Adding new activity.");
          return { ...prev, activities: [...prev.activities, activity] };
      });
  } catch (error:any) {
      console.error("Error in addOrEditActivity:", error);
      toast({
          title: 'Error',
          description: error.message,
      });
      throw error;
  }
  };

  // const deleteActivity = (name: string, activityType: number) => {
  //   setActivityVendorDetails(prev => ({
  //     ...prev,
  //     activities: prev.activities.filter(
  //       (activity) => activity.name !== name && activity.activityType !== activityType
  //     ),
  //   }));
  // };

  const deleteActivity = async (activity: ActivityTypeDTO):Promise<boolean> => {
    try {
      console.log("Deleting activity:", activity.name, activity.activityType);
      // if(!activity.id) {
      //   throw new Error("Activity ID not found");
      // }

      if(activity.id !== "" || activity.id !== undefined) {
        const response = await deleteActivityFromVendor(activity.id ?? "");
  
        if (!response) {
          throw new Error("Error deleting activity");
        }

        console.log("Activity deleted successfully:", activity.name);

        setActivityVendorDetails(prev => ({
          ...prev,
          activities: prev.activities.filter(
            (a) => a.id !== activity.id
          ),
        }));
        toast({
          title: 'Success',
          description: 'Activity deleted successfully',
        });
        return true;
      }

      setActivityVendorDetails(prev => ({
        ...prev,
        activities: prev.activities.filter(
          (a) => a.name !== activity.name && a.activityType !== activity.activityType && a.capacity !== activity.capacity
        ),
      }));
      toast({
        title: 'Success',
        description: 'Activity deleted successfully',
      });

      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error deleting activity',
      });
      return false;
    }

  };

  
  const duplicateActivity = (name: string, activityType: number, capacity: number) => {
    const activityToDuplicate = activityVendorDetails.activities.find(
      (activity) => activity.name === name && activity.activityType === activityType && activity.capacity === capacity
    );

    if (activityToDuplicate) {
      const duplicatedActivity = {
        ...activityToDuplicate,
        id: undefined,
        name: `${activityToDuplicate.name}`,
      };

      setActivityVendorDetails(prev => ({
        ...prev,
        activities: [...prev.activities, duplicatedActivity],
      }));

      console.log('Duplicated activity added:', duplicatedActivity);
    } else {
      console.error(`Activity with name "${name}" and activityType "${activityType}" not found.`);
    }
  };
  

  return (
    <AddActivityContext.Provider
      value={{
        activityVendorDetails,
        setGeneralDetails,
        addActivity,
        activeTab,
        setActiveTab,
        deleteActivity,
        duplicateActivity
      }}
    >
      {children}
    </AddActivityContext.Provider>
  );
};

// Custom hook to use context
export const useAddActivity = (): AddActivityContextProps => {
  const context = useContext(AddActivityContext);
  if (!context) {
    throw new Error('useAddActivity must be used within an AddActivityProvider');
  }
  return context;
};
