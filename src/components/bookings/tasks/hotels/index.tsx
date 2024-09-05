"use client";
import { useEffect, useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import { Button } from "~/components/ui/button";
import {
  columns,
  Hotel,
  voucherColumns,
} from "../../addBooking/forms/hotelsForm/columns";
import { Calendar } from "~/components/ui/calendar";
import { HotelVoucher } from "~/app/dashboard/bookings/add/context";
import {
  SelectBooking,
  SelectBookingLine,
  SelectHotel,
  SelectHotelVoucherLine,
} from "~/server/db/schemaTypes";
import { getHotelVouchers } from "~/server/db/queries/booking/hotelVouchers";
import { ColumnDef } from "@tanstack/react-table";
import HotelsForm from "../../addBooking/forms/hotelsForm/hotelsForm";
import DataTableDropDown from "~/components/common/dataTableDropdown";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

// Define props type for the HotelsTasksTab component
interface HotelsTasksTabProps {
  bookingLineId: string;
}

export type HotelVoucherData = {
  bookingLineId: string;
  id: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  coordinatorId: string;
  hotelId: string;
  hotel: SelectHotel;
  voucherLine: SelectHotelVoucherLine[];
};

const HotelsTasksTab: React.FC<HotelsTasksTabProps> = ({ bookingLineId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [hotelVouchers, setHotelVouchers] = useState<HotelVoucherData[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<HotelVoucherData>();
  const [selectedVoucherLine, setSelectedVoucherLine] =
    useState<SelectHotelVoucherLine>();


  const getHotelVoucherData = async () => {
    setLoading(true);

    try {
      const response = await getHotelVouchers(bookingLineId);

      if (!response) {
        throw new Error(`Error: ${bookingLineId}`);
      }
      console.log("Fetched Vouchers:", response);

      setHotelVouchers(response);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHotelVoucherData();
  }, []);

  // useEffect(()=>{
  //     if(vouchers){
  //         alert(vouchers[0]?.hotel.id)
  //     }
  // })

  const onAllHotelRowClick = (row: HotelVoucherData) => {
    console.log(row);
    setSelectedVoucher(row);
    setSelectedVoucherLine(row.voucherLine[0])

  };

  const onVoucherLineRowClick = (row: SelectHotelVoucherLine) => {
    console.log(row);
    setSelectedVoucherLine(row);
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="flex w-full flex-row justify-center gap-2">
        <div className="w-[25%]">
          <div className="card">
            <Calendar />
          </div>
        </div>
        <div className="card w-[70%] space-y-6">
          <div className="card-title">Hotel Information</div>
          <DataTable
            columns={allHotelsColumns}
            data={hotelVouchers}
            key={"allHotelsTable"}
            onRowClick={onAllHotelRowClick}
          />
          {/* <HotelsForm onAddHotel={updateHotels} /> */}
          <div className="flex flex-row items-end justify-between">
            <div>
              {selectedVoucher?.hotel
                ? `${selectedVoucher?.hotel.name} - Voucher Lines`
                : ""}
            </div>
            <div className="flex flex-row gap-2">
              <Button variant={"outline"} className="border-red-600">
                Cancel Hotel
              </Button>
              <Button variant={"primaryGreen"}>Add Confirmation</Button>
              <Button variant={"primaryGreen"}>Proceed</Button>
            </div>
          </div>
          <DataTable
            columns={selectedHotelVoucherLinesColumns}
            data={selectedVoucher?.voucherLine ?? []}
            onRowClick={onVoucherLineRowClick}
          />
          <div className="w-full flex flex-row items-end justify-end">
            <div className="flex flex-row gap-2">
              <Button variant={"outline"} className="border-primary-green">
                Contact Hotel
              </Button>
              <Button variant={"outline"} className="border-primary-green">Add New Line</Button>
            </div>
          </div>
          <HotelsForm
            hotels={selectedVoucher?.hotel ? [selectedVoucher?.hotel] : []}
            onAddHotel={() => console.log("Hotel added")}
            defaultValues={{
              adultsCount: selectedVoucherLine?.adultsCount ?? 0,
              kidsCount: selectedVoucherLine?.kidsCount ?? 0,
              hotelVoucherId: selectedVoucherLine?.hotelVoucherId ?? "",
              roomType: selectedVoucherLine?.roomType ?? "",
              basis: selectedVoucherLine?.basis ?? "",
              checkInDate: selectedVoucherLine?.checkInDate ?? "",
              checkInTime: selectedVoucherLine?.checkInTime ?? "",
              checkOutDate: selectedVoucherLine?.checkOutDate ?? "",
              checkOutTime: selectedVoucherLine?.checkOutTime ?? "",
              roomCount: selectedVoucherLine?.roomCount ?? 0,
            }}
          />
        </div>
      </div>
      <div className="flex w-[95%] flex-col items-center justify-center gap-2">
        <div className="flex w-full justify-end">
          {/* <Button variant={"primaryGreen"}>Next</Button> */}
        </div>
      </div>
    </div>
  );
};

export default HotelsTasksTab;

const allHotelsColumns: ColumnDef<HotelVoucherData>[] = [
  {
    header: "Hotel",
    accessorFn: (row) => row.hotel.name,
  },
  {
    accessorKey: "hotel.primaryEmail",
    header: "Email",
    cell: (info) => info.getValue() ?? "N/A",
  },
  {
    accessorKey: "voucherLine",
    header: "Voucher Lines",
    accessorFn: (row) => row.voucherLine.length,
  },
  {
    accessorKey: "voucherLine",
    header: "Progress",
    accessorFn: (row) => row.voucherLine.length,
  },
];

export function formatDate(dateString: string) {
  // Convert the date string to a Date object
  const date = new Date(dateString);

  // Extract the day, month, and year
  const day = String(date.getDate()).padStart(2, "0"); // Ensure day is 2 digits
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure month is 2 digits (0-based)
  const year = date.getFullYear(); // Get the full year

  // Format the date as dd/mm/yyyy
  return `${day}/${month}/${year}`;
}

const selectedHotelVoucherLinesColumns: ColumnDef<SelectHotelVoucherLine>[] = [
  {
    header: "Head Count",
    accessorFn: (row) => `${row.adultsCount}-Adults | ${row.kidsCount}-Kids`,
  },
  {
    accessorKey: "checkInDate",
    header: "Check In",
    accessorFn: (row) => formatDate(row.checkInDate),
  },
  {
    accessorKey: "checkOutDate",
    header: "Check Out",
    accessorFn: (row) => formatDate(row.checkOutDate),
  },
  {
    accessorKey: "basis",
    header: "Occupancy",
  },
  {
    header: "Room",
    accessorFn: (row) => `${row.roomType} - ${row.roomCount}`,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ getValue, row }) => {
        const voucherLine = row.original;
        return (
            <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {/* <DropdownMenuLabel>More</DropdownMenuLabel> */}
                <DropdownMenuItem onSelect={onView}>View</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={onEdit}>Edit</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={onDelete}>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
  }
];


  const onView = () => {
    alert("View action triggered");
  };

  const onEdit = () => {
    alert("Edit action triggered");
  };

  const onDelete = () => {
    alert("Delete action triggered");
  };
