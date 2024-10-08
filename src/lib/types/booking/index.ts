import { bookingAgent, client } from '~/server/db/schema';
import { SelectActivity, SelectActivityVendor, SelectActivityVoucher, SelectAgent, SelectBooking, SelectBookingAgent, SelectBookingLine, SelectClient, SelectDriver, SelectHotel, SelectHotelVoucher, SelectHotelVoucherLine, SelectRestaurant, SelectRestaurantVoucher, SelectRestaurantVoucherLine, SelectShop, SelectShopVoucher, SelectTenant, SelectTransportVoucher } from "~/server/db/schemaTypes";



export type BookingLineWithAllData = SelectBookingLine & {
  booking: SelectBooking & {
    client: SelectClient;
    tenant:SelectTenant
    bookingAgent:SelectBookingAgent & {
      agent:SelectAgent
    }
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