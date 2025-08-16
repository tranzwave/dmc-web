import { TransportVoucher } from "~/app/dashboard/bookings/[id]/edit/context";
import { HotelWithRooms } from "~/components/bookings/editBooking/forms/hotelsForm";
import { OtherTransportWithCity } from "~/components/transports/addTransport/forms/generalForm/other-transport/columns";
import { SelectActivity, SelectActivityVendor, SelectActivityVoucher, SelectAgent, SelectBooking, SelectBookingAgent, SelectBookingLine, SelectClient, SelectDriver, SelectDriverVoucherLine, SelectGuide, SelectGuideVoucherLine, SelectHotel, SelectHotelVoucher, SelectHotelVoucherLine, SelectMarketingTeam, SelectOtherTransport, SelectOtherTransportVoucherLine, SelectRestaurant, SelectRestaurantVoucher, SelectRestaurantVoucherLine, SelectShop, SelectShopVoucher, SelectTenant, SelectTransportVoucher } from "~/server/db/schemaTypes";

export type BookingLineWithAllData = SelectBookingLine & {
  booking: SelectBooking & {
    client: SelectClient;
    tenant: SelectTenant;
    bookingAgent: SelectBookingAgent & {
      agent: SelectAgent;
    };
    marketingTeam: SelectMarketingTeam | null;
  };
  hotelVouchers: Array<SelectHotelVoucher & {
    hotel: HotelWithRooms;
    voucherLines: SelectHotelVoucherLine[];
  }>;
  restaurantVouchers: Array<SelectRestaurantVoucher & {
    restaurant: SelectRestaurant;
    voucherLines: SelectRestaurantVoucherLine[];
  }>;
  transportVouchers: Array<SelectTransportVoucher & {
    driver: SelectDriver | null;
    guide: SelectGuide | null;
    otherTransport: OtherTransportWithCity | null;
    driverVoucherLines: SelectDriverVoucherLine[];
    guideVoucherLines: SelectGuideVoucherLine[];
    otherTransportVoucherLines: SelectOtherTransportVoucherLine[];

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

export type TourPacket = {
  documents: { item: string; count: number }[];
  accessories: { item: string; count: number }[];
};

//Type for voucher confirmation details (responsiblePerson:string, confirmationNumber:string, reminderDate:string)
export type VoucherConfirmationDetails = {
  responsiblePerson: string;
  confirmationNumber: string;
  reminderDate: string;
};

//Voucher settings type (hotelVoucher currency, restaurant voucher currency, activity voucher currency, shop voucher currency, transport voucher currency)
export type VoucherSettings = {
  hotelVoucherCurrency: string;
  restaurantVoucherCurrency: string;
  activityVoucherCurrency: string;
  shopVoucherCurrency: string;
  transportVoucherCurrency: string;
};

//Type for tour expenses
export type TourExpense = {
  expense: string;
  description: string;
  amount: number;
};

//Type for flight details
export type FlightDetails = {
  arrivalFlight: string;
  arrivalDate: string;
  arrivalTime: string;
  departureFlight: string;
  departureDate: string;
  departureTime: string;
};

export type InvoiceDetails = {
  dueDate: string;
  depositPayment: string;
  currency: string;
  bankCharges: string;
  methodOfPayment: string;
  creditPeriod: string;
  issuedFor: string;
  issuedBy: string;
  selectedBankAccount?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    branchName: string;
    branchAddress: string;
    SWIFTCode: string;
  };
}

//type for tour invoice entry
export type TourInvoiceEntry = {
  service: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export type TourInvoice = {
  entries: TourInvoiceEntry[];
  invoiceDetails: InvoiceDetails;
};

