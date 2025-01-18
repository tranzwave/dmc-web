"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ShopVoucher } from "~/app/dashboard/bookings/add/context";
import { formatDate } from "~/lib/utils/index";

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
    // accessorFn: row => row.voucher.date
    accessorFn: row => formatDate(row.voucher?.date ?? ""),

  },
  {
    header: "Time",
    accessorFn: row => row.voucher.time
  },
  {
    header: "Adluts Count",
    accessorFn: row => row.voucher.adultsCount
  },
  {
    header: "Kids Count",
    accessorFn: row => row.voucher.kidsCount
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
