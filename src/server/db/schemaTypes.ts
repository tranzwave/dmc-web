import { activity, activityType, activityVendor, activityVoucher, agent, booking, bookingAgent, bookingLine, city, client, country, driver, driverLanguage, driverVehicle, driverVoucherLine, guide, guideLanguage, guideVoucherLine, hotel, hotelRoom, hotelStaff, hotelVoucher, hotelVoucherLine, language, marketingTeam, otherTransport, otherTransportVoucherLine, restaurant, restaurantMeal, restaurantVoucher, restaurantVoucherLine, shop, shopShopType, shopType, shopVoucher, tenant, transportVoucher, user, vehicle } from './schema';

//Country Types
export type InsertCountry = typeof country.$inferInsert;
export type SelectCountry = typeof country.$inferSelect;


//Tenant Types
export type InsertTenant = typeof tenant.$inferSelect;
export type SelectTenant = typeof tenant.$inferInsert;

//City Types
export type InsertCity = typeof city.$inferInsert;
export type SelectCity = typeof city.$inferSelect;

//Client Type
export type InsertClient = typeof client.$inferInsert;
export type SelectClient = typeof client.$inferSelect;

//Agent Type
export type InsertAgent = typeof agent.$inferInsert;
export type SelectAgent = typeof agent.$inferSelect;

export type SelectBookingAgent = typeof bookingAgent.$inferSelect

//User Type
export type InsertUser = typeof user.$inferInsert;
export type SelectUser = typeof user.$inferSelect;



// Hotel Types
export type InsertHotel = typeof hotel.$inferInsert;
export type SelectHotel = typeof hotel.$inferSelect;

export type InsertHotelRoom = typeof hotelRoom.$inferInsert;
export type SelectHotelRoom = typeof hotelRoom.$inferSelect;

export type InsertHotelStaff = typeof hotelStaff.$inferInsert;
export type SelectHotelStaff = typeof hotelStaff.$inferSelect;


// Driver Types
export type InsertDriver = typeof driver.$inferInsert;
export type SelectDriver = typeof driver.$inferSelect;

export type InsertVehicle = typeof vehicle.$inferInsert;
export type SelectVehicle = typeof vehicle.$inferSelect;

export type InsertDriverVehicle = typeof driverVehicle.$inferInsert;
export type SelectDriverVehicle = typeof driverVehicle.$inferSelect;

export type InsertDriverLanguage = typeof driverLanguage.$inferInsert;
export type SelectDriverLanguage = typeof driverLanguage.$inferSelect;

export type InsertGuide = typeof guide.$inferInsert;
export type SelectGuide = typeof guide.$inferSelect;

export type InsertGuideLanguage = typeof guideLanguage.$inferInsert;
export type SelectGuideLanguage = typeof guideLanguage.$inferSelect;

export type InsertLanguage = typeof language.$inferInsert;
export type SelectLanguage = typeof language.$inferSelect;

//Other transport types
export type InsertOtherTransport = typeof otherTransport.$inferInsert;
export type SelectOtherTransport = typeof otherTransport.$inferSelect;


// Activity Vendor Types
export type InsertActivity = typeof activity.$inferInsert;
export type SelectActivity = typeof activity.$inferSelect;

export type InsertActivityType = typeof activityType.$inferInsert;
export type SelectActivityType = typeof activityType.$inferSelect;

export type InsertActivityVendor = typeof activityVendor.$inferInsert;
export type SelectActivityVendor = typeof activityVendor.$inferSelect;


// Shop Types
export type InsertShop = typeof shop.$inferInsert;
export type SelectShop = typeof shop.$inferSelect;

export type InsertShopType = typeof shopType.$inferInsert;
export type SelectShopType = typeof shopType.$inferSelect;

export type SelectShopShopType = typeof shopShopType.$inferInsert;
export type InsertShopShopType = typeof shopShopType.$inferSelect;

// Shop Voucher Types
export type InsertShopVoucher = typeof shopVoucher.$inferInsert;
export type SelectShopVoucher = typeof shopVoucher.$inferSelect;


// Booking Types
export type InsertBooking = typeof booking.$inferInsert;
export type SelectBooking = typeof booking.$inferSelect;

// Booking Line Types
export type InsertBookingLine = typeof bookingLine.$inferInsert;
export type SelectBookingLine = typeof bookingLine.$inferSelect;

// Hotel Voucher Types
export type InsertHotelVoucher = typeof hotelVoucher.$inferInsert;
export type SelectHotelVoucher = typeof hotelVoucher.$inferSelect;

export type InsertHotelVoucherLine = typeof hotelVoucherLine.$inferInsert;
export type SelectHotelVoucherLine = typeof hotelVoucherLine.$inferSelect;

//Combined Hotel voucher details
export type CombinedHotelVoucher = InsertHotelVoucher & {
    voucherLines: InsertHotelVoucherLine[]
}

//Restaurant Types
export type InsertRestaurant = typeof restaurant.$inferInsert;
export type SelectRestaurant = typeof restaurant.$inferSelect;

//Meals Types
export type InsertMeal = typeof restaurantMeal.$inferInsert;
export type SelectMeal = typeof restaurantMeal.$inferSelect;


// Restaurant Voucher Types
export type InsertRestaurantVoucher = typeof restaurantVoucher.$inferInsert;
export type SelectRestaurantVoucher = typeof restaurantVoucher.$inferSelect;

//Restaurant Voucher Lines
export type InsertRestaurantVoucherLine = typeof restaurantVoucherLine.$inferInsert;
export type SelectRestaurantVoucherLine = typeof restaurantVoucherLine.$inferSelect;


// Transport Voucher Types
export type InsertTransportVoucher = typeof transportVoucher.$inferInsert;
export type SelectTransportVoucher = typeof transportVoucher.$inferSelect;

// Transport Voucher Types
export type InsertDriverVoucherLine = typeof driverVoucherLine.$inferInsert;
export type SelectDriverVoucherLine = typeof driverVoucherLine.$inferSelect;

// Transport Voucher Types
export type InsertGuideVoucherLine = typeof guideVoucherLine.$inferInsert;
export type SelectGuideVoucherLine = typeof guideVoucherLine.$inferSelect;

//Other transport voucher lines
export type InsertOtherTransportVoucherLine = typeof otherTransportVoucherLine.$inferInsert;
export type SelectOtherTransportVoucherLine = typeof otherTransportVoucherLine.$inferSelect;


// Activity Voucher Types
export type InsertActivityVoucher = typeof activityVoucher.$inferInsert;
export type SelectActivityVoucher = typeof activityVoucher.$inferSelect;

// Marketing Team
export type InsertMarketingTeam = typeof marketingTeam.$inferInsert;
export type SelectMarketingTeam = typeof marketingTeam.$inferSelect;


