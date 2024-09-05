"use client";

import { ColumnDef } from "@tanstack/react-table";
import { HotelVoucher } from "~/app/dashboard/bookings/add/context";
import { formatDate } from "~/components/bookings/tasks/hotels";
import { HotelDTO } from "~/lib/types/hotel";


  
  export type Hotel = {
    name: string;
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
      accessorKey: "name",
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
      accessorKey: "hotel.name",
      header: "Hotel Name",
    },
    {
      header: "Adults",
      accessorFn: row => row.voucherLines[0]?.adultsCount || 0,
    },
    {
      header: "Kids",
      accessorFn: row => row.voucherLines[0]?.kidsCount || 0,
    },
    {
      header: "Room Count",
      accessorFn: row => row.voucherLines[0]?.roomCount || 0,
    },
    {
      header: "Check-In Date",
      accessorFn: row => formatDate(row.voucherLines[0]?.checkInDate || ""),
    },
    {
      header: "Check-In Time",
      accessorFn: row => row.voucherLines[0]?.checkInTime || ""
    },
    {
      header: "Check-Out Date",
      accessorFn: row => formatDate(row.voucherLines[0]?.checkOutDate || ""),
    },
    {
      header: "Check-Out Time",
      accessorFn: row => row.voucherLines[0]?.checkOutTime || ""
    },
    {
      header: "Rooms",
      accessorFn: row =>  `${row.voucherLines[0]?.roomType}-${row.voucherLines[0]?.roomCount}`
    },
    {
      header: "Basis",
      accessorFn: row => row.voucherLines[0]?.basis
    }
  ];
