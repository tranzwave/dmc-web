"use client";

import { ColumnDef } from "@tanstack/react-table";


  
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
  

export const columns: ColumnDef<Hotel>[] = [
    {
      accessorKey: "hotelName",
      header: "Hotel Name",
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
    },
    {
      accessorKey: "roomCount",
      header: "Room Count",
    },
    {
      accessorKey: "checkInDate",
      header: "Check-In Date",
    },
    {
      accessorKey: "checkInTime",
      header: "Check-In Time",
    },
    {
      accessorKey: "checkOutDate",
      header: "Check-Out Date",
    },
    {
      accessorKey: "checkOutTime",
      header: "Check-Out Time",
    },
    {
      accessorKey: "roomType",
      header: "Room Type",
    },
    {
      accessorKey: "basis",
      header: "Basis",
    }
  ];
