import React, { createContext, ReactNode, useContext, useState } from 'react';
import { General } from '~/components/bookings/addBooking/forms/generalForm/columns';
import { Hotel } from '~/components/bookings/addBooking/forms/hotelsForm/columns';
import { Transport } from '~/components/bookings/addBooking/forms/transportForm/columns';
import { Driver } from '~/lib/types/driver/type';
import { InsertActivityVoucher, InsertDriverVoucherLine, InsertGuideVoucherLine, InsertHotelVoucher, InsertHotelVoucherLine, InsertOtherTransportVoucherLine, InsertRestaurantVoucher, InsertRestaurantVoucherLine, InsertShopVoucher, InsertTransportVoucher, SelectActivityVendor, SelectDriver, SelectGuide, SelectHotel, SelectOtherTransport, SelectRestaurant, SelectShop } from '~/server/db/schemaTypes';
import { TransportVoucher } from '../[id]/edit/context';

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
  restaurant: SelectRestaurant;
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

// export type TransportVoucher = {
//   voucher: InsertTransportVoucher;
//   driver?: SelectDriver | null
//   guide?: SelectGuide | null
//   otherTransport?: SelectOtherTransport | null
//   driverVoucherLine?: InsertDriverVoucherLine
//   guideVoucherLine?: InsertGuideVoucherLine
//   otherTransportVoucherLine?: InsertOtherTransportVoucherLine

// }

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
interface AddBookingContextProps {
  bookingDetails: BookingDetails;
  setGeneralDetails: (details: General) => void;
  addHotelVoucher: (hotel: HotelVoucher) => void;
  addRestaurantVoucher: (restaurant: RestaurantVoucher) => void;
  addActivity: (activity: ActivityVoucher) => void;
  addTransport: (transport: TransportVoucher) => void;
  addShop: (shop: ShopVoucher) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  statusLabels: StatusLabels;
  setStatusLabels: React.Dispatch<React.SetStateAction<StatusLabels>>;
  getBookingSummary: () => BookingSummary[];
  deleteHotel: (name: string) => void; // New deleteActivity method
  deleteRestaurant: (name: string) => void; // New deleteActivity method
  deleteActivity: (name: string) => void; // New deleteActivity method

}

// Provide default values
export const defaultGeneral: General = {
  clientName: "",
  country: "",
  primaryEmail: "",
  directCustomer: true,
  primaryContactNumber:"",
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

const AddBookingContext = createContext<AddBookingContextProps | undefined>(undefined);

export const AddBookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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

  const addRestaurantVoucher = (restaurantVoucher: RestaurantVoucher) => {
    setBookingDetails(prev => ({ ...prev, restaurants: [...prev.restaurants, restaurantVoucher] }));
  };

  const addActivity = (activity: ActivityVoucher) => {
    setBookingDetails(prev => ({ ...prev, activities: [...prev.activities, activity] }));
  };

  const addTransport = (vouchers: TransportVoucher) => {
    setBookingDetails(prev => ({ ...prev, transport: [...prev.transport, vouchers] }));
  };

  const addShop = (shop: ShopVoucher) => {
    setBookingDetails(prev => ({ ...prev, shops: [...prev.shops, shop] }));
  };

  const deleteHotel = (name: string) => {
    alert(name)
    // setActivityVendorDetails(prev => ({
    //   ...prev,
    //   activities: prev.activities.filter(activity => activity.name !== name)
    // }));
  };

  const deleteRestaurant = (name: string) => {
    alert(name)
  };

  const deleteActivity = (name: string) => {
    alert(name)
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
        setStatusLabels,
        getBookingSummary,
        deleteHotel,
        deleteRestaurant,
        deleteActivity
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
