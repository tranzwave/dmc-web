import React, { createContext, ReactNode, useContext, useState } from 'react';
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
  deleteActivity: (name: string, activityType:number, capacity:number) => void;
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
    setActivityVendorDetails((prev) => {
      const exists = prev.activities.some(
        (a) =>
          a.name === activity.name &&
          a.activityType === activity.activityType &&
          a.capacity === activity.capacity
      );
  
      if (exists) {
        return prev;
      }
  
      return {
        ...prev,
        activities: [...prev.activities, activity],
      };
    });
  };

  // const deleteActivity = (name: string, activityType: number) => {
  //   setActivityVendorDetails(prev => ({
  //     ...prev,
  //     activities: prev.activities.filter(
  //       (activity) => activity.name !== name && activity.activityType !== activityType
  //     ),
  //   }));
  // };

  const deleteActivity = (name: string, activityType: number, capacity:number) => {
    setActivityVendorDetails(prev => ({
      ...prev,
      activities: prev.activities.filter(
        (activity) => !(activity.name === name && activity.activityType === activityType && activity.capacity === capacity)
      ),
    }));
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
