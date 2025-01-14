import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import { TransportVoucher } from "~/app/dashboard/bookings/[id]/edit/context";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { Driver } from "~/lib/types/driver/type";
import { Guide } from "~/lib/types/guide/type";

export type Transport = {
  driver: Driver | Guide | null;
  vehicleType: string;
  startDate: string;
  endDate: string;
  languageCode: string;
  type: "Driver" | "Chauffeur";
  remarks?: string; // Optional field
};

export const columns: ColumnDef<TransportVoucher>[] = [
  {
    header: "Name",
    accessorFn: row => row.driver?.name ?? row.guide?.name
  },
  {
    header: "Vehicle",
    accessorFn: row => row.driverVoucherLine?.vehicleType
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
    accessorFn: row => row.driver?.type ?? row.guide?.type
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
