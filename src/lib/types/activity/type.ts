import { ColumnDef } from "@tanstack/react-table"; // Adjust the import path as necessary
// Define the Address type
type Address = {
  streetName: string;
  city: string;
  province: string;
};

// Define the Activity type
type Activity = {
  general: {
    vendorName: string;
    activity: string;
    primaryEmail: string;
    primaryContactNumber: string;
    address: Address;
    capacity: number;
  };
};

export type { Activity };


export const activityColumns: ColumnDef<Activity>[] = [
  {
    accessorKey: "general.vendorName",
    header: "Vendor Name",
  },
  {
    accessorKey: "general.activity",
    header: "Activity",
  },
  {
    accessorKey: "general.primaryEmail",
    header: "Primary Email",
  },
  {
    accessorKey: "general.primaryContactNumber",
    header: "Primary Contact Number",
  },
  {
    accessorKey: "general.address.streetName",
    header: "Street Name",
  },
  {
    accessorKey: "general.address.city",
    header: "City",
  },
  {
    accessorKey: "general.address.province",
    header: "Province",
  },
  {
    accessorKey: "general.capacity",
    header: "Capacity",
  },
];
