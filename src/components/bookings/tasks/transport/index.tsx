import React from 'react';
import { getTransportVouchers } from "~/server/db/queries/booking/transportVouchers";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "~/lib/utils/index";
import { SelectTransportVoucher } from "~/server/db/schemaTypes";
import TasksTab from "~/components/common/tasksTab";
import TransportForm from './form';

export type TransportVoucherData = SelectTransportVoucher & {

}

// Define specific columns for transport
const transportColumns: ColumnDef<TransportVoucherData>[] = [
  {
    accessorKey: "driver.driverName",
    header: "Driver",
  },
  {
    accessorKey: "driver.primaryEmail",
    header: "Email",
    cell: (info) => info.getValue() ?? "N/A",
  },
  {
    accessorKey: "voucherLine",
    header: "Voucher Lines",
    accessorFn: (row) => row.driverId,
  },
  {
    accessorKey: "voucherLine",
    header: "Progress",
    accessorFn: (row) => row.driverId,
  },
];

const transportVoucherLineColumns: ColumnDef<SelectTransportVoucher>[] = [
  {
    header: "Head Count",
    accessorFn: (row) => `${row.language}`,
  },
  {
    accessorKey: "pickupDate",
    header: "Pickup Date",
    accessorFn: (row) => formatDate(row.startDate),
  },
  {
    accessorKey: "pickupTime",
    header: "Pickup Time",
  },
  {
    accessorKey: "pickupLocation",
    header: "Pickup Location",
  },
  {
    accessorKey: "dropoffLocation",
    header: "Dropoff Location",
  },
  {
    header: "Vehicle",
    accessorFn: (row) => `${row.vehicleType} - ${row.endDate} Vehicle(s)`,
  },
];

// Use TasksTab for Transport
const TransportTasksTab = ({ bookingLineId }: { bookingLineId: string }) => (
  <TasksTab
    bookingLineId={bookingLineId}
    columns={transportColumns}
    voucherColumns={transportVoucherLineColumns}
    fetchVouchers={getTransportVouchers}
    formComponent={TransportForm}
  />
);

export default TransportTasksTab;
