"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DriverBooking } from './transportHistoryTable';


export const columns: ColumnDef<DriverBooking>[] = [
  {
    accessorKey: "driverName",
    header: "Driver Name",
  },
  {
    accessorKey: "numberOfBookings",
    header: "Number of Bookings",
  },
  {
    accessorKey: "numberOfUpcomingTrips",
    header: "Upcoming Trips",
  },
  {
    accessorKey: "numberOfOngoingTrips",
    header: "Ongoing Trips",
  },
];
