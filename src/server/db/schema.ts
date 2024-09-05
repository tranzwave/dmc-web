import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTableCreator,
  primaryKey,
  text,
  varchar,
  timestamp,
  unique,
  serial,
  time,
  numeric,
  pgEnum,
} from "drizzle-orm/pg-core";
import { AdapterAccount } from "next-auth/adapters";

export const createTable = pgTableCreator((name) => `dmc-web_${name}`);

//Countries Table
export const country = createTable("countries", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(), // Country name
  code: varchar("code", { length: 3 }).notNull().unique(), // ISO 3166-1 alpha-3 code
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const tenant = createTable("tenants", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  country: varchar("country_code", { length: 3 })
    .references(() => country.code)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  domain: varchar("domain", { length: 255 }).notNull().unique(),
  subscriptionPlan: varchar("subscription", { length: 255 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Users table (admin, members)
export const user = createTable("users", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 255 })
    .references(() => tenant.id)
    .notNull(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
  role: varchar("role", { length: 50 }).notNull(), // Role can be 'admin' or 'member'
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Clients table
export const client = createTable("clients", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 255 })
    .references(() => tenant.id)
    .notNull(),
  country: varchar("country_code", { length: 3 })
    .references(() => country.code)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  primaryEmail: varchar("primary_email", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Agents table
export const agent = createTable("agents", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 255 })
    .references(() => tenant.id)
    .notNull(),
  country: varchar("country_code", { length: 3 })
    .references(() => country.code)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const booking = createTable("bookings", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 255 })
    .references(() => tenant.id)
    .notNull(),
  clientId: varchar("client_id", { length: 255 })
    .references(() => client.id)
    .notNull(),
  agentId: varchar("agent_id", { length: 255 })
    .references(() => agent.id)
    .notNull(),
  coordinatorId: varchar("coordinator_id", { length: 255 })
    .references(() => user.id)
    .notNull(),
  managerId: varchar("manager_id", { length: 255 })
    .references(() => user.id)
    .notNull(),
  tourType: varchar("tour_type", { length: 255 }).notNull(), // e.g., adventure, honeymoon
});

export const bookingLine = createTable("booking_lines", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  bookingId: varchar("booking_id")
    .notNull()
    .references(() => booking.id),
  includes: jsonb("includes").$type<{
    hotels: boolean;
    transport: boolean;
    activities: boolean;
  }>(), // e.g., { hotels: true, transport: true, activities: false }
  adultsCount: integer("adults_count").notNull(),
  kidsCount: integer("kids_count").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
});

export const city = createTable(
  "cities",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(), // City name
    country: varchar("country_code", { length: 3 })
      .references(() => country.code)
      .notNull(),
  },
  (table) => ({
    cityAk1: unique("city_ak_1").on(table.name, table.country),
  }),
);

export const cityRelations = relations(city, ({ one }) => ({
  country: one(country, {
    fields: [city.country],
    references: [country.code],
  }),
}));

// Table for Hotels
//TODO Implement CHECK for stars
export const hotel = createTable("hotels", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 255 })
    .references(() => tenant.id)
    .notNull(),
  name: varchar("hotel_name", { length: 255 }).notNull(),
  stars: integer("stars").notNull(),
  primaryEmail: varchar("primary_email", { length: 255 }).notNull(),
  primaryContactNumber: varchar("primary_contact_number", {
    length: 20,
  }).notNull(),
  streetName: varchar("street_name", { length: 255 }).notNull(),
  province: varchar("province", { length: 255 }).notNull(),
  hasRestaurant: boolean("has_restaurant").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()),
  cityId: integer("city_id")
    .references(() => city.id)
    .notNull(),
});

// Table for Rooms
export const hotelRoom = createTable("hotel_rooms", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  hotelId: varchar("hotel_id")
    .notNull()
    .references(() => hotel.id),
  roomType: varchar("room_type", { length: 255 }).notNull(),
  typeName: varchar("type_name", { length: 255 }).notNull(),
  count: integer("count").notNull(),
  amenities: text("amenities").notNull(),
  floor: integer("floor").notNull(),
  bedCount: integer("bed_count").notNull(),
  additionalComments: text("additional_comments"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()),
});

// Table for Hotel Staff
export const hotelStaff = createTable("hotel_staffs", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  hotelId: varchar("hotel_id")
    .notNull()
    .references(() => hotel.id),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  contactNumber: varchar("contact_number", { length: 20 }).notNull(),
  occupation: varchar("occupation", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()),
});

export const statusEnum = pgEnum('status', ['inprogress', 'sentToVendor','vendorConfirmed','sentToClient', 'confirmed', 'cancelled']);
// Hotel Vouchers table
export const hotelVoucher = createTable("hotel_vouchers", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  bookingLineId: varchar("booking_line_id", { length: 255 })
    .references(() => bookingLine.id)
    .notNull(),
  hotelId: varchar("hotel_id", { length: 255 })
    .references(() => hotel.id)
    .notNull(),
  coordinatorId: varchar("coordinator_id", { length: 255 })
    .references(() => user.id)
    .notNull(),
  status: statusEnum('status').default('inprogress'),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Hotel Voucher Lines table
export const hotelVoucherLine = createTable("hotel_voucher_lines", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  hotelVoucherId: varchar("hotel_voucher_id", { length: 255 })
    .references(() => hotelVoucher.id)
    .notNull(),
  rate: numeric('rate', { precision: 4 }),
  roomType: varchar("room_type", { length: 100 }).notNull(),
  basis: varchar("basis", { length: 10 }).notNull(), // HB, FB, BB
  checkInDate: varchar("check_in_date", { length: 100 }).notNull(),
  checkInTime: time("check_in_time").notNull(),
  checkOutDate: varchar("check_out_date", { length: 100 }).notNull(),
  checkOutTime: time("check_out_time").notNull(),
  adultsCount: integer("adults_count").notNull(),
  kidsCount: integer("kids_count").notNull(),
  roomCount: integer("room_count").notNull(),
  remarks: text("remarks").default("No Remarks").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Restaurants table
export const restaurant = createTable("restaurants", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 255 })
    .references(() => tenant.id)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  streetName: varchar("street_name", { length: 255 }).notNull(),
  province: varchar("province", { length: 255 }).notNull(),
  contactNumber: varchar("contact_number", { length: 50 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  cityId: integer("city_id")
    .references(() => city.id)
    .notNull(),
});

export const restaurantMeal = createTable("restaurant_meals", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  restaurantId: varchar("restaurant_id", { length: 255 }).references(
    () => restaurant.id,
  ),
  mealType: varchar("meal_type", { length: 50 }).notNull(),
  startTime: varchar("startTime", { length: 10 }).notNull(),
  endTime: varchar("endTime", { length: 10 }).notNull(),
});

// Restaurant Vouchers table
export const restaurantVoucher = createTable("restaurant_vouchers", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  bookingLineId: varchar("booking_line_id", { length: 255 })
    .references(() => bookingLine.id)
    .notNull(),
  restaurantId: varchar("restaurant_id", { length: 255 })
    .references(() => restaurant.id)
    .notNull(),
  coordinatorId: varchar("coordinator_id", { length: 255 })
    .references(() => user.id)
    .notNull(),
    status: statusEnum('status').default('inprogress'),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Restaurant Voucher Lines table
export const restaurantVoucherLine = createTable("restaurant_voucher_lines", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  restaurantVoucherId: varchar("restaurant_voucher_id", { length: 255 })
    .references(() => restaurantVoucher.id)
    .notNull(),
    rate: numeric('rate', { precision: 4 }),
  mealType: varchar("meal_type", { length: 50 }).notNull(),
  date: varchar("date", { length: 100 }).notNull(),
  time: varchar("time", { length: 10 }).notNull(),
  adultsCount: integer("adults_count").notNull(),
  kidsCount: integer("kids_count").notNull(),
  remarks: text("remarks"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const language = createTable("languages", {
  id: serial("id"),
  code: varchar("code", { length: 3 }).notNull().unique().primaryKey(), // ISO 3166-1 alpha-3 code
  name: varchar("name", { length: 50 }).notNull(),
});

export const vehicle = createTable("vehicles", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 255 })
    .references(() => tenant.id)
    .notNull(),
  vehicleType: varchar("vehicle_type", { length: 100 }).notNull(),
  numberPlate: varchar("number_plate", { length: 20 }).notNull().unique(),
  seats: integer("seats").notNull(),
  make: varchar("make", { length: 100 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  year: integer("year").notNull(),
  revenueLicense: varchar("revenue_license", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Drivers table
export const driver = createTable("drivers", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 255 })
    .references(() => tenant.id)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  primaryEmail: varchar("primary_email", { length: 255 }).notNull(),
  primaryContactNumber: varchar("primary_contact_number", {
    length: 20,
  }).notNull(),
  streetName: varchar("street_name", { length: 255 }).notNull(),
  province: varchar("province", { length: 255 }).notNull(),
  isGuide: boolean("has_restaurant").notNull().default(false),
  feePerKM: integer("fee_per_km").notNull().default(0),
  fuelAllowance: integer("fuel_allowance").notNull().default(0),
  accommodationAllowance: integer("accommodation_allowance")
    .notNull()
    .default(0),
  mealAllowance: integer("meal_allowance").notNull().default(0),
  driversLicense: varchar("drivers_license", { length: 255 }).notNull(),
  guideLicense: varchar("guide_license", { length: 255 }),
  insurance: varchar("insurance", { length: 255 }).notNull(),
  contactNumber: varchar("contact_number", { length: 50 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  cityId: integer("city_id")
    .references(() => city.id)
    .notNull(),
});

// Driver-Vehicle join table
export const driverVehicle = createTable(
  "driver_vehicles",
  {
    driverId: varchar("driver_id", { length: 255 })
      .references(() => driver.id)
      .notNull(),
    vehicleId: varchar("vehicle_id", { length: 255 })
      .references(() => vehicle.id)
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.driverId, table.vehicleId] }),
    };
  },
);

// Driver-Language join table
export const driverLanguage = createTable(
  "driver_languages",
  {
    driverId: varchar("driver_id", { length: 255 })
      .references(() => driver.id)
      .notNull(),
    languageCode: varchar("language_code", { length: 255 })
      .references(() => language.code)
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.driverId, table.languageCode] }),
    };
  },
);

// Transport Vouchers table
export const transportVoucher = createTable("transport_vouchers", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  bookingLineId: varchar("booking_line_id", { length: 255 })
    .references(() => bookingLine.id)
    .notNull(),
  driverId: varchar("driver_id", { length: 255 })
    .references(() => driver.id)
    .notNull(),
  coordinatorId: varchar("coordinator_id", { length: 255 })
    .references(() => user.id)
    .notNull(),
    status: statusEnum('status').default('inprogress'),
    rate: numeric('rate', { precision: 4 }),
  startDate: varchar("start_date", {length:100}).notNull(),
  endDate: varchar("end_date", {length:100}).notNull(),
  language: varchar("languages", { length: 255 }).notNull(),
  vehicleType: varchar("vehicle_type", { length: 255 }),
  remarks: varchar("remarks", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Activity Vendors table
export const activityVendor = createTable("activity_vendors", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 255 })
    .references(() => tenant.id)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  streetName: varchar("street_name", { length: 255 }).notNull(),
  province: varchar("province", { length: 255 }).notNull(),
  contactNumber: varchar("contact_number", { length: 50 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  cityId: integer("city_id")
    .references(() => city.id)
    .notNull(),
});

//Activity type
export const activity = createTable("activities", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 255 })
    .references(() => tenant.id)
    .notNull(),
  activityVendorId: varchar("activity_vendor_id", { length: 255 })
    .references(() => activityVendor.id)
    .notNull(),
  activityType: integer("activity_type_id")
    .references(() => activityType.id)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  capacity: integer("capacity").notNull(),
});

//Activity type
export const activityType = createTable("activity_types", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
});

// Activity Vouchers table
export const activityVoucher = createTable("activity_vouchers", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  bookingLineId: varchar("booking_line_id", { length: 255 })
    .references(() => bookingLine.id)
    .notNull(),
  activityName: varchar("activity_name", { length: 255 }).notNull(),
  city: varchar("city_name", { length: 50 }).notNull(),
  activityVendorId: varchar("activity_vendor_id", { length: 255 })
    .references(() => activityVendor.id)
    .notNull(),
  activityId: varchar("activity_id", { length: 255 })
    .references(() => activity.id)
    .notNull(),
  coordinatorId: varchar("coordinator_id", { length: 255 })
    .references(() => user.id)
    .notNull(),
  date: varchar("date", { length: 100 }).notNull(),
  time: varchar("time", { length: 10 }).notNull(),
  hours: integer("hours").notNull(),
  participantsCount: integer("participants_count").notNull(),
  remarks: text("remarks"),
  rate: numeric('rate', { precision: 4 }),
  status: statusEnum('status').default('inprogress'),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Shops table
export const shop = createTable("shops", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 255 })
    .references(() => tenant.id)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  streetName: varchar("street_name", { length: 255 }).notNull(),
  province: varchar("province", { length: 255 }).notNull(),
  contactNumber: varchar("contact_number", { length: 50 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  cityId: integer("city_id")
    .references(() => city.id)
    .notNull(),
});

export const shopType = createTable("shop_types", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
});

export const shopShopType = createTable(
  "shop_shop_type",
  {
    shopId: varchar("shop_id", { length: 255 })
      .references(() => shop.id)
      .notNull(),
    shopTypeId: integer("shop_type_id")
      .references(() => shopType.id)
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.shopId, table.shopTypeId] }),
    };
  },
);

// Shop Vouchers table
export const shopVoucher = createTable("shop_vouchers", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  bookingLineId: varchar("booking_line_id", { length: 255 })
    .references(() => bookingLine.id)
    .notNull(),
  shopId: varchar("shop_id", { length: 255 })
    .references(() => shop.id)
    .notNull(),
  coordinatorId: varchar("coordinator_id", { length: 255 })
    .references(() => user.id)
    .notNull(),
  shopType: varchar("shop_type", { length: 100 }).notNull(),
  date: varchar("date", { length: 100 }).notNull(),
  time: varchar("time", { length: 10 }).notNull(),
  hours: integer("hours").notNull(),
  participantsCount: integer("participants_count").notNull(),
  city: varchar("city_name", { length: 50 }).notNull(),
  remarks: text("remarks"),
  rate: numeric('rate', { precision: 4 }),
  status: statusEnum('status').default('inprogress'),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const bookingsRelations = relations(booking, ({ one }) => ({
  client: one(client, {
    fields: [booking.clientId],
    references: [client.id],
  }),
  agent: one(agent, {
    fields: [booking.agentId],
    references: [agent.id],
  }),
  coordinator: one(user, {
    fields: [booking.coordinatorId],
    references: [user.id],
  }),
  manager: one(user, {
    fields: [booking.managerId],
    references: [user.id],
  }),
}));

export const bookingLinesRelations = relations(
  bookingLine,
  ({ one, many }) => ({
    booking: one(booking, {
      fields: [bookingLine.bookingId],
      references: [booking.id],
    }),

    hotelVouchers: many(hotelVoucher),
    restaurantVouchers: many(restaurantVoucher),
    shopsVouchers: many(shopVoucher),
    transportVouchers: many(transportVoucher),
    activityVouchers: many(activityVoucher),
  }),
);

export const hotelRelations = relations(hotel, ({ one, many }) => ({
  city: one(city, {
    fields: [hotel.cityId],
    references: [city.id],
  }),
  hotelVoucher: many(hotelVoucher),
}));

export const hotelVouchersRelations = relations(
  hotelVoucher,
  ({ one, many }) => ({
    bookingLine: one(bookingLine, {
      fields: [hotelVoucher.bookingLineId],
      references: [bookingLine.id],
    }),
    hotel: one(hotel, {
      fields: [hotelVoucher.hotelId],
      references: [hotel.id],
    }),
    voucherLine: many(hotelVoucherLine),
  }),
);

export const hotelVoucherLinesRelations = relations(
  hotelVoucherLine,
  ({ one }) => ({
    hotelVoucher: one(hotelVoucher, {
      fields: [hotelVoucherLine.hotelVoucherId],
      references: [hotelVoucher.id],
    }),
  }),
);

export const restaurantRelations = relations(restaurant, ({ one, many }) => ({
  city: one(city, {
    fields: [restaurant.cityId],
    references: [city.id],
  }),
  restaurantVoucher: many(restaurantVoucher),
  restaurantMeal: many(restaurantMeal),
}));

export const restaurantMealsRelations = relations(
  restaurantMeal,
  ({ one }) => ({
    restaurant: one(restaurant, {
      fields: [restaurantMeal.restaurantId],
      references: [restaurant.id],
    }),
  }),
);

export const restaurantVouchersRelations = relations(
  restaurantVoucher,
  ({ one, many }) => ({
    bookingLine: one(bookingLine, {
      fields: [restaurantVoucher.bookingLineId],
      references: [bookingLine.id],
    }),
    restaurant: one(restaurant, {
      fields: [restaurantVoucher.restaurantId],
      references: [restaurant.id],
    }),
    voucherLine: many(restaurantVoucherLine),
  }),
);

export const restaurantVoucherLinesRelations = relations(
  restaurantVoucherLine,
  ({ one, many }) => ({
    restaurantVoucher: one(restaurantVoucher, {
      fields: [restaurantVoucherLine.restaurantVoucherId],
      references: [restaurantVoucher.id],
    }),
  }),
);

// Languages table relations
export const languageRelations = relations(language, ({ many }) => ({
  drivers: many(driverLanguage),
}));

// Vehicles table relations
export const vehicleRelations = relations(vehicle, ({ many }) => ({
  drivers: many(driverVehicle),
}));

// Drivers table relations
export const driverRelations = relations(driver, ({ many, one }) => ({
  tenant: one(tenant, {
    fields: [driver.tenantId],
    references: [tenant.id],
  }),
  city: one(city, {
    fields: [driver.cityId],
    references: [city.id],
  }),
  vehicles: many(driverVehicle),
  languages: many(driverLanguage),
  transportVouchers: many(transportVoucher),
}));

// Driver-Vehicle join table relations
export const driverVehicleRelations = relations(driverVehicle, ({ one }) => ({
  driver: one(driver, {
    fields: [driverVehicle.driverId],
    references: [driver.id],
  }),
  vehicle: one(vehicle, {
    fields: [driverVehicle.vehicleId],
    references: [vehicle.id],
  }),
}));

// Driver-Language join table relations
export const driverLanguageRelations = relations(driverLanguage, ({ one }) => ({
  driver: one(driver, {
    fields: [driverLanguage.driverId],
    references: [driver.id],
  }),
  language: one(language, {
    fields: [driverLanguage.languageCode],
    references: [language.code],
  }),
}));

// Transport Vouchers table relations
export const transportVoucherRelations = relations(transportVoucher, ({ one }) => ({
  bookingLine: one(bookingLine, {
    fields: [transportVoucher.bookingLineId],
    references: [bookingLine.id],
  }),
  driver: one(driver, {
    fields: [transportVoucher.driverId],
    references: [driver.id],
  }),
  coordinator: one(user, {
    fields: [transportVoucher.coordinatorId],
    references: [user.id],
  }),
}));


export const activityRelations = relations(activity, ({ one, many }) => ({
  activityVendor: one(activityVendor, {
    fields: [activity.activityVendorId],
    references: [activityVendor.id],
  }),
}));

export const activityVendorRelations = relations(
  activityVendor,
  ({ one, many }) => ({
    city: one(city, {
      fields: [activityVendor.cityId],
      references: [city.id],
    }),
    activity: many(activity),
  }),
);

export const activityVouchersRelations = relations(
  activityVoucher,
  ({ one }) => ({
    booking: one(bookingLine, {
      fields: [activityVoucher.bookingLineId],
      references: [bookingLine.id],
    }),
    activityVendor: one(activityVendor, {
      fields: [activityVoucher.activityVendorId],
      references: [activityVendor.id],
    }),
    activity: one(activity, {
      fields: [activityVoucher.activityId],
      references: [activity.id],
    }),
  }),
);

export const shopRelations = relations(shop, ({ one, many }) => ({
  shopTypes: many(shopShopType),  // Relation to the join table 'shop_shop_type'
  shopVouchers: many(shopVoucher), // Relation to the 'shop_vouchers' table
  city: one(city, {
    fields: [shop.cityId],
    references: [city.id],
  }),
}));

export const shopShopTypeRelations = relations(shopShopType, ({ one }) => ({
  shop: one(shop, {
    fields: [shopShopType.shopId],
    references: [shop.id],
  }),
  shopType: one(shopType, {
    fields: [shopShopType.shopTypeId],
    references: [shopType.id],
  }),
}));

export const shopVouchersRelations = relations(shopVoucher, ({ one }) => ({
  bookingLine: one(bookingLine, {
    fields: [shopVoucher.bookingLineId],
    references: [bookingLine.id],
  }),
  shop: one(shop, {
    fields: [shopVoucher.shopId],
    references: [shop.id],
  }),
  coordinator: one(user, {
    fields: [shopVoucher.coordinatorId],
    references: [user.id],
  }),
}));


export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => user.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(user, { fields: [accounts.userId], references: [user.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => user.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(user, { fields: [sessions.userId], references: [user.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);
