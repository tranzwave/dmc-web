"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Documents = {
  driverLicense: string;
  guideLicense: string;
  vehicleEmissionTest: string;
  insurance: string;
};

export const columns: ColumnDef<Documents>[] = [
  {
    accessorKey: "driverLicense",
    header: "Driver's License",
  },
  {
    accessorKey: "guideLicense",
    header: "Guide License",
  },
  {
    accessorKey: "vehicleEmissionTest",
    header: "Vehicle Emission Test",
  },
  {
    accessorKey: "insurance",
    header: "Insurance",
  },
];
