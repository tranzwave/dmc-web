import React, { createContext, ReactNode, useContext, useState } from 'react';
import { InsertActivity, InsertActivityVendor } from '~/server/db/schemaTypes'; // Import the activity type definition

export type ActivityVendorDTO = InsertActivityVendor & {
  city?:string
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
  setGeneralDetails: (details: InsertActivityVendor) => void;
  addActivity: (activity: InsertActivity) => void; // Method to add activities
}

// Provide default values
const defaultGeneral: InsertActivityVendor = {
  name: "",
  streetName: "",
  province: "",
  cityId:0,
  contactNumber:"",
  tenantId:"",
};

const defaultActivityVendorDetails: ActivityVendorDetails = {
  general: defaultGeneral,
  activities: [], // Initialize with an empty array
};

const AddActivityContext = createContext<AddActivityContextProps | undefined>(undefined);

export const AddActivityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activityVendorDetails, setActivityVendorDetails] = useState<ActivityVendorDetails>(defaultActivityVendorDetails);

  const setGeneralDetails = (details: InsertActivityVendor) => {
    setActivityVendorDetails(prev => ({ ...prev, general: details }));
  };

  const addActivity = (activity: InsertActivity) => {
    setActivityVendorDetails(prev => ({
      ...prev,
      activities: [...prev.activities, activity],
    }));
  };

  return (
    <AddActivityContext.Provider
      value={{
        activityVendorDetails,
        setGeneralDetails,
        addActivity
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
