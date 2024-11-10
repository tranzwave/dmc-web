"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ActivityVoucher } from "~/app/dashboard/bookings/add/context";

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



export const columns: ColumnDef<ActivityVoucher>[] = [
  {
    
    header: "Activity Type",
    accessorFn: row => row.voucher.activityName
  },
  {
    
    header: "Location",
    accessorFn: row => row.voucher.city
  },
  {
    
    header: "Vendor",
    accessorFn: row => row.vendor.name
  },
  {
    
    header: "Date",
    accessorFn: row => row.voucher.date
  },
  // {
    
  //   header: "Time",
  //   accessorFn: row => row.voucher.time
  // },
  {
    
    header: "Hours",
    accessorFn: row => row.voucher.hours
  },
  {
    
    header: "Adults & Kids",
    accessorFn: row => (row.voucher.adultsCount ?? 1)+ (row.voucher.kidsCount ?? 0)
  },
  {
    
    header: "Remarks",
    accessorFn: row => row.voucher.remarks
  },
  {
    header: "Status",
    accessorFn: (row) => row.voucher.status
  },
];
