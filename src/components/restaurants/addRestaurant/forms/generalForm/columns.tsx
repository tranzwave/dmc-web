"use client";

import { ColumnDef } from "@tanstack/react-table";

export type General = {
  name: string;
  mealType: string;
  startTime: string;
  endTime: string;
  streetName: string;
  cityId: string;
  province: string;
  primaryContactNumber: string;
  tenantId: string
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
    accessorKey: "cityId",
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
