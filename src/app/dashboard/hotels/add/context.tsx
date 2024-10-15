import React, { createContext, ReactNode, useContext, useState } from 'react';
import { InsertHotel, InsertHotelRoom, InsertHotelStaff, InsertMeal, InsertRestaurant, SelectCity } from '~/server/db/schemaTypes';

export type Hotel = InsertHotel & {
  city?: SelectCity;
};

export type HotelRoom = InsertHotelRoom & {
  typeName?: string;
};

export type HotelStaff = InsertHotelStaff & {
  name?: string;
};

// Interface for RestaurantDetails
export interface HotelDetails {
  general: Hotel;
  hotelRoom: HotelRoom[];
  hotelStaff: HotelStaff[];
}

// Define the shape of the context
interface AddHotelContextProps {
  hotelGeneral: InsertHotel;
  hotelRooms: InsertHotelRoom[];
  hotelStaff: InsertHotelStaff[];
  restaurants: InsertRestaurant[];
  restaurantMeals: InsertMeal[];
  activeTab: string;
  deleteStaff: (name:string, email: string) => void;
  deleteRoom: (typeName: string, roomType: string) => void;
  setActiveTab: (tab: string) => void;
  setHotelGeneral: (hotel: InsertHotel) => void;
  addHotelRoom: (room: InsertHotelRoom) => void;
  addHotelStaff: (staff: InsertHotelStaff) => void;
  addRestaurant: (restaurant: InsertRestaurant) => void;
  addRestaurantMeal: (meal: InsertMeal, restaurantName:string) => void;
  duplicateHotelRoom: (typeName: string, roomType: string) => void;
  duplicateHotelStaff: (name:string, email: string)=>void
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

const defaultHotelDetails: HotelDetails = {
  general: defaultHotelGeneral,
  hotelRoom: [],
  hotelStaff: []
};

const defaultHotelRooms: InsertHotelRoom[] = [];
const defaultHotelStaff: InsertHotelStaff[] = [];
const defaultRestaurants: InsertRestaurant[] = [];
const defaultRestaurantMeals: InsertMeal[] = [];

// Create context
const AddHotelContext = createContext<AddHotelContextProps | undefined>(undefined);

export const AddHotelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [hotelDetails, setHotelDetails] = useState<HotelDetails>(defaultHotelDetails);
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
  

  const duplicateHotelRoom = (typeName: string, roomType: string) => {
    const hotelRoomToDuplicate = hotelRooms.find(
      (room) => room.typeName === typeName && room.roomType === roomType
    );
  
    if (hotelRoomToDuplicate) {
      const duplicatedHotelRoom = {
        ...hotelRoomToDuplicate,
        id: undefined,
        typeName: `${hotelRoomToDuplicate.typeName}`,
        roomType: `${hotelRoomToDuplicate.roomType}`,
      };
  
      setHotelRooms((prev) => [...prev, duplicatedHotelRoom]);
      console.log("Duplicated hotel room added:", duplicatedHotelRoom);
    } else {
      console.error(`Room with typeName "${typeName}" and roomType "${roomType}" not found.`);
    }
  };
  

  const duplicateHotelStaff = (name: string, email: string) => {
    const hotelStaffToDuplicate = hotelStaff.find(
      (staff) => staff.name === name && staff.email === email
    );
  
    if (hotelStaffToDuplicate) {
      const duplicatedHotelStaff = {
        ...hotelStaffToDuplicate,
        id: undefined,
        name: `${hotelStaffToDuplicate.name}`, 
        primaryEmail: `${hotelStaffToDuplicate.email.replace(/@/, '_copy@')}`,
      };
  
      setHotelStaff((prev) => [...prev, duplicatedHotelStaff]);
      console.log("Duplicated hotel staff added:", duplicatedHotelStaff);
    } else {
      console.error(`Staff with name "${name}" and email "${email}" not found.`);
    }
  };

  const deleteRoom = (typeName: string, roomType: string) => {
    alert(`Deleting room with typeName: ${typeName}, roomType: ${roomType}`);
    setHotelRooms((prev) => prev.filter((room) => !(room.typeName === typeName && room.roomType === roomType)));
  };

  const deleteStaff = (name: string, email: string) => {
    alert(`Deleting staff with name: ${name}, email: ${email}`);
    setHotelStaff((prev) => prev.filter((staff) => !(staff.name === name && staff.email === email)));
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
        deleteStaff,
        deleteRoom,
        setActiveTab,
        setHotelGeneral,
        addHotelStaff,
        addHotelRoom,
        addRestaurant,
        addRestaurantMeal,
        duplicateHotelRoom,
        duplicateHotelStaff
        
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
