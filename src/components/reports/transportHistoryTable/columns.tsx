"use client";

import { ColumnDef } from "@tanstack/react-table";

export type TransportHistory = {
  name: string;
  numberOfBookings: string;
  upcommingTrips: string;
  ongoingTrips: string;
};

export const columns: ColumnDef<TransportHistory>[] = [
  {
    accessorKey: "name",
    header: "Driver Name",
  },
  {
    accessorKey: "numberOfBookings",
    header: "Number of Bookings",
  },
  {
    accessorKey: "upcommingTrips",
    header: "Upcoming Trips",
  },
  {
    accessorKey: "ongoingTrips",
    header: "Ongoing Trips",
  },
];
