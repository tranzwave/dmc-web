"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Shop = {
  shopType: string;
  city: string;
  productType: string;
  date: string;
  time: string;
  headCount: number;
  hours: number;
  remarks?: string;
};

export const columns: ColumnDef<Shop>[] = [
  {
    accessorKey: "shopType",
    header: "Shop Type",
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "productType",
    header: "Product Type",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "time",
    header: "Time",
  },
  {
    accessorKey: "headCount",
    header: "Head Count",
  },
  {
    accessorKey: "hours",
    header: "Hours",
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
  },
];
