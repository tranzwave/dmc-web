// Ensure this is the only place where HotelsBooking is defined
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { HotelsBooking } from "./hotelsBookingTable"; // Adjust the path accordingly

export const columns: ColumnDef<HotelsBooking, unknown>[] = [
  {
    accessorKey: "hotelName",
    header: "Name",
  },
  {
    accessorKey: "bookingCount",
    header: "Number of Bookings",
  },
  {
    accessorKey: "lastBookingDate",
    header: "Last Booking Date",
  },
];
