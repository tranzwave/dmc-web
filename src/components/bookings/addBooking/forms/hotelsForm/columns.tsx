"use client";

import { ColumnDef } from "@tanstack/react-table";
import { HotelVoucher } from "~/app/dashboard/bookings/add/context";
import { HotelDTO } from "~/lib/types/hotel";


  
  export type Hotel = {
    hotelName: string;
    quantity: number;
    roomCount: number;
    checkInDate: string;
    checkInTime: string;
    checkOutDate: string;
    checkOutTime: string;
    roomType: string;
    basis: string;
    remarks?: string; // Optional field
  };
  

export const columns: ColumnDef<HotelDTO>[] = [
    {
      accessorKey: "hotelName",
      header: "Hotel Name",
    },
    {
      accessorKey: "city.name",
      header: "City",
    },
    {
      accessorKey: "stars",
      header: "Stars",
    },
    {
      accessorKey: "primaryContactNumber",
      header: "Contact Number",
    },
    {
      accessorKey: "primaryEmail",
      header: "Email",
    }
  ];


  export const voucherColumns: ColumnDef<HotelVoucher>[] = [
    {
      accessorKey: "hotel.hotelName",
      header: "Hotel Name",
    },
    {
      accessorKey: "voucherLines[0]?.adultsCount",
      header: "Quantity",
      cell: info => info.getValue() ?? 'N/A'  // Fallback to 'N/A' if undefined
    },
    {
      accessorKey: "voucherLines[0]?.roomCount",
      header: "Room Count",
      cell: info => info.getValue() ?? 'N/A'
    },
    {
      accessorKey: "voucherLines[0]?.checkInDate",
      header: "Check-In Date",
      cell: info => info.getValue() ?? 'N/A'
    },
    {
      accessorKey: "voucherLines[0]?.checkInTime",
      header: "Check-In Time",
      cell: info => info.getValue() ?? 'N/A'
    },
    {
      accessorKey: "voucherLines[0]?.checkOutDate",
      header: "Check-Out Date",
      cell: info => info.getValue() ?? 'N/A'
    },
    {
      accessorKey: "voucherLines[0]?.checkOutTime",
      header: "Check-Out Time",
      cell: info => info.getValue() ?? 'N/A'
    },
    {
      accessorKey: "voucherLines[0]?.roomType",
      header: "Room Type",
      cell: info => info.getValue() ?? 'N/A'
    },
    {
      accessorKey: "voucherLines[0]?.basis",
      header: "Basis",
      cell: info => info.getValue() ?? 'N/A'
    }
  ];
