"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Charges = {
  feePerKm: number;
  fuelAllowance: number;
  accommodationAllowance: number;
  mealAllowance: number;
};

export const columns: ColumnDef<Charges>[] = [
  {
    accessorKey: "feePerKm",
    header: "Fee per km",
  },
  {
    accessorKey: "fuelAllowance",
    header: "Fuel Allowance",
  },
  {
    accessorKey: "accommodationAllowance",
    header: "Accomodation Allowance",
  },
  {
    accessorKey: "mealAllowance",
    header: "Meal Allowance",
  },
];
