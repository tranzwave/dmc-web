"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ShopVoucher } from "~/app/dashboard/bookings/add/context";

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

export const columns: ColumnDef<ShopVoucher>[] = [
  {
    header: "Shop",
    accessorFn: row => row.shop.name
  },
  {
    header: "City",
    accessorFn: row => row.voucher.city
  },
  {
    header: "Shop Type",
    accessorFn: row => row.voucher.shopType
  },
  {
    header: "Date",
    accessorFn: row => row.voucher.date
  },
  {
    header: "Time",
    accessorFn: row => row.voucher.time
  },
  {
    header: "Head Count",
    accessorFn: row => row.voucher.participantsCount
  },
  {
    header: "Hours",
    accessorFn: row => row.voucher.hours
  },
  {
    header: "Remarks",
    accessorFn: row => row.voucher.remarks
  },
];
