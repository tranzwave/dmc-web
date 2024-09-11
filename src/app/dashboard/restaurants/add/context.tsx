import React, { createContext, ReactNode, useContext, useState } from 'react';
import { InsertMeal, InsertRestaurant } from '~/server/db/schemaTypes';

export type Restaurant = InsertRestaurant & {
  city?: string;
};

export type MealType = InsertMeal & {
  // typeName?: string;
};

// Interface for RestaurantDetails
export interface RestaurantDetails {
  general: Restaurant;
  mealsOffered: MealType[];
}

// Interface for the context properties
interface AddRestaurantContextProps {
  restaurantDetails: RestaurantDetails;
  setGeneralDetails: (details: InsertRestaurant) => void;
  addMeals: (meal: InsertMeal) => void;
}

const defaultGeneral: InsertRestaurant = {
  name: "",
  streetName: "",
  cityId: 0,
  province: "",
  contactNumber: "",
  tenantId: ""
};

const defaultRestaurantDetails: RestaurantDetails = {
  general: defaultGeneral,
  mealsOffered: []
};

const AddRestaurantContext = createContext<AddRestaurantContextProps | undefined>(undefined);

export const AddRestaurantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [restaurantDetails, setRestaurantDetails] = useState<RestaurantDetails>(defaultRestaurantDetails);

  const setGeneralDetails = (details: InsertRestaurant) => {
    setRestaurantDetails(prev => ({ ...prev, general: details }));
  };

  const addMeals = (meal: InsertMeal) => {
    setRestaurantDetails(prev => ({
      ...prev,
      mealsOffered: [...prev.mealsOffered, meal],
    }));
  };

  return (
    <AddRestaurantContext.Provider
      value={{
        restaurantDetails,
        setGeneralDetails,
        addMeals
      }}
    >
      {children}
    </AddRestaurantContext.Provider>
  );
};

export const useAddRestaurant = (): AddRestaurantContextProps => {
  const context = useContext(AddRestaurantContext);
  if (!context) {
    throw new Error('useAddRestaurant must be used within an AddRestaurantProvider');
  }
  return context;
};
