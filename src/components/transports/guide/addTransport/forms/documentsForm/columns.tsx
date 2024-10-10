"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Documents = {
  guideLicense: string;
};

export const columns: ColumnDef<Documents>[] = [
  {
    accessorKey: "guideLicense",
    header: "Guide License",
  },
];
