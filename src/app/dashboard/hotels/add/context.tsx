import React, { createContext, ReactNode, useContext, useState } from 'react';
import { HotelGeneralType, HotelRoomType, HotelStaffType, Restaurant, RestaurantMealType, RestaurantType } from '~/components/hotels/addHotel/forms/generalForm/columns';



// Define the shape of the context
interface AddHotelContextProps {
  hotelGeneral: HotelGeneralType;
  hotelRooms: HotelRoomType[];
  hotelStaff: HotelStaffType[];
  restaurants: Restaurant[];
  restaurantMeals: RestaurantMealType[];
  setHotelGeneral: (hotel: HotelGeneralType) => void;
  addHotelRoom: (room: HotelRoomType) => void;
  addHotelStaff: (staff: HotelStaffType) => void;
  addRestaurant: (restaurant: Restaurant) => void;
  addRestaurantMeal: (meal: RestaurantMealType, restaurantName:string) => void;
}

// Provide default values
const defaultHotelGeneral: HotelGeneralType = {
  name: "",
  stars: 0,
  primaryEmail: "",
  primaryContactNumber: "",
  streetName: "",
  city: "",
  province: "",
  id: undefined,
  hasRestaurant: undefined,
  createdAt: undefined,
  updatedAt: undefined,
};

export const defaultHotelRoom: HotelRoomType = {
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

const defaultHotelRooms: HotelRoomType[] = [];
const defaultHotelStaff: HotelStaffType[] = [];
const defaultRestaurants: Restaurant[] = [];
const defaultRestaurantMeals: RestaurantMealType[] = [];

// Create context
const AddHotelContext = createContext<AddHotelContextProps | undefined>(undefined);

export const AddHotelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [hotelGeneral, setHotelGeneral] = useState<HotelGeneralType>(defaultHotelGeneral);
  const [hotelRooms, setHotelRooms] = useState<HotelRoomType[]>(defaultHotelRooms);
  const [hotelStaff, setHotelStaff] = useState<HotelStaffType[]>(defaultHotelStaff);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(defaultRestaurants);
  const [restaurantMeals, setRestaurantMeals] = useState<RestaurantMealType[]>(defaultRestaurantMeals);

  const addHotelRoom = (room: HotelRoomType) => {
    setHotelRooms(prev => [...prev, room]);
  };

  const addHotelStaff = (staff: HotelStaffType) => {
    setHotelStaff(prev => [...prev, staff]);
  };

  const addRestaurant = (restaurant: Restaurant) => {
    setRestaurants(prev => [...prev, restaurant]);
  };

  const addRestaurantMeal = (meal: RestaurantMealType, restaurantName:string) => {
    setRestaurantMeals(prev => [...prev, meal]);
    setRestaurants((prev) =>
    prev.map((res) =>
      res.restaurant?.name === restaurantName
        ? { ...res, meals: [...res.meals, meal] }
        : res
    )
  );
  };

  return (
    <AddHotelContext.Provider
      value={{
        hotelGeneral,
        hotelRooms,
        hotelStaff,
        restaurants,
        restaurantMeals,
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
