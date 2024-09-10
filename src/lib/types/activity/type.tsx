import { ColumnDef } from "@tanstack/react-table";
import DataTableDropDown from "~/components/common/dataTableDropdown";
import { SelectActivityVendor } from "~/server/db/schemaTypes";

// Define the Address type
type Address = {
  streetName: string;
  city: string;
  province: string;
};

// Define the Activity type
type Activity = {
  id: number
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


export const activityColumns: ColumnDef<SelectActivityVendor>[] = [
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
  {
    accessorKey: 'id',
    header: '',
    cell: ({ getValue, row }) => {
      const activity = row.original;

      return (
          <DataTableDropDown data={activity} routeBase="/activities/" 
          onViewPath={(data) => `/dashboard/activities/${data.id}`}
          onEditPath={(data) => `/dashboard/activities/${data.id}/edit`}
          onDeletePath={(data) => `/dashboard/activities/${data.id}/delete`}
/>
      );
    },
  },
];


const onView = () => {
  console.log("View action triggered");
  const path = `/dashboard/activities/${'data.id'}`
  window.location.href = path;
};

const onEdit = () => {
  console.log("Edit action triggered");
  const path = `/dashboard/activities/${'data.id'}/edit`;
  window.location.href = path;
};

const onDelete = () => {
  console.log("Delete action triggered");
  const path = `/dashboard/activities/${'data.id'}/delete`;
};
