import { SelectActivity, SelectActivityVendor, SelectActivityVoucher, SelectBooking, SelectBookingLine, SelectClient, SelectDriver, SelectHotel, SelectHotelVoucher, SelectHotelVoucherLine, SelectRestaurant, SelectRestaurantVoucher, SelectRestaurantVoucherLine, SelectShop, SelectShopVoucher, SelectTransportVoucher } from "~/server/db/schemaTypes";



export type BookingLineWithAllData = SelectBookingLine & {
  booking: SelectBooking & {
    client: SelectClient;
  };
  hotelVouchers: Array<SelectHotelVoucher & {
    hotel: SelectHotel;
    voucherLines: SelectHotelVoucherLine[];
  }>;
  restaurantVouchers: Array<SelectRestaurantVoucher & {
    restaurant: SelectRestaurant;
    voucherLines: SelectRestaurantVoucherLine[];
  }>;
  transportVouchers: Array<SelectTransportVoucher & {
    driver: SelectDriver;
  }>;
  activityVouchers: Array<SelectActivityVoucher & {
    activity: SelectActivity;
    activityVendor: SelectActivityVendor;
  }>;
  shopsVouchers: Array<SelectShopVoucher & {
    shop: SelectShop;
  }>;
};




export type BookingDTO = {
    id: string;
    tenantId: string;
    clientId: string;
    agentId: string;
    coordinatorId: string;
    managerId: string;
    tourType: string;
}