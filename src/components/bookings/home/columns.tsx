"use client";

import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "~/lib/utils/index";
import { SelectBooking, SelectBookingLine, SelectClient, SelectUser } from "~/server/db/schemaTypes";
import {
  Hotel,
  Utensils,
  Car,
  Activity,
  ShoppingBag,
} from "lucide-react"; 

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
  {
    accessorKey: "status",
    header: "Status",
    accessorFn: (row) => formatDate(row.endDate.toString())
  },
  {
    header: "Includes",
    id: "includes-icons",
    cell: ({ row }) => (
      <div className="flex flex-row gap-1">
        {/* Conditionally render the icons based on the includes fields with color applied */}
        {row.original.includes?.hotels && <Hotel size={16} color="#1E90FF"/>}
        {row.original.includes?.restaurants && (
          <Utensils size={16} color="#FF8C00"/>
        )}
        {row.original.includes?.transport && <Car size={16} color="#32CD32"  />}
        {row.original.includes?.activities && (
          <Activity size={16} color="#8A2BE2"  />
        )}
        {row.original.includes?.shops && <ShoppingBag size={16} color="#DC143C" />}
      </div>
    ),
  },

];
