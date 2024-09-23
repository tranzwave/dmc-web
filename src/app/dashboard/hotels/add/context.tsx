import React, { createContext, ReactNode, useContext, useState } from 'react';
import { InsertHotel, InsertHotelRoom, InsertHotelStaff, InsertMeal, InsertRestaurant } from '~/server/db/schemaTypes';



// Define the shape of the context
interface AddHotelContextProps {
  hotelGeneral: InsertHotel;
  hotelRooms: InsertHotelRoom[];
  hotelStaff: InsertHotelStaff[];
  restaurants: InsertRestaurant[];
  restaurantMeals: InsertMeal[];
  activeTab: string;
  deleteStaff: (numberPlate: string) => void; // New deleteStaff method
  deleteHotel: (typeName: string) => void; // New deleteHotel method
  setActiveTab: (tab: string) => void;
  setHotelGeneral: (hotel: InsertHotel) => void;
  addHotelRoom: (room: InsertHotelRoom) => void;
  addHotelStaff: (staff: InsertHotelStaff) => void;
  addRestaurant: (restaurant: InsertRestaurant) => void;
  addRestaurantMeal: (meal: InsertMeal, restaurantName:string) => void;
}

// Provide default values
const defaultHotelGeneral: InsertHotel = {
  name: "",
  stars: 0,
  primaryEmail: "",
  primaryContactNumber: "",
  streetName: "",
  cityId:0,
  tenantId:"",
  province: "",
  id: undefined,
  hasRestaurant: undefined,
  createdAt: undefined,
  updatedAt: undefined,
};

export const defaultHotelRoom: InsertHotelRoom = {
  hotelId: "",
  roomType: "",
  typeName: "",
  count: 0,
  amenities: "",
  floor: 0,
  bedCount: 0,
  additionalComments: "",
  createdAt: undefined, 
  updatedAt: undefined, 
  id: undefined, 
};

const defaultHotelRooms: InsertHotelRoom[] = [];
const defaultHotelStaff: InsertHotelStaff[] = [];
const defaultRestaurants: InsertRestaurant[] = [];
const defaultRestaurantMeals: InsertMeal[] = [];

// Create context
const AddHotelContext = createContext<AddHotelContextProps | undefined>(undefined);

export const AddHotelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [hotelGeneral, setHotelGeneral] = useState<InsertHotel>(defaultHotelGeneral);
  const [hotelRooms, setHotelRooms] = useState<InsertHotelRoom[]>(defaultHotelRooms);
  const [hotelStaff, setHotelStaff] = useState<InsertHotelStaff[]>(defaultHotelStaff);
  const [restaurants, setRestaurants] = useState<InsertRestaurant[]>(defaultRestaurants);
  const [restaurantMeals, setRestaurantMeals] = useState<InsertMeal[]>(defaultRestaurantMeals);
  const [activeTab, setActiveTab] = useState<string>("general");

  const addHotelRoom = (room: InsertHotelRoom) => {
    setHotelRooms(prev => [...prev, room]);
  };

  const addHotelStaff = (staff: InsertHotelStaff) => {
    setHotelStaff(prev => [...prev, staff]);
  };

  const addRestaurant = (restaurant: InsertRestaurant) => {
    setRestaurants(prev => [...prev, restaurant]);
  };

  const addRestaurantMeal = (meal: InsertMeal, restaurantName:string) => {
    setRestaurantMeals(prev => [...prev, meal]);
    setRestaurants((prev) =>
    prev.map((res) =>
      res.name === restaurantName
        ? { ...res}
        : res
    )
  );
  };
  
  const deleteHotel = (typeName: string) => {
    alert(typeName)
    setHotelRooms(prev => prev.filter(room => room.typeName !== typeName));
  };

  const deleteStaff = (name: string) => {
    alert(name)
    setHotelStaff(prev => prev.filter(staff => staff.name !== name));
  };


  return (
    <AddHotelContext.Provider
      value={{
        hotelGeneral,
        hotelRooms,
        hotelStaff,
        restaurants,
        restaurantMeals,
        activeTab,
        deleteHotel,
        deleteStaff,
        setActiveTab,
        setHotelGeneral,
        addHotelRoom,
        addHotelStaff,
        addRestaurant,
        addRestaurantMeal
      }}
    >
      {children}
    </AddHotelContext.Provider>
  );
};

// Custom hook to use context
export const useAddHotel = (): AddHotelContextProps => {
  const context = useContext(AddHotelContext);
  if (!context) {
    throw new Error('useAddHotel must be used within an AddHotelProvider');
  }
  return context;
};
