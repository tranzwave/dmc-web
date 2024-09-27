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
  activities: ActivityTypeDTO[]; // Activities array for the vendor
}

// Define context properties
interface AddActivityContextProps {
  activityVendorDetails: ActivityVendorDetails;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setGeneralDetails: (details: ActivityVendorDTO) => void;
  addActivity: (activity: ActivityTypeDTO) => void; // Method to add activities
  deleteActivity: (name: string) => void; // New deleteActivity method

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
  activities: [], // Initialize with an empty array
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
      // Check if the activity already exists in the array by comparing name, activityType, and capacity
      const exists = prev.activities.some(
        (a) =>
          a.name === activity.name &&
          a.activityType === activity.activityType &&
          a.capacity === activity.capacity
      );
  
      if (exists) {
        // If the activity already exists, return the current state without changes
        return prev;
      }
  
      // Otherwise, add the new activity to the activities array
      return {
        ...prev,
        activities: [...prev.activities, activity],
      };
    });
  };

  const deleteActivity = (name: string) => {
    alert(name)
    setActivityVendorDetails(prev => ({
      ...prev,
      activities: prev.activities.filter(activity => activity.name !== name)
    }));
  };

  

  return (
    <AddActivityContext.Provider
      value={{
        activityVendorDetails,
        setGeneralDetails,
        addActivity,
        activeTab,
        setActiveTab,
        deleteActivity
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
