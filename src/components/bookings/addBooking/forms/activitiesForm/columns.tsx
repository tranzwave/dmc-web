"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Activity = {
  activityType: string;
  city: string;
  vendor: string;
  checkInDate: string;
  time: string;
  headCount: number;
  hours: number;
  remarks?: string; // Optional field
};

export const columns: ColumnDef<Activity>[] = [
  {
    accessorKey: "activityType",
    header: "Activity Type",
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "vendor",
    header: "Vendor",
  },
  {
    accessorKey: "checkInDate",
    header: "Check-In Date",
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
