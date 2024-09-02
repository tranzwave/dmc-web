import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import { TransportVoucher, TransportWithDriver } from "~/app/dashboard/bookings/add/context";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { Driver, VehicleType } from "~/lib/types/driver/type";

export type Transport = {
  driver: Driver | null;
  vehicleType: string;
  startDate: string;
  endDate: string;
  languageCode: string;
  type: "Driver" | "Chauffer";
  remarks?: string; // Optional field
};

export const columns: ColumnDef<TransportVoucher>[] = [
  {
    header: "Name",
    accessorFn: row => row.driver.name
  },
  {
    header: "Vehicle",
    accessorFn: row => row.voucher.vehicleType
  },
  {
    header: "Start Date",
    accessorFn: row => row.voucher.startDate
  },
  {
    header: "End Date",
    accessorFn: row => row.voucher.endDate
  },
  {
    header: "Language",
    accessorFn: row => row.voucher.language
  },
  {
    header: "Type",
    accessorFn: row => row.driver.isGuide ? "Chauffer" : "Driver"
  },
  {
    header: "Remarks",
    accessorFn: row => row.voucher.remarks
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <ActionsDropdown row={row.original} />
    ),
  },
];

const ActionsDropdown = ({ row }: { row: TransportVoucher }) => {
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

const handleEdit = (row: TransportVoucher) => {
  console.log("Edit", row);
};

const handleDelete = (row: TransportVoucher) => {
  console.log("Delete", row);
};

const handleDuplicate = (row: TransportVoucher) => {
  console.log("Duplicate", row);
};
