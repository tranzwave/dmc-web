import React, { createContext, ReactNode, useContext, useState } from 'react';
import { General } from '~/components/bookings/addBooking/forms/generalForm/columns';
import { Hotel } from '~/components/bookings/addBooking/forms/hotelsForm/columns';
import { Transport } from '~/components/bookings/addBooking/forms/transportForm/columns';
import { HotelWithRooms } from '~/components/bookings/editBooking/forms/hotelsForm';
import { OtherTransportWithCity } from '~/components/transports/addTransport/forms/generalForm/other-transport/columns';
import { Driver } from '~/lib/types/driver/type';
import { calculateDaysBetween } from '~/lib/utils/index';
import { InsertActivityVoucher, InsertDriverVoucherLine, InsertGuideVoucherLine, InsertHotelVoucher, InsertHotelVoucherLine, InsertOtherTransportVoucherLine, InsertRestaurantVoucher, InsertRestaurantVoucherLine, InsertShopVoucher, InsertTransportVoucher, SelectActivityVendor, SelectDriver, SelectGuide, SelectHotel, SelectOtherTransport, SelectRestaurant, SelectShop } from '~/server/db/schemaTypes';

export interface TransportWithDriver {
  transport: Transport;
  driver: Driver;
}

export type HotelVoucher = {
  hotel: HotelWithRooms;
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

export type TransportVoucher = {
  voucher: InsertTransportVoucher;
  driver?: SelectDriver | null; 
  guide?: SelectGuide | null;
  otherTransport?: OtherTransportWithCity | null;
  driverVoucherLine?: InsertDriverVoucherLine | null;
  guideVoucherLine?: InsertGuideVoucherLine | null;
  otherTransportVoucherLine?: InsertOtherTransportVoucherLine | null;
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
export type StatusValue = "Included" | "Not Included";

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

export interface HotelWiseItinerary {
  
}

// Define context properties
interface EditBookingContextProps {
  bookingDetails: BookingDetails;
  setGeneralDetails: (details: General) => void;
  addHotelVoucher: (hotel: HotelVoucher) => void;
  addHotelVouchers: (vouchers: HotelVoucher[]) => void;
  editHotelVoucher: (voucher: HotelVoucher, index: number, id: string) => void;
  deleteHotelVoucher: (index: number, id: string) => void;
  addRestaurantVoucher: (restaurant: RestaurantVoucher) => void;
  addRestaurantVouchers: (vouchers: RestaurantVoucher[]) => void;
  editRestaurantVoucher: (voucher: RestaurantVoucher, index: number, id: string) => void; // Added method
  deleteRestaurantVoucher: (index: number, id: string) => void; // Added method
  addActivity: (activity: ActivityVoucher) => void;
  addActivityVouchers: (activity: ActivityVoucher[]) => void;
  editActivityVoucher: (voucher: ActivityVoucher, index: number, id: string) => void; // Added method
  deleteActivityVoucher: (index: number, id: string) => void; // Added method
  addTransport: (transport: TransportVoucher) => void;
  addTransportVouchers: (vouchers: TransportVoucher[]) => void;
  deleteTransportVouchers: (index: number, id: string) => void; // Added method
  addShop: (shop: ShopVoucher) => void;
  addShopVouchers: (vouchers: ShopVoucher[]) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  statusLabels: StatusLabels;
  setStatusLabels: React.Dispatch<React.SetStateAction<StatusLabels>>;
  getBookingSummary: () => BookingSummary[];
  triggerRefetch: boolean;
  updateTriggerRefetch: () => void;
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
  marketingTeam: "",
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
    hotels: "Included",
    restaurants: "Not Included",
    transport: "Not Included",
    activities: "Not Included",
    shops: "Not Included",
  });
  const [triggerRefetch, setTriggerRefetch] = useState(false)

  const updateTriggerRefetch= ()=>{
    setTriggerRefetch(!triggerRefetch)
  }

  const setGeneralDetails = (details: General) => {
    setBookingDetails(prev => ({ ...prev, general: details }));
  };

  const addHotelVoucher = (hotelVoucher: HotelVoucher) => {
    setBookingDetails(prev => ({ ...prev, vouchers: [...prev.vouchers, hotelVoucher] }));
  };

  const addHotelVouchers = (hotelVouchers: HotelVoucher[]) => {
    setBookingDetails(prev => ({ ...prev, vouchers: hotelVouchers }));
  };

  const editHotelVoucher = (updatedVoucher: HotelVoucher, index: number, id: string) => {
    setBookingDetails((prev) => ({
      ...prev,
      vouchers: prev.vouchers.map((voucher, i) =>
        i === index && voucher.voucherLines[0]?.id === id ? updatedVoucher : voucher
      ),
    }));
  };

  const deleteHotelVoucher = (index: number, id: string) => {
    setBookingDetails((prev) => ({
      ...prev,
      vouchers: prev.vouchers.filter((voucher, i) => !(i === index && voucher.voucherLines[0]?.id === id)),
    }));
  };



  const addRestaurantVoucher = (restaurantVoucher: RestaurantVoucher) => {
    setBookingDetails(prev => ({ ...prev, restaurants: [...prev.restaurants, restaurantVoucher] }));
  };

  const addRestaurantVouchers = (vouchers: RestaurantVoucher[]) => {
    setBookingDetails(prev => ({ ...prev, restaurants: vouchers }));
  };

  const editRestaurantVoucher = (updatedVoucher: RestaurantVoucher, index: number, id: string) => {
    setBookingDetails((prev) => ({
      ...prev,
      restaurants: prev.restaurants.map((voucher, i) =>
        i === index && voucher.voucherLines[0]?.id === id ? updatedVoucher : voucher
      ),
    }));
  };

  const deleteRestaurantVoucher = (index: number, id: string) => {
    setBookingDetails((prev) => ({
      ...prev,
      restaurants: prev.restaurants.filter((voucher, i) => !(i === index && voucher.voucherLines[0]?.id === id)),
    }));
  };

  const addActivity = (activity: ActivityVoucher) => {
    setBookingDetails(prev => ({ ...prev, activities: [...prev.activities, activity] }));
  };

  const addActivityVouchers = (vouchers: ActivityVoucher[]) => {
    setBookingDetails(prev => ({ ...prev, activities: vouchers }));
  };

  const editActivityVoucher = (updatedVoucher: ActivityVoucher, index: number, id: string) => {
    setBookingDetails((prev) => ({
      ...prev,
      activities: prev.activities.map((voucher, i) =>
        i === index && voucher.voucher?.id === id ? updatedVoucher : voucher
      ),
    }));
  };

  const deleteActivityVoucher = (index: number, id: string) => {
    setBookingDetails((prev) => ({
      ...prev,
      activities: prev.activities.filter((voucher, i) => !(i === index && voucher.voucher?.id === id)),
    }));
  };

  const addTransport = (transport: TransportVoucher) => {
    setBookingDetails(prev => ({ ...prev, transport: [...prev.transport, transport] }));
    console.log(transport)
    console.log("Transport added")
    console.log(bookingDetails.transport)
  };

  const addTransportVouchers = (vouchers: TransportVoucher[]) => {
    setBookingDetails(prev => ({ ...prev, transport: vouchers }));
  };

  const deleteTransportVouchers = (index: number, id: string) => {
    setBookingDetails((prev) => ({
      ...prev,
      transport: prev.transport.filter((voucher, i) => !(i === index && voucher.voucher?.id === id)),
    }));
  };
  const addShop = (shop: ShopVoucher) => {
    setBookingDetails(prev => ({ ...prev, shops: [...prev.shops, shop] }));
  };

  const addShopVouchers = (vouchers: ShopVoucher[]) => {
    setBookingDetails(prev => ({ ...prev, shops: vouchers }));
  };

  const getBookingSummary = (): BookingSummary[] => {
    const { general, vouchers, restaurants, activities, transport, shops } = bookingDetails;
    const { startDate, endDate } = general;
    const bookingSummary: BookingSummary[] = [];
    const startDateObj = new Date(startDate);

    const numberOfDays = calculateDaysBetween(startDate,endDate)

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
        editHotelVoucher,
        deleteHotelVoucher,

        addRestaurantVoucher,
        addRestaurantVouchers,
        editRestaurantVoucher,
        deleteRestaurantVoucher,


        addActivity,
        addActivityVouchers,
        editActivityVoucher,
        deleteActivityVoucher,
        addTransport,
        addTransportVouchers,
        deleteTransportVouchers,
        addShop,
        addShopVouchers,
        activeTab,
        setActiveTab,
        statusLabels,
        setStatusLabels,
        getBookingSummary,
        triggerRefetch,
        updateTriggerRefetch
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
