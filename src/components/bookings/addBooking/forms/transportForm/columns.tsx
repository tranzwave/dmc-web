import { ColumnDef } from "@tanstack/react-table";
import { TransportWithDriver } from "~/app/dashboard/bookings/add/context";
import { Driver, VehicleType } from "~/lib/types/driver/type";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";

export type Transport = {
  driver: Driver | null;
  vehicle: VehicleType;
  startDate: string;
  endDate: string;
  languages: string;
  type: "Driver" | "Guide" | "Both";
  remarks?: string; // Optional field
};

export const columns: ColumnDef<TransportWithDriver>[] = [
  {
    accessorKey: "driver.general.name",
    header: "Name",
  },
  {
    accessorKey: "transport.vehicle",
    header: "Vehicle",
  },
  {
    accessorKey: "transport.startDate",
    header: "Start Date",
  },
  {
    accessorKey: "transport.endDate",
    header: "End Date",
  },
  {
    accessorKey: "transport.languages",
    header: "Languages",
  },
  {
    accessorKey: "transport.type",
    header: "Type",
  },
  {
    accessorKey: "transport.remarks",
    header: "Remarks",
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <ActionsDropdown row={row.original} />
    ),
  },
];

const ActionsDropdown = ({ row }: { row: TransportWithDriver }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center">
        <EllipsisVertical className="w-4 h-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <DropdownMenuItem onClick={() => handleEdit(row)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDelete(row)}>
          Delete
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDuplicate(row)}>
          Duplicate
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const handleEdit = (row: TransportWithDriver) => {
  console.log("Edit", row);
};

const handleDelete = (row: TransportWithDriver) => {
  console.log("Delete", row);
};

const handleDuplicate = (row: TransportWithDriver) => {
  console.log("Duplicate", row);
};
