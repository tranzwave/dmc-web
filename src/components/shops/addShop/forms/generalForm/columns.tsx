"use client";

import { ColumnDef } from "@tanstack/react-table";

export type General = {
  name: string;
  contactNumber: string;
  streetName: string;
  city: string;
  province: string;
  shopTypes?: { id: number; name: string; }[]; 
};

export const generalColumns: ColumnDef<General>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "contactNumber",
    header: "Contact Number",
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
    accessorKey: "province",
    header: "Province",
  },
  {
    accessorKey: "shopType",
    header: "Shop Type",
  },
];
