"use client";

import { ColumnDef } from "@tanstack/react-table";

export type General = {
  name: string;
  contactNumber: string;
  streetName: string;
  city: string;
  province: string;
  shopType: string
};

export const generalColumns: ColumnDef<General>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "activity",
    header: "Activity",
  },
  {
    accessorKey: "contactNumber",
    header: "Primary Contact Number",
  },
  {
    accessorKey: "streetName",
    header: "Street Name",
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "province",
    header: "Province",
  },
  {
    accessorKey: "shopType",
    header: "Shop Type",
  },
];
