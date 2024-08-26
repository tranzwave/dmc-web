import React, { createContext, ReactNode, useContext, useState } from 'react';
import { General } from '~/components/activities/addActivity/forms/generalForm/columns';

interface ActivityDetails {
  general: General; 
}

// Define context properties
interface AddActivityContextProps {
  activityDetails: ActivityDetails;
  setGeneralDetails: (details: General) => void;
}

// Provide default values
const defaultGeneral: General = {
  name: "",
  activity: "",
  primaryEmail: "",
  primaryContactNumber: "",
  streetName: "",
  city: "",
  province: "",
  capacity: "",
};

const defaultActivityDetails: ActivityDetails = {
  general: defaultGeneral,
};

const AddActivityContext = createContext<AddActivityContextProps | undefined>(undefined);

export const AddActivityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activityDetails, setActivityDetails] = useState<ActivityDetails>(defaultActivityDetails);

  const setGeneralDetails = (details: General) => {
    setActivityDetails(prev => ({ ...prev, general: details }));
  };

  return (
    <AddActivityContext.Provider
      value={{
        activityDetails,
        setGeneralDetails
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
