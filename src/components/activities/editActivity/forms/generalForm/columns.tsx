"use client";

import { ColumnDef } from "@tanstack/react-table";

export type General = {
  name: string;
  activity: string;
  primaryEmail: string;
  primaryContactNumber: string;
  streetName: string;
  city: string;
  province: string;
  capacity: string;
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
    accessorKey: "primaryEmail",
    header: "Primary Email",
  },
  {
    accessorKey: "primaryContactNumber",
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
    accessorKey: "capacity",
    header: "Capacity",
  },
];
