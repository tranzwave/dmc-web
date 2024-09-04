import React from 'react';
import { getTransportVouchers } from "~/server/db/queries/booking/transportVouchers";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "~/lib/utils/index";
import { SelectDriver, SelectTransportVoucher } from "~/server/db/schemaTypes";
import TasksTab from "~/components/common/tasksTab";
import TransportForm from './form';

export type TransportVoucherData = SelectTransportVoucher & {
  driver: SelectDriver
}

// Define specific columns for transport
const transportColumns: ColumnDef<TransportVoucherData>[] = [
  {
    accessorKey: "driver.name",
    header: "Driver",
  },
  {
    accessorKey: "driver.contactNumber",
    header: "Contact Number",
    cell: (info) => info.getValue() ?? "N/A",
  },
  {
    header: "Voucher Lines",
    accessorFn: (row) => 1,
  },
  {
    accessorKey: "voucherLine",
    header: "Progress",
    accessorFn: (row) => 1,
  },
];

const transportVoucherLineColumns: ColumnDef<SelectTransportVoucher>[] = [
  {
    header: "Vehicle",
    accessorFn: (row) => `${row.vehicleType}`,
  },
  {
    header: "Language",
    accessorFn: (row) => row.language,
  },
  {
    header: "Pickup Date",
    accessorFn: (row) => row.startDate
  },
  {
    header: "Drop Off Date",
    accessorFn: row => row.endDate
  },
  {
    header: "Remarks",
    accessorFn: row => row.remarks
  },
];

// Use TasksTab for Transport
const TransportTasksTab = ({ bookingLineId, vouchers }: { bookingLineId: string, vouchers: TransportVoucherData[] }) => (
  <TasksTab
    bookingLineId={bookingLineId}
    columns={transportColumns}
    voucherColumns={transportVoucherLineColumns}
    vouchers={vouchers}
    formComponent={TransportForm}
  />
);

export default TransportTasksTab;
