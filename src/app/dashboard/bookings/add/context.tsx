import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Activity } from '~/components/bookings/addBooking/forms/activitiesForm/columns';
import { General } from '~/components/bookings/addBooking/forms/generalForm/columns';
import { Hotel } from '~/components/bookings/addBooking/forms/hotelsForm/columns';
import { Restaurant } from '~/components/bookings/addBooking/forms/restaurantsForm/columns';
import { Shop } from '~/components/bookings/addBooking/forms/shopsForm/columns';
import { Transport } from '~/components/bookings/addBooking/forms/transportForm/columns';
import { Driver } from '~/lib/types/driver/type';

export interface TransportWithDriver {
  transport: Transport;
  driver: Driver;
}

export interface BookingDetails {
  general: General; 
  hotels: Hotel[];
  restaurants: Restaurant[];
  activities: Activity[];
  transport: TransportWithDriver[];
  shops: Shop[];
}

// Define context properties
interface AddBookingContextProps {
  bookingDetails: BookingDetails;
  setGeneralDetails: (details: General) => void;
  addHotel: (hotel: Hotel) => void;
  addRestaurant: (restaurant: Restaurant) => void;
  addActivity: (activity: Activity) => void;
  addTransport: (transportWithDriver: TransportWithDriver) => void;
  addShop: (shop: Shop) => void;
}

// Provide default values
const defaultGeneral: General = {
  clientName: "",
  primaryEmail: "",
  startDate: "",
  numberOfDays: 1,
  endDate: "",
  marketingManager: "",
  agent: "",
  tourType: "",
  includes: {
    hotels: false,
    transport: false,
    activities: false,
  },
};

const defaultHotel: Hotel = {
  hotelName: "",
  quantity: 0,
  roomCount: 0,
  checkInDate: "",
  checkInTime: "",
  checkOutDate: "",
  checkOutTime: "",
  roomType: "",
  basis: "",
  remarks: ""
};

const defaultBookingDetails: BookingDetails = {
  general: defaultGeneral,
  hotels: [],
  restaurants: [],
  activities: [],
  transport: [],
  shops: []
};

const AddBookingContext = createContext<AddBookingContextProps | undefined>(undefined);

export const AddBookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>(defaultBookingDetails);

  const setGeneralDetails = (details: General) => {
    setBookingDetails(prev => ({ ...prev, general: details }));
  };

  const addHotel = (hotel: Hotel) => {
    setBookingDetails(prev => ({ ...prev, hotels: [...prev.hotels, hotel] }));
  };

  const addRestaurant = (restaurant: Restaurant) => {
    setBookingDetails(prev => ({ ...prev, restaurants: [...prev.restaurants, restaurant] }));
  };

  const addActivity = (activity: Activity) => {
    setBookingDetails(prev => ({ ...prev, activities: [...prev.activities, activity] }));
  };

  const addTransport = (transportWithDriver: TransportWithDriver) => {
    setBookingDetails(prev => ({ ...prev, transport: [...prev.transport, transportWithDriver] }));
  };

  const addShop = (shop: Shop) => {
    setBookingDetails(prev => ({ ...prev, shops: [...prev.shops, shop] }));
  };

  return (
    <AddBookingContext.Provider
      value={{
        bookingDetails,
        setGeneralDetails,
        addHotel,
        addRestaurant,
        addActivity,
        addTransport,
        addShop
      }}
    >
      {children}
    </AddBookingContext.Provider>
  );
};

// Custom hook to use context
export const useAddBooking = (): AddBookingContextProps => {
  const context = useContext(AddBookingContext);
  if (!context) {
    throw new Error('useAddBooking must be used within an AddBookingProvider');
  }
  return context;
};
