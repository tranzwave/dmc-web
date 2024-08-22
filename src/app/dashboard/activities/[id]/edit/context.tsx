import React, { createContext, ReactNode, useContext, useState } from 'react';
import { General } from '~/components/activities/editActivity/forms/generalForm/columns';

interface ActivityDetails {
  general: General; 
}

// Define context properties
interface EditActivityContextProps {
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

const EditActivityContext = createContext<EditActivityContextProps | undefined>(undefined);

export const EditActivityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activityDetails, setActivityDetails] = useState<ActivityDetails>(defaultActivityDetails);

  const setGeneralDetails = (details: General) => {
    setActivityDetails(prev => ({ ...prev, general: details }));
  };

  return (
    <EditActivityContext.Provider
      value={{
        activityDetails,
        setGeneralDetails
      }}
    >
      {children}
    </EditActivityContext.Provider>
  );
};

// Custom hook to use context
export const useEditActivity = (): EditActivityContextProps => {
  const context = useContext(EditActivityContext);
  if (!context) {
    throw new Error('useEditActivity must be used within an EditActivityProvider');
  }
  return context;
};
