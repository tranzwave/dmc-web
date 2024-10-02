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
  hotel: SelectHotel;
  voucher: InsertHotelVoucher;
  voucherLines: InsertHotelVoucherLine[];
}

export type RestaurantVoucher = {
  restaurant: RestaurantData;
  voucher: InsertRestaurantVoucher;
  voucherLines: InsertRestaurantVoucherLine[];
}

export type ActivityVoucher = {
  vendor: SelectActivityVendor;
  voucher: InsertActivityVoucher;
}

export type ShopVoucher = {
  shop: SelectShop;
  voucher: InsertShopVoucher;
}

export type TransportVoucher = {
  driver: SelectDriver;
  voucher: InsertTransportVoucher;
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

export interface BookingSummary {
  day: number;
  date: string;
  hotel: HotelVoucher | null;
  restaurants: RestaurantVoucher[];
  activities: ActivityVoucher[];
  transport: TransportVoucher[];
  shops: ShopVoucher[];
}

// Define context properties
interface EditBookingContextProps {
  bookingDetails: BookingDetails;
  setGeneralDetails: (details: General) => void;
  addHotelVoucher: (hotel: HotelVoucher) => void;
  addHotelVouchers: (vouchers:HotelVoucher[]) => void;
  addRestaurantVoucher: (restaurant: RestaurantVoucher) => void;
  addActivity: (activity: ActivityVoucher) => void;
  addTransport: (transport: TransportVoucher) => void;
  addShop: (shop: ShopVoucher) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  statusLabels: StatusLabels;
  setStatusLabels: React.Dispatch<React.SetStateAction<StatusLabels>>;
  getBookingSummary: () => BookingSummary[];
}

// Provide default values
export const defaultGeneral: General = {
  clientName: "",
  country: "",
  primaryEmail: "",
  directCustomer:false,
  adultsCount: 0,
  kidsCount: 0,
  startDate: "",
  numberOfDays: 1,
  endDate: "",
  marketingManager: "",
  agent: "",
  tourType: "",
  includes: {
    hotels: true,
    restaurants: false,
    transport: false,
    activities: false,
    shops: false
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

const EditBookingContext = createContext<EditBookingContextProps | undefined>(undefined);

export const EditBookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>(defaultBookingDetails);
  const [activeTab, setActiveTab] = useState<string>("general");
  const [statusLabels, setStatusLabels] = useState<StatusLabels>({
    hotels: "Mandatory",
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

  const addHotelVouchers = (hotelVouchers: HotelVoucher[]) => {
    setBookingDetails(prev => ({ ...prev, vouchers: hotelVouchers }));
  };
  

  const addRestaurantVoucher = (restaurantVoucher: RestaurantVoucher) => {
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

  const getBookingSummary = (): BookingSummary[] => {
    const { general, vouchers, restaurants, activities, transport, shops } = bookingDetails;
    const { startDate, numberOfDays } = general;
    const bookingSummary: BookingSummary[] = [];
    const startDateObj = new Date(startDate);

    for (let day = 1; day <= numberOfDays; day++) {
      const currentDate = new Date(startDateObj);
      currentDate.setDate(startDateObj.getDate() + day - 1);

      const summaryForDay: BookingSummary = {
        day,
        date: currentDate.toISOString().split('T')[0] ?? "", // Format as YYYY-MM-DD
        hotel: vouchers.find(voucher => {
          const checkInDate = new Date(voucher.voucherLines[0]?.checkInDate ?? "1999-09-09");
          const checkOutDate = new Date(voucher.voucherLines[0]?.checkOutDate ?? "1999-09-09");
          return checkInDate <= currentDate && currentDate <= checkOutDate;
        }) ?? null,
        restaurants: restaurants.filter(restaurant => new Date(restaurant.voucherLines[0]?.date ?? "1999-09-09").toISOString().split('T')[0] === currentDate.toISOString().split('T')[0]),
        activities: activities.filter(activity => new Date(activity.voucher.date).toISOString().split('T')[0] === currentDate.toISOString().split('T')[0]),
        transport: transport.filter(t => {
          const startDate = new Date(t.voucher.startDate);
          const endDate = new Date(t.voucher.endDate ?? t.voucher.startDate);
          return startDate <= currentDate && currentDate <= endDate;
        }),
        shops: shops.filter(shop => new Date(shop.voucher.date).toISOString().split('T')[0] === currentDate.toISOString().split('T')[0]),
      };

      bookingSummary.push(summaryForDay);
    }

    return bookingSummary;
  };

  return (
    <EditBookingContext.Provider
      value={{
        bookingDetails,
        setGeneralDetails,
        addHotelVoucher,
        addHotelVouchers,
        addRestaurantVoucher,
        addActivity,
        addTransport,
        addShop,
        activeTab,
        setActiveTab,
        statusLabels,
        setStatusLabels,
        getBookingSummary
      }}
    >
      {children}
    </EditBookingContext.Provider>
  );
};

// Custom hook to use context
export const useEditBooking = (): EditBookingContextProps => {
  const context = useContext(EditBookingContext);
  if (!context) {
    throw new Error('useEditBooking must be used within an EditBookingProvider');
  }
  return context;
};
