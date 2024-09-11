import React, { createContext, ReactNode, useContext, useState } from 'react';
import { General } from '~/components/restaurants/editRestaurant/forms/generalForm/columns';

interface RestaurantDetails {
  general: General; 
}

// Define context properties
interface EditRestaurantContextProps {
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
  cityId: "",
  province: "",
  primaryContactNumber: "",
  tenantId: "fa710f9d-1c0b-4176-90f8-560a0007e118"
};

const defaultRestaurantDetails: RestaurantDetails = {
  general: defaultGeneral,
};

const EditRestaurantContext = createContext<EditRestaurantContextProps | undefined>(undefined);

// export const EditRestaurantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [restaurantDetails, setRestaurantDetails] = useState<RestaurantDetails>(defaultRestaurantDetails);

//   const setGeneralDetails = (details: General) => {
//     setRestaurantDetails(prev => ({ ...prev, general: details }));
//   };

//   return (
//     <EditRestaurantContext.Provider
//       value={{
//         restaurantDetails: restaurantDetails,
//         setGeneralDetails
//       }}
//     >
//       {children}
//     </EditRestaurantContext.Provider>
//   );
// };

// Custom hook to use context

export const EditRestaurantProvider: React.FC<{ children: ReactNode; initialRestaurantDetails?: RestaurantDetails }> = ({ children, initialRestaurantDetails }) => {
  const [restaurantDetails, setRestaurantDetails] = useState<RestaurantDetails>(initialRestaurantDetails || defaultRestaurantDetails);

  const setGeneralDetails = (details: General) => {
    setRestaurantDetails(prev => ({ ...prev, general: details }));
  };

  return (
    <EditRestaurantContext.Provider
      value={{
        restaurantDetails: restaurantDetails,
        setGeneralDetails
      }}
    >
      {children}
    </EditRestaurantContext.Provider>
  );
};

export const useEditRestaurant = (): EditRestaurantContextProps => {
  const context = useContext(EditRestaurantContext);
  if (!context) {
    throw new Error('useEditRestaurant must be used within an EditRestaurantProvider');
  }
  return context;
};
