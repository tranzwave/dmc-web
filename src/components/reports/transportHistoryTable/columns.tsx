"use client";

import { ColumnDef } from "@tanstack/react-table";

export type TransportHistory = {
  name: string;
  numberOfBookings: string;
  lastBookingDate: string;
};

export const columns: ColumnDef<TransportHistory>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "numberOfBookings",
    header: "Number of Bookings",
  },
  {
    accessorKey: "lastBookingDate",
    header: "Last Booking Date",
  },
];
