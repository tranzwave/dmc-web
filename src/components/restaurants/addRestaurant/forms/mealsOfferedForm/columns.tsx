"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MealType } from "~/app/dashboard/restaurants/add/context";

export const columns: ColumnDef<MealType>[] = [
  {
    accessorKey: "mealType",
    header: "Meal Type",
  },
  {
    accessorKey: "startTime",
    header: "Start Time",
  },
  {
    accessorKey: "endTime",
    header: "EndTime",
  }
];
