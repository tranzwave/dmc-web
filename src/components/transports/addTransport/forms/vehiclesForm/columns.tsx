"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Vehicles = {
  vehicle: string;
  numberPlate: string;
  seats: number;
  make: string;
  model: string;
  year: string;
  vrl: string;
  id?: string;
};

export const columns: ColumnDef<Vehicles>[] = [
  {
    accessorKey: "vehicle",
    header: "Vehicle",
  },
  {
    accessorKey: "numberPlate",
    header: "Number Plate",
  },
  {
    accessorKey: "seats",
    header: "Seats",
  },
  {
    accessorKey: "make",
    header: "Make",
  },
  {
    accessorKey: "model",
    header: "Model",
  },
  {
    accessorKey: "year",
    header: "Year",
  },
  {
    accessorKey: "vrl",
    header: "VRL",
  },

];
