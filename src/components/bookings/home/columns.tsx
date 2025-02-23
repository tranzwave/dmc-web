"use client";

import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "~/lib/utils/index";
import { SelectBooking, SelectBookingLine, SelectClient, SelectMarketingTeam, SelectUser } from "~/server/db/schemaTypes";
import {
  Hotel,
  Utensils,
  Car,
  Activity,
  ShoppingBag,
} from "lucide-react"; 
import { Badge } from "~/components/ui/badge";
import { useUser } from "@clerk/nextjs";
import { getUserPublicMetadata } from "~/server/auth";
import { booking } from "~/server/db/schema";

export type CategoryDetails = {
    title: string;
    statusCount: {
      inprogress: number,
      sentToVendor: number,
      vendorConfirmed:number,
      sentToClient:number,
      confirmed:number,
      cancelled:number,
      amended:number
    };
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
    client:SelectClient,
    marketingTeam: SelectMarketingTeam | null,
  },
  currentUser?: string
}

export const columns: ColumnDef<BookingDTO>[] = [
  {
    header: "Booking Id",
    accessorFn: (row) => row.id,

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
    header: "Team",
    accessorFn: (row) => row.booking.marketingTeam?.name ?? "N/A",
  },
  {
    header: "Booking Role",
    accessorFn: (row) => row.booking.managerId === row.currentUser ? "Manager" : row.booking.coordinatorId === row.currentUser ? "Coordinator" : "Team Member",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status:string = row.original.status ?? '';

      // Set badge color based on the status value
      const statusColor:any = {
        inprogress: "bg-yellow-500 text-white", // Yellow for in progress
        confirmed: "bg-green-500 text-white",  // Green for confirmed
        cancelled: "bg-red-500 text-white",    // Red for cancelled
      };

      return (
        <Badge className={statusColor[status.toLowerCase()]}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
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
