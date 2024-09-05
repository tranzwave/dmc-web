import React, { createContext, ReactNode, useContext, useState } from 'react';
import { General } from '~/components/restaurants/addRestaurant/forms/generalForm/columns';

interface RestaurantDetails {
  general: General; 
}

// Define context properties
interface AddRestaurantContextProps {
  restaurantDetails: RestaurantDetails;
  setGeneralDetails: (details: General) => void;
}

// Provide default values
const defaultGeneral: General = {
  name: "",
  mealType: "",
  startTime: "",
  endTime: "",
  streetName: "",
  city: "",
  province: "",
  primaryContactNumber: "",
};

const defaultRestaurantDetails: RestaurantDetails = {
  general: defaultGeneral,
};

const AddRestaurantContext = createContext<AddRestaurantContextProps | undefined>(undefined);

export const AddRestaurantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [restaurantDetails, setRestaurantDetails] = useState<RestaurantDetails>(defaultRestaurantDetails);

  const setGeneralDetails = (details: General) => {
    setRestaurantDetails(prev => ({ ...prev, general: details }));
  };

  return (
    <AddRestaurantContext.Provider
      value={{
        restaurantDetails: restaurantDetails,
        setGeneralDetails
      }}
    >
      {children}
    </AddRestaurantContext.Provider>
  );
};

// Custom hook to use context
export const useAddRestaurant = (): AddRestaurantContextProps => {
  const context = useContext(AddRestaurantContext);
  if (!context) {
    throw new Error('useAddRestaurant must be used within an AddRestaurantProvider');
  }
  return context;
};
