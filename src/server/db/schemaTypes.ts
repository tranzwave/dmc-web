import { hotel, driver, activityVendor, shop, booking, bookingLine, hotelVoucher, restaurantVoucher, transportVoucher, activityVoucher, shopVoucher, restaurant, restaurantMeal, hotelStaff, hotelRoom, hotelVoucherLine, tenant, city, client, agent, user, country, restaurantVoucherLine, activityType, activity } from './schema'

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
export type SelectHotelVoucherLine = typeof hotelVoucherLine.$inferInsert;

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

// Activity Voucher Types
export type InsertActivityVoucher = typeof activityVoucher.$inferInsert;
export type SelectActivityVoucher = typeof activityVoucher.$inferSelect;

// Shop Voucher Types
export type InsertShopVoucher = typeof shopVoucher.$inferInsert;
export type SelectShopVoucher = typeof shopVoucher.$inferSelect;
