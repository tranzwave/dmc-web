"use client";

import { ColumnDef } from "@tanstack/react-table";
import { RestaurantVoucher } from "~/app/dashboard/bookings/add/context";

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

export const restaurantVoucherColumns: ColumnDef<RestaurantVoucher>[] = [
  {
    accessorKey: "restaurant.name",
    header: "Name",
  },
  {
    // accessorKey: "voucherLines[0]?.adultsCount",
    header: "Adults",
    accessorFn: (row) => row.voucherLines[0]?.adultsCount  // Fallback to 'N/A' if undefined
  },
  {
    header: "Kids",
    accessorFn: (row) => row.voucherLines[0]?.kidsCount || 0
  },
  {
    header: "Date",
    accessorFn: (row) => row.voucherLines[0]?.date
  },
  {
    header: "Time",
    accessorFn: (row) => row.voucherLines[0]?.time
  },
  {
    header: "Meal Type",
    accessorFn: (row) => row.voucherLines[0]?.mealType
  },
  {
    header: "Remarks",
    accessorFn: (row) => row.voucherLines[0]?.remarks
  },
];
