import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import { TransportVoucher } from "~/app/dashboard/bookings/[id]/edit/context";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { Driver } from "~/lib/types/driver/type";
import { Guide } from "~/lib/types/guide/type";

export type OtherTransport = {
  transportType: Driver | Guide | null;
  vehicleType: string;
  startDate: string;
  endDate: string;
  languageCode: string;
  type: "Driver" | "Chauffeur" | "Guide";
  remarks?: string; // Optional field
};

import { format } from "date-fns";

export const otherTransportVoucherLineColumns: ColumnDef<TransportVoucher, unknown>[] = [
  {
    header: "Name",
    accessorFn: row => row.otherTransport?.name ?? "-",
  },
  {
    header: "Vehicle",
    accessorFn: row => row.otherTransport?.vehicleType ?? "-"
  },
  //city
  {
    header: "City",
    accessorFn: row => row.otherTransport?.city.name ?? "-"
  },
  //start andend locations
  {
    header: "Start Location",
    accessorFn: row => row.otherTransportVoucherLine?.startLocation ?? "-"
  },
  {
    header: "End Location",
    accessorFn: row => row.otherTransportVoucherLine?.endLocation ?? "-"
  },
  // adults and kids counts
  {
    header: "Adults",
    accessorFn: row => row.otherTransportVoucherLine?.adultsCount ?? "-"
  },
  {
    header: "Kids",
    accessorFn: row => row.otherTransportVoucherLine?.kidsCount ?? "-"
  },
  {
    header: "Start Date",
    accessorFn: row => row.otherTransportVoucherLine?.date ? format(new Date(row.otherTransportVoucherLine.date), 'dd/MM/yyyy') : '-'
  },
  {
    header: "Remarks",
    accessorFn: row => row.voucher.remarks
  },
  {
    header: "Status",
    accessorFn: (row) => row.voucher.status
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
