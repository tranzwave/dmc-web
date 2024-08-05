"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Restaurant = {
  name: string;
  quantity: {
    adults: number;
    kids: number;
  };
  date: string;
  time: string;
  mealType: string;
  remarks?: string; // Optional field
};

export const columns: ColumnDef<Restaurant>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "quantity.adults",
    header: "Adults",
  },
  {
    accessorKey: "quantity.kids",
    header: "Kids",
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
    accessorKey: "mealType",
    header: "Meal Type",
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
  },
];
