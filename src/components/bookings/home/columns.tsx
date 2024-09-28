"use client";

import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "~/lib/utils/index";
import { SelectBooking, SelectBookingLine, SelectClient } from "~/server/db/schemaTypes";

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


export type BookingDTO = SelectBookingLine & {
  booking:SelectBooking & {
    client:SelectClient
  },
}

export const columns: ColumnDef<BookingDTO>[] = [
  {
    header: "Booking Id",
    accessorFn: (row) => row.booking.client.id,

  },
  {
    header: "Booking Name",
    accessorFn: (row) => row.booking.client.name,
  },
  // {
  //   header: "Country",
  //   accessorFn: (row) => row.booking.client.country,
  // },
  {
    accessorKey: "startDate",
    header: "Start Date",
    accessorFn: (row) => formatDate(row.startDate.toString()),
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    accessorFn: (row) => formatDate(row.endDate.toString())
  },

];
