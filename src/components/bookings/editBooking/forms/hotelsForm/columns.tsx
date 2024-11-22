"use client";

import { ColumnDef } from "@tanstack/react-table";
import { HotelVoucher } from "~/app/dashboard/bookings/add/context";
import { HotelDTO } from "~/lib/types/hotel";
import { formatDate } from "~/lib/utils/index";
import { InsertHotelVoucherLine } from "~/server/db/schemaTypes";

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
    },
    
  ];


  export const hotelVoucherColumns: ColumnDef<HotelVoucher>[] = [
    {
      accessorKey: "hotel.name",
      header: "Hotel Name",
    },
    {
      header: "Adults",
      // accessorFn: row => row.voucherLines[0]?.adultsCount ?? 0,
    },
    {
      header: "Kids",
      // accessorFn: row => row.voucherLines[0]?.kidsCount ?? 0,
    },
    {
      header: "Room Count",
      // accessorFn: row => row.voucherLines[0]?.roomCount ?? 0,
    },
    {
      header: "Check-In Date",
      // accessorFn: row => formatDate(row.voucherLines[0]?.checkInDate ?? ""),
    },
    {
      header: "Check-Out Date",
      // accessorFn: row => formatDate(row.voucherLines[0]?.checkOutDate ?? ""),
    },
    {
      header: "Rooms",
      // accessorFn: row =>  `${row.voucherLines[0]?.roomType}-${row.voucherLines[0]?.roomCategory}-${row.voucherLines[0]?.roomCount}`
    },
    {
      header: "Basis",
      // accessorFn: row => row.voucherLines[0]?.basis
    },
    {
      header:"Status",
      accessorFn: row => row.voucher.status ?? "Unsaved"
    }
  ];

  export const hotelVoucherLineColumns: ColumnDef<InsertHotelVoucherLine>[] = [
    {
      header: "Check-In Date",
      accessorKey: "checkInDate",
      accessorFn: row => formatDate(row.checkInDate ?? ""),
    },

    {
      header: "Check-Out Date",
      accessorKey: "checkOutDate",
      accessorFn: row => formatDate(row.checkOutDate ?? ""),
    },
 
    {
      header: "Rooms",
      accessorFn: row =>  `${row.roomType}-${row.roomCategory}-${row.roomCount}`
    },
    {
      header: "Adults",
      accessorKey: "adultsCount",
      accessorFn: row => row.adultsCount ?? 0,
    },
    {
      header: "Kids",
      accessorKey: "kidsCount",
      accessorFn: row => row.kidsCount ?? 0,
    },

    {
      header: "Basis",
      accessorFn: row => row.basis
    },
  ];
