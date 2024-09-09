import { ColumnDef } from "@tanstack/react-table";
import { ActivityTypeDTO } from "~/app/dashboard/activities/add/context";
import { InsertActivity } from "~/server/db/schemaTypes"; // Import your activity type definition

export const columns: ColumnDef<ActivityTypeDTO>[] = [
  {
    accessorKey: "name",
    header: "Activity Name",
    cell: ({ row }) => <span>{row.original.name}</span>,
  },
  {
    accessorKey: "activityType",
    header: "Activity Type",
    cell: ({ row }) => <span>{row.original.typeName}</span>, // Assuming this will display a type ID or name
  },
  {
    accessorKey: "capacity",
    header: "Capacity",
    cell: ({ row }) => <span>{row.original.capacity}</span>,
  },
//   {
//     accessorKey: "activityVendorId",
//     header: "Vendor ID",
//     cell: ({ row }) => <span>{row.original.activityVendorId}</span>, // Assuming this will display an ID; you may adjust if you have a name or different field
//   },
//   {
//     accessorKey: "tenantId",
//     header: "Tenant ID",
//     cell: ({ row }) => <span>{row.original.tenantId}</span>, // Display the Tenant ID
//   },
//   {
//     accessorKey: "id",
//     header: "Activity ID",
//     cell: ({ row }) => <span>{row.original.id}</span>,
//   },
];
