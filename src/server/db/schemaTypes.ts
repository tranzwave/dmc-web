import { hotels, drivers, activityVendors, shops, bookings, bookingLines, hotelVouchers, restaurantVouchers, transportVouchers, activityVouchers, shopVouchers, restaurants, restaurantMeals, hotelStaff, hotelRooms, hotelVoucherLines } from './schema'

// Hotel Types
export type InsertHotel = typeof hotels.$inferInsert;
export type SelectHotel = typeof hotels.$inferSelect;

export type InsertHotelRoom = typeof hotelRooms.$inferInsert;
export type SelectHotelRoom = typeof hotelRooms.$inferSelect;

export type InsertHotelStaff = typeof hotelStaff.$inferInsert;
export type SelectHotelStaff = typeof hotelStaff.$inferSelect;


// Driver Types
export type InsertDriver = typeof drivers.$inferInsert;
export type SelectDriver = typeof drivers.$inferSelect;

// Activity Vendor Types
export type InsertActivity = typeof activityVendors.$inferInsert;
export type SelectActivity = typeof activityVendors.$inferSelect;

// Shop Types
export type InsertShop = typeof shops.$inferInsert;
export type SelectShop = typeof shops.$inferSelect;

// Booking Types
export type InsertBooking = typeof bookings.$inferInsert;
export type SelectBooking = typeof bookings.$inferSelect;

// Booking Line Types
export type InsertBookingLine = typeof bookingLines.$inferInsert;
export type SelectBookingLine = typeof bookingLines.$inferSelect;

// Hotel Voucher Types
export type InsertHotelVoucher = typeof hotelVouchers.$inferInsert;
export type SelectHotelVoucher = typeof hotelVouchers.$inferSelect;

export type InsertHotelVoucherLine = typeof hotelVoucherLines.$inferInsert;
export type SelectHotelVoucherLine = typeof hotelVoucherLines.$inferInsert;

//Restaurant Types
export type InsertRestaurant = typeof restaurants.$inferInsert;
export type SelectRestaurant = typeof restaurants.$inferSelect;

//Meals Types
export type InsertMeal = typeof restaurantMeals.$inferInsert;
export type SelectMeal = typeof restaurantMeals.$inferSelect;


// Restaurant Voucher Types
export type InsertRestaurantVoucher = typeof restaurantVouchers.$inferInsert;
export type SelectRestaurantVoucher = typeof restaurantVouchers.$inferSelect;

// Transport Voucher Types
export type InsertTransportVoucher = typeof transportVouchers.$inferInsert;
export type SelectTransportVoucher = typeof transportVouchers.$inferSelect;

// Activity Voucher Types
export type InsertActivityVoucher = typeof activityVouchers.$inferInsert;
export type SelectActivityVoucher = typeof activityVouchers.$inferSelect;

// Shop Voucher Types
export type InsertShopVoucher = typeof shopVouchers.$inferInsert;
export type SelectShopVoucher = typeof shopVouchers.$inferSelect;
