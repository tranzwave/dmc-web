import React, { createContext, ReactNode, useContext, useState } from 'react';
import { InsertMeal, InsertRestaurant, SelectCity } from '~/server/db/schemaTypes';

export type Restaurant = InsertRestaurant & {
  city?: SelectCity;
};

export type MealType = InsertMeal & {
  typeName?: string;
};

// Interface for RestaurantDetails
export interface RestaurantDetails {
  general: Restaurant;
  mealsOffered: MealType[];
}

// Interface for the context properties
interface AddRestaurantContextProps {
  restaurantDetails: RestaurantDetails;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setGeneralDetails: (details: Restaurant) => void;
  addMeals: (meal: InsertMeal) => void;
  deleteMealType: (mealType: string, startTime: string, endTime: string) => void;
  duplicateMealType: (mealType: string, startTime: string, endTime: string) => void;

}

const defaultGeneral: Restaurant = {
  name: "",
  streetName: "",
  cityId: 0,
  province: "",
  contactNumber: "",
  tenantId: "",
  // city:{
  //   id:0,
  //   name:'',
  //   country:''
  // }
};

const defaultRestaurantDetails: RestaurantDetails = {
  general: defaultGeneral,
  mealsOffered: []
};

const AddRestaurantContext = createContext<AddRestaurantContextProps | undefined>(undefined);

export const AddRestaurantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [restaurantDetails, setRestaurantDetails] = useState<RestaurantDetails>(defaultRestaurantDetails);
  const [activeTab, setActiveTab] = useState<string>("general");
  const setGeneralDetails = (details: InsertRestaurant) => {
    setRestaurantDetails(prev => ({ ...prev, general: details }));
  };

  const addMeals = (meal: InsertMeal) => {
    setRestaurantDetails((prev) => {
      // Check if the activity already exists in the array by comparing name, activityType, and capacity
      const exists = prev.mealsOffered.some(
        (m) =>
          m.mealType === meal.mealType &&
          m.startTime === meal.startTime &&
          m.endTime === meal.endTime
      );
  
      if (exists) {
        // If the activity already exists, return the current state without changes
        return prev;
      }
  
      // Otherwise, add the new activity to the activities array
      return {
        ...prev,
        mealsOffered: [...prev.mealsOffered, meal],
      };
    });
  };

  const deleteMealType = (mealType: string, startTime: string, endTime: string) => {
    setRestaurantDetails((prev) => ({
      ...prev,
      mealsOffered: prev.mealsOffered.filter(
        (meal) => meal.mealType !== mealType || meal.startTime !== startTime || meal.endTime !== endTime
      ),
    }));
  };

  const duplicateMealType = (mealType: string, startTime: string, endTime: string) => {
    const mealToDuplicate = restaurantDetails.mealsOffered.find(
      (meal) => meal.mealType === mealType && meal.startTime === startTime && meal.endTime === endTime
    );

    if (mealToDuplicate) {
      const duplicatedMeal = {
        ...mealToDuplicate,
        id: undefined,
        mealType: `${mealToDuplicate.mealType}`,
      };

      setRestaurantDetails((prev) => ({
        ...prev,
        mealsOffered: [...prev.mealsOffered, duplicatedMeal],
      }));
      console.log('Duplicated meal added:', duplicatedMeal);
    } else {
      console.error(`Meal with type "${mealType}", startTime "${startTime}", and endTime "${endTime}" not found.`);
    }
  };
  return (
    <AddRestaurantContext.Provider
      value={{
        restaurantDetails,
        setGeneralDetails,
        addMeals,
        activeTab,
        setActiveTab,
        deleteMealType,
        duplicateMealType
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
