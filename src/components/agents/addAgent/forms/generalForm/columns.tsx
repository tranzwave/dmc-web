"use client";

import { ColumnDef } from "@tanstack/react-table";

export type General = {
  name: string,
  countryCode: string,
  email: string,
  primaryContactNumber: string,
  agency: string,
  // feild1: string,
  // feild2: string,
  // feild3: string,
};

export const generalColumns: ColumnDef<General>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "countryCode",
    header: "Country",
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
    accessorKey: "agency",
    header: "Agency",
  },
  // {
  //   accessorKey: "feild1",
  //   header: "Feild 1",
  // },
  // {
  //   accessorKey: "feild2",
  //   header: "Feild 2",
  // },
  // {
  //   accessorKey: "feild3",
  //   header: "Feild 3",
  // },
];
