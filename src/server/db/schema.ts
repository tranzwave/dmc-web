import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  boolean,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
  jsonb,
  json,
} from "drizzle-orm/pg-core";
import { AdapterAccount } from "next-auth/adapters";

export const createTable = pgTableCreator((name) => `dmc-web_${name}`);

// Users table (admin, members)
export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
  role: varchar("role", { length: 50 }).notNull(), // Role can be 'admin' or 'member'
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
});

// Clients table
export const clients = createTable("client", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  primaryEmail: varchar("primary_email", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
});

// Agents table
export const agents = createTable("agent", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
});

export const bookings = createTable("bookings", {
    id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
    clientId: varchar("client_id", { length: 255 }).references(() => clients.id).notNull(),
    agentId: varchar("agent_id", { length: 255 }).references(() => agents.id).notNull(),
    coordinatorId: varchar("coordinator_id", { length: 255 }).references(() => users.id).notNull(),
    managerId: varchar("manager_id", { length: 255 }).references(() => users.id).notNull(),
    tourType: varchar('tour_type', { length: 255 }).notNull(), // e.g., adventure, honeymoon

  });

export const bookingLines = createTable('booking_line',{
    id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
    bookingId: varchar("booking_id").notNull().references(() => bookings.id),
    includes:jsonb('includes').$type<{
        hotels:boolean,
        transport:boolean,
        activities:boolean
    }>(),// e.g., { hotels: true, transport: true, activities: false }
    adultsCount: integer("adults_count").notNull(),
    kidsCount: integer("kids_count").notNull(),
    startDate: timestamp('start_date').notNull(),
    endDate: timestamp('end_date').notNull(),

})

// Table for Hotels
//TODO Implement CHECK for stars
export const hotels = createTable("hotels", {
  id: varchar("id", { length: 255 })
  .notNull()
  .primaryKey()
  .$defaultFn(() => crypto.randomUUID()),
    hotelName: varchar("hotel_name", { length: 255 }).notNull(),
    stars: integer("stars").notNull(),
    primaryEmail: varchar("primary_email", { length: 255 }).notNull(),
    primaryContactNumber: varchar("primary_contact_number", { length: 20 }).notNull(),
    streetName: varchar("street_name", { length: 255 }).notNull(),
    city: varchar("city", { length: 255 }).notNull(),
    province: varchar("province", { length: 255 }).notNull(),
    hasRestaurant: boolean("has_restaurant").notNull().default(false),
    restaurants: jsonb("restaurants").$type<Array<{
      restaurantName: string;
      mealType: string;
      startTime: string;
      endTime: string;
    }>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).$onUpdate(() => new Date()),
  });
  
  // Table for Rooms
  export const hotelRooms = createTable("hotel_rooms", {
    id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
    hotelId: varchar("hotel_id").notNull().references(() => hotels.id),
    roomType: varchar("room_type", { length: 255 }).notNull(),
    typeName: varchar("type_name", { length: 255 }).notNull(),
    count: integer("count").notNull(),
    amenities: text("amenities").notNull(),
    floor: integer("floor").notNull(),
    bedCount: integer("bed_count").notNull(),
    additionalComments: text("additional_comments"),
    createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).$onUpdate(() => new Date()),
  });
  
  // Table for Hotel Staff
  export const hotelStaff = createTable("hotel_staff", {
    id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
    hotelId: varchar("hotel_id").notNull().references(() => hotels.id),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    contactNumber: varchar("contact_number", { length: 20 }).notNull(),
    occupation: varchar("occupation", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).$onUpdate(() => new Date()),
  });

// Hotel Vouchers table
export const hotelVouchers = createTable("hotel_voucher", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  bookingLineId: varchar("booking_line_id", { length: 255 }).references(() => bookingLines.id).notNull(),
  hotelId: varchar("hotel_id", { length: 255 }).references(() => hotels.id).notNull(),
  coordinatorId: varchar("coordinator_id", { length: 255 }).references(() => users.id).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
});

// Hotel Voucher Lines table
export const hotelVoucherLines = createTable("hotel_voucher_line", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  hotelVoucherId: varchar("hotel_voucher_id", { length: 255 }).references(() => hotelVouchers.id).notNull(),
  roomType: varchar("room_type", { length: 100 }).notNull(),
  basis: varchar("basis", { length: 10 }).notNull(), // HB, FB, BB
  checkInDate: timestamp("check_in_date").notNull(),
  checkOutDate: timestamp("check_out_date").notNull(),
  adultsCount: integer("adults_count").notNull(),
  kidsCount: integer("kids_count").notNull(),
  roomCount: integer("room_count").notNull(),
  remarks: text("remarks"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
});

// Restaurants table
export const restaurants = createTable("restaurant", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  contactNumber: varchar("contact_number", { length: 50 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
});

// Restaurant Vouchers table
export const restaurantVouchers = createTable("restaurant_voucher", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  bookingLineId: varchar("booking_line_id", { length: 255 }).references(() => bookingLines.id).notNull(),
  restaurantId: varchar("restaurant_id", { length: 255 }).references(() => restaurants.id).notNull(),
  coordinatorId: varchar("coordinator_id", { length: 255 }).references(() => users.id).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
});

// Restaurant Voucher Lines table
export const restaurantVoucherLines = createTable("restaurant_voucher_line", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  restaurantVoucherId: varchar("restaurant_voucher_id", { length: 255 }).references(() => restaurantVouchers.id).notNull(),
  mealType: varchar("meal_type", { length: 50 }).notNull(),
  date: timestamp("date").notNull(),
  time: varchar("time", { length: 10 }).notNull(),
  adultsCount: integer("adults_count").notNull(),
  kidsCount: integer("kids_count").notNull(),
  remarks: text("remarks"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
});

// Drivers table
export const drivers = createTable("driver", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  vehicleType: varchar("vehicle_type", { length: 100 }).notNull(),
  contactNumber: varchar("contact_number", { length: 50 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
});

// Transport Vouchers table
export const transportVouchers = createTable("transport_voucher", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  bookingLineId: varchar("booking_line_id", { length: 255 }).references(() => bookingLines.id).notNull(),
  driverId: varchar("driver_id", { length: 255 }).references(() => drivers.id).notNull(),
  coordinatorId: varchar("coordinator_id", { length: 255 }).references(() => users.id).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  languages: varchar("languages", { length: 255 }), // Comma-separated list of languages
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
});

// Activity Vendors table
export const activityVendors = createTable("activity_vendor", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  activityType: varchar("activity_type", { length: 255 }).notNull(),
  contactNumber: varchar("contact_number", { length: 50 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
});

// Activity Vouchers table
export const activityVouchers = createTable("activity_voucher", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  bookingLineId: varchar("booking_line_id", { length: 255 }).references(() => bookingLines.id).notNull(),
  activityVendorId: varchar("activity_vendor_id", { length: 255 }).references(() => activityVendors.id).notNull(),
  coordinatorId: varchar("coordinator_id", { length: 255 }).references(() => users.id).notNull(),
  date: timestamp("date").notNull(),
  time: varchar("time", { length: 10 }).notNull(),
  participantsCount: integer("participants_count").notNull(),
  remarks: text("remarks"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
});

// Shops table
export const shops = createTable("shop", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  contactNumber: varchar("contact_number", { length: 50 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
});

// Shop Vouchers table
export const shopVouchers = createTable("shop_voucher", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  bookingLineId: varchar("booking_line_id", { length: 255 }).references(() => bookingLines.id).notNull(),
  shopId: varchar("shop_id", { length: 255 }).references(() => shops.id).notNull(),
  coordinatorId: varchar("coordinator_id", { length: 255 }).references(() => users.id).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
});


export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  client: one(clients, {
    fields: [bookings.clientId],
    references: [clients.id],
  }),
  agent: one(agents, {
    fields: [bookings.agentId],
    references: [agents.id],
  }),
  coordinator: one(users, {
    fields: [bookings.coordinatorId],
    references: [users.id],
  }),
  manager: one(users, {
    fields: [bookings.managerId],
    references: [users.id],
  })
}));

export const bookingLinesRelations = relations(bookingLines, ({ one,many }) => ({
  booking: one(bookings, {
    fields: [bookingLines.bookingId],
    references: [bookings.id],
  }),
}));

export const hotelVouchersRelations = relations(hotelVouchers, ({ one }) => ({
  booking: one(bookingLines, {
    fields: [hotelVouchers.bookingLineId],
    references: [bookingLines.id],
  }),
  hotel: one(hotels, {
    fields: [hotelVouchers.hotelId],
    references: [hotels.id],
  }),
}));

export const restaurantVouchersRelations = relations(restaurantVouchers, ({ one }) => ({
  booking: one(bookings, {
    fields: [restaurantVouchers.bookingLineId],
    references: [bookings.id],
  }),
  restaurant: one(restaurants, {
    fields: [restaurantVouchers.restaurantId],
    references: [restaurants.id],
  }),
}));

export const transportVouchersRelations = relations(transportVouchers, ({ one }) => ({
  booking: one(bookings, {
    fields: [transportVouchers.bookingLineId],
    references: [bookings.id],
  }),
  driver: one(drivers, {
    fields: [transportVouchers.driverId],
    references: [drivers.id],
  }),
}));

export const activityVouchersRelations = relations(activityVouchers, ({ one }) => ({
  booking: one(bookingLines, {
    fields: [activityVouchers.bookingLineId],
    references: [bookingLines.id],
  }),
  activityVendor: one(activityVendors, {
    fields: [activityVouchers.activityVendorId],
    references: [activityVendors.id],
  }),
}));

export const shopVouchersRelations = relations(shopVouchers, ({ one }) => ({
  booking: one(bookings, {
    fields: [shopVouchers.bookingLineId],
    references: [bookings.id],
  }),
  shop: one(shops, {
    fields: [shopVouchers.shopId],
    references: [shops.id],
  }),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
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
  })
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  })
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
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
  })
);
