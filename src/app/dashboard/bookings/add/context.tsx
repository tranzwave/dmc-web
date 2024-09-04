import React, { createContext, ReactNode, useContext, useState } from 'react';
import { General } from '~/components/bookings/addBooking/forms/generalForm/columns';
import { Hotel } from '~/components/bookings/addBooking/forms/hotelsForm/columns';
import { RestaurantData } from '~/components/bookings/addBooking/forms/restaurantsForm';
import { Restaurant } from '~/components/bookings/addBooking/forms/restaurantsForm/columns';
import { Shop } from '~/components/bookings/addBooking/forms/shopsForm/columns';
import { Transport } from '~/components/bookings/addBooking/forms/transportForm/columns';
import { Driver } from '~/lib/types/driver/type';
import { InsertActivityVoucher, InsertHotelVoucher, InsertHotelVoucherLine, InsertRestaurantVoucher, InsertRestaurantVoucherLine, InsertShopVoucher, InsertTransportVoucher, SelectActivityVendor, SelectActivityVoucher, SelectDriver, SelectHotel, SelectHotelVoucher, SelectHotelVoucherLine, SelectRestaurant, SelectShop, SelectShopVoucher } from '~/server/db/schemaTypes';

export interface TransportWithDriver {
  transport: Transport;
  driver: Driver;
}

export type HotelVoucher = {
  hotel:SelectHotel,
  voucher:InsertHotelVoucher
  voucherLines:InsertHotelVoucherLine[]
}

export type RestaurantVoucher = {
  restaurant: RestaurantData,
  voucher: InsertRestaurantVoucher
  voucherLines: InsertRestaurantVoucherLine[]
}

export type ActivityVoucher = {
  vendor: SelectActivityVendor,
  voucher: InsertActivityVoucher
}

export type ShopVoucher = {
  shop: SelectShop,
  voucher: InsertShopVoucher
}

export type TransportVoucher = {
  driver: SelectDriver,
  voucher: InsertTransportVoucher
}

export interface BookingDetails {
  general: General; 
  vouchers: HotelVoucher[];
  restaurants: RestaurantVoucher[];
  activities: ActivityVoucher[];
  transport: TransportVoucher[];
  shops: ShopVoucher[];
}

export type StatusKey = "hotels" | "restaurants" | "transport" | "activities" | "shops";
export type StatusValue = "Mandatory" | "Locked";

// Define the type for the status labels map
export type StatusLabels = Record<StatusKey, StatusValue>;

// Define context properties
interface AddBookingContextProps {
  bookingDetails: BookingDetails;
  setGeneralDetails: (details: General) => void;
  addHotelVoucher: (hotel: HotelVoucher) => void;
  addRestaurantVoucher: (restaurant: RestaurantVoucher) => void;
  addActivity: (activity: ActivityVoucher) => void;
  addTransport: (transport: TransportVoucher) => void;
  addShop: (shop: ShopVoucher) => void;
  activeTab: string,
  setActiveTab: (tab:string) => void,
  statusLabels: StatusLabels,
  setStatusLabels: React.Dispatch<React.SetStateAction<StatusLabels>>;
}

// Provide default values
const defaultGeneral: General = {
  clientName: "",
  country:"",
  primaryEmail: "",
  adultsCount: 0,
  kidsCount: 0,
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
  name: "",
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
  vouchers: [],
  restaurants: [],
  activities: [],
  transport: [],
  shops: []
};



const AddBookingContext = createContext<AddBookingContextProps | undefined>(undefined);

export const AddBookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>(defaultBookingDetails);
  const [activeTab, setActiveTab] = useState<string>("general");
  const [statusLabels, setStatusLabels] = useState<StatusLabels>({
    hotels: "Locked",
    restaurants: "Locked",
    transport: "Locked",
    activities: "Locked",
    shops: "Locked",
  });

  const setGeneralDetails = (details: General) => {
    setBookingDetails(prev => ({ ...prev, general: details }));
  };

  const addHotelVoucher = (hotelVoucher: HotelVoucher) => {
    setBookingDetails(prev => ({ ...prev, vouchers: [...prev.vouchers, hotelVoucher] }));
  };

  const addRestaurantVoucher = (restaurantVoucher: RestaurantVoucher) => {
    console.log(`Restaurant ID-${restaurantVoucher.restaurant.id}`)
    setBookingDetails(prev => ({ ...prev, restaurants: [...prev.restaurants, restaurantVoucher] }));
  };

  const addActivity = (activity: ActivityVoucher) => {
    setBookingDetails(prev => ({ ...prev, activities: [...prev.activities, activity] }));
  };

  const addTransport = (transportWithDriver: TransportVoucher) => {
    setBookingDetails(prev => ({ ...prev, transport: [...prev.transport, transportWithDriver] }));
  };

  const addShop = (shop: ShopVoucher) => {
    setBookingDetails(prev => ({ ...prev, shops: [...prev.shops, shop] }));
  };

  return (
    <AddBookingContext.Provider
      value={{
        bookingDetails,
        setGeneralDetails,
        addHotelVoucher,
        addRestaurantVoucher,
        addActivity,
        addTransport,
        addShop,
        activeTab,
        setActiveTab,
        statusLabels,
        setStatusLabels
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
