"use client";

import { ColumnDef } from "@tanstack/react-table";
import { BookingDTO } from "~/lib/types/booking";

export type CategoryDetails = {
    title: string;
    vouchersToFinalize: number;
    done: number;
    totalVouchers: number;
    locked: boolean;
  };
  
  export type Booking = {
    id: string;  
    client: string;  // Client name or identifier
    date: string;    // Date in ISO format or similar
    days: number;    // Number of days
    progress: number; // Progress percentage
    details: {
      hotels: CategoryDetails;
      transport: CategoryDetails;
      activities: CategoryDetails;
      shops: CategoryDetails;
    };
  };
  

export const columns: ColumnDef<BookingDTO>[] = [
  {
    accessorKey: "client",
    header: "Client",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "days",
    header: "Days",
  },
  {
    accessorKey: "progress",
    header: "Progress",
  },
];
