
import { getHotelVouchers } from "~/server/db/queries/booking/hotelVouchers";
import { ColumnDef } from "@tanstack/react-table";
import HotelsForm from "./voucherForm/index";
import {formatDate } from "~/lib/utils/index";
import { SelectHotelVoucherLine } from "~/server/db/schemaTypes";
import TasksTab from "~/components/common/tasksTab";
import { HotelVoucherData } from "../hotels";

// Define specific columns for hotels
const hotelColumns: ColumnDef<HotelVoucherData>[] = [
  {
    accessorKey: "hotel.hotelName",
    header: "Hotel",
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

const hotelVoucherLineColumns: ColumnDef<SelectHotelVoucherLine>[] = [
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
    accessorFn: (row) => `${row.roomType} - ${row.roomCount} Room`,
  },
];

// Use TasksTab for Hotels
const HotelsTasksTab = ({ bookingLineId }: { bookingLineId: string }) => (
  <TasksTab
    bookingLineId={bookingLineId}
    columns={hotelColumns}
    voucherColumns={hotelVoucherLineColumns}
    fetchVouchers={getHotelVouchers}
    formComponent={HotelsForm}
  />
);

export default HotelsTasksTab;
