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
} from "drizzle-orm/pg-core";

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

// Bookings table
export const bookings = createTable("booking", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  // parentId: varchar("parent_id", { length: 255 }).references(() => bookings.id),
  clientId: varchar("client_id", { length: 255 }).references(() => users.id),
  clientName: varchar("client_name", { length: 255 }).notNull(),
  primaryEmail: varchar("primary_email", { length: 255 }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  numberOfDays: integer("number_of_days").notNull(),
  marketingManager: varchar("marketing_manager", { length: 255 }),
  agent: varchar("agent", { length: 255 }),
  tourType: varchar("tour_type", { length: 255 }),
  includes: text("includes").notNull(), // JSON or comma-separated values for hotels, transport, activities
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
});

// Table for Hotels
//TODO Implement CHECK for stars
export const hotels = createTable("hotels", {
  id: serial("id").primaryKey(),
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
  id: serial("id").primaryKey(),
  hotelId: integer("hotel_id").notNull().references(() => hotels.id),
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
  id: serial("id").primaryKey(),
  hotelId: integer("hotel_id").notNull().references(() => hotels.id),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  contactNumber: varchar("contact_number", { length: 20 }).notNull(),
  occupation: varchar("occupation", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).$onUpdate(() => new Date()),
});




// Transport table
export const transport = createTable("transport", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  bookingId: varchar("booking_id", { length: 255 })
    .notNull()
    .references(() => bookings.id),
  vehicleType: varchar("vehicle_type", { length: 50 }).notNull(), // e.g., CAR, BUS, VAN, TUK
  numberPlate: varchar("number_plate", { length: 50 }).notNull(),
  seats: integer("seats").notNull(),
  make: varchar("make", { length: 255 }).notNull(),
  model: varchar("model", { length: 255 }).notNull(),
  year: integer("year").notNull(),
  licenseID: varchar("license_id", { length: 255 }).notNull(),
  primary: boolean("primary").notNull(),
  charges: text("charges").notNull(), // JSON or separate table for Charges
  documents: text("documents").notNull(), // JSON or separate table for Documents
});

// Activities table
export const activities = createTable("activity", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  bookingId: varchar("booking_id", { length: 255 })
    .notNull()
    .references(() => bookings.id),
  vendorName: varchar("vendor_name", { length: 255 }).notNull(),
  activity: varchar("activity", { length: 255 }).notNull(),
  primaryEmail: varchar("primary_email", { length: 255 }).notNull(),
  primaryContactNumber: varchar("primary_contact_number", { length: 50 }).notNull(),
  address: text("address").notNull(), // JSON or separate table for Address
  capacity: integer("capacity").notNull(),
});

// Shops table
export const shops = createTable("shop", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  bookingId: varchar("booking_id", { length: 255 })
    .notNull()
    .references(() => bookings.id),
  shopName: varchar("shop_name", { length: 255 }).notNull(),
  address: text("address").notNull(), // JSON or separate table for Address
  contactNumber: varchar("contact_number", { length: 50 }).notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  client: one(users, { fields: [bookings.clientId], references: [users.id] }),
  // parentBooking: one(bookings, { fields: [bookings.parentId], references: [bookings.id] }),
  // childBookings: many(bookings, { fields: [bookings.id], references: [bookings.parentId] }),
  hotels: many(hotels),
  transport: many(transport),
  activities: many(activities),
  shops: many(shops),
}));

export const hotelsRelations = relations(hotels, ({ one }) => ({
  booking: one(bookings, { fields: [hotels.id], references: [bookings.id] }),
}));

export const transportRelations = relations(transport, ({ one }) => ({
  booking: one(bookings, { fields: [transport.bookingId], references: [bookings.id] }),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  booking: one(bookings, { fields: [activities.bookingId], references: [bookings.id] }),
}));

export const shopsRelations = relations(shops, ({ one }) => ({
  booking: one(bookings, { fields: [shops.bookingId], references: [bookings.id] }),
}));

// export type Hotel = typeof hotels.$inferInsert
// export type HotelRooms = typeof hotelRooms.$inferInsert


export type InsertHotel = typeof hotels.$inferInsert
export type SelectHotel = typeof hotels.$inferSelect

export type InsertDriver = typeof transport.$inferInsert
export type SelectDriver = typeof transport.$inferSelect

export type InsertActivity = typeof activities.$inferInsert
export type SelectActivity = typeof activities.$inferSelect

export type InsertShop = typeof shops.$inferInsert
export type SelectShop = typeof shops.$inferSelect

export type InsertBooking = typeof bookings.$inferInsert
export type SelectBooking = typeof bookings.$inferSelect







// import { relations, sql } from "drizzle-orm";
// import {
//   index,
//   integer,
//   pgTableCreator,
//   primaryKey,
//   serial,
//   text,
//   timestamp,
//   varchar,
// } from "drizzle-orm/pg-core";
// import { type AdapterAccount } from "next-auth/adapters";

// /**
//  * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
//  * database instance for multiple projects.
//  *
//  * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
//  */
// export const createTable = pgTableCreator((name) => `dmc-web_${name}`);

// export const posts = createTable(
//   "post",
//   {
//     id: serial("id").primaryKey(),
//     name: varchar("name", { length: 256 }),
//     createdById: varchar("created_by", { length: 255 })
//       .notNull()
//       .references(() => users.id),
//     createdAt: timestamp("created_at", { withTimezone: true })
//       .default(sql`CURRENT_TIMESTAMP`)
//       .notNull(),
//     updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
//       () => new Date()
//     ),
//   },
//   (example) => ({
//     createdByIdIdx: index("created_by_idx").on(example.createdById),
//     nameIndex: index("name_idx").on(example.name),
//   })
// );

// export const users = createTable("user", {
//   id: varchar("id", { length: 255 })
//     .notNull()
//     .primaryKey()
//     .$defaultFn(() => crypto.randomUUID()),
//   name: varchar("name", { length: 255 }),
//   email: varchar("email", { length: 255 }).notNull(),
//   emailVerified: timestamp("email_verified", {
//     mode: "date",
//     withTimezone: true,
//   }).default(sql`CURRENT_TIMESTAMP`),
//   image: varchar("image", { length: 255 }),
// });

// export const usersRelations = relations(users, ({ many }) => ({
//   accounts: many(accounts),
// }));

// export const accounts = createTable(
//   "account",
//   {
//     userId: varchar("user_id", { length: 255 })
//       .notNull()
//       .references(() => users.id),
//     type: varchar("type", { length: 255 })
//       .$type<AdapterAccount["type"]>()
//       .notNull(),
//     provider: varchar("provider", { length: 255 }).notNull(),
//     providerAccountId: varchar("provider_account_id", {
//       length: 255,
//     }).notNull(),
//     refresh_token: text("refresh_token"),
//     access_token: text("access_token"),
//     expires_at: integer("expires_at"),
//     token_type: varchar("token_type", { length: 255 }),
//     scope: varchar("scope", { length: 255 }),
//     id_token: text("id_token"),
//     session_state: varchar("session_state", { length: 255 }),
//   },
//   (account) => ({
//     compoundKey: primaryKey({
//       columns: [account.provider, account.providerAccountId],
//     }),
//     userIdIdx: index("account_user_id_idx").on(account.userId),
//   })
// );

// export const accountsRelations = relations(accounts, ({ one }) => ({
//   user: one(users, { fields: [accounts.userId], references: [users.id] }),
// }));

// export const sessions = createTable(
//   "session",
//   {
//     sessionToken: varchar("session_token", { length: 255 })
//       .notNull()
//       .primaryKey(),
//     userId: varchar("user_id", { length: 255 })
//       .notNull()
//       .references(() => users.id),
//     expires: timestamp("expires", {
//       mode: "date",
//       withTimezone: true,
//     }).notNull(),
//   },
//   (session) => ({
//     userIdIdx: index("session_user_id_idx").on(session.userId),
//   })
// );

// export const sessionsRelations = relations(sessions, ({ one }) => ({
//   user: one(users, { fields: [sessions.userId], references: [users.id] }),
// }));

// export const verificationTokens = createTable(
//   "verification_token",
//   {
//     identifier: varchar("identifier", { length: 255 }).notNull(),
//     token: varchar("token", { length: 255 }).notNull(),
//     expires: timestamp("expires", {
//       mode: "date",
//       withTimezone: true,
//     }).notNull(),
//   },
//   (vt) => ({
//     compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
//   })
// );
