import { ColumnDef } from "@tanstack/react-table";
import { SelectClient, SelectDriver, SelectTransportVoucher } from "~/server/db/schemaTypes";
import TransportVouchersTasksTab from './taskTab';
import { useEffect, useState } from "react";

export type TransportVoucherData = SelectTransportVoucher & {
  driver: SelectDriver
}

// Define specific columns for transport
const voucherColumns: ColumnDef<TransportVoucherData>[] = [
  {
    accessorKey: "driver.name",
    header: "Name",
  },
  {
    header: "Type",
    accessorFn: (row) => row.driver.type,
  },
  {
    header: "Vehicle",
    accessorFn: (row) => row.vehicleType,
  },
  {
    header: "Language",
    accessorFn: (row) => row.language,
  },
  {
    header: "Pickup Date",
    accessorFn: (row) => row.startDate,
  },
  {
    header: "Drop Off Date",
    accessorFn: (row) => row.endDate,
  },

  {
    accessorKey: "driver.contactNumber",
    header: "Contact Number",
    cell: (info) => info.getValue() ?? "N/A",
  },
  {
    header: "Progress",
    accessorFn: (row) => row.status,
  },
];

const selectedVoucherColumns: ColumnDef<TransportVoucherData>[] = [
  {
    accessorKey: "driver.name",
    header: "Driver",
    accessorFn: (row) => `${row.driver.name}`,
  },
  {
    accessorKey: "driver.contactNumber",
    header: "Contact Number",
    accessorFn: (row) => `${row.driver.primaryContactNumber}`,
  },
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
const updateVoucherLine = async(voucher:any)=>{
  console.log("Updating")
}

const updateVoucherStatus = async(voucher:any)=>{
  console.log("Updating")
  return true
}
// Use TasksTab for Transport
const TransportTasksTab = ({ bookingLineId, vouchers }: { bookingLineId: string, vouchers: TransportVoucherData[] }) => {
  const [statusChanged, setStatusChanged] = useState<boolean>(false);

  useEffect(()=>{
    console.log("Status changed")
  },[statusChanged])


  return(
  <TransportVouchersTasksTab
    bookingLineId={bookingLineId}
    voucherColumns={voucherColumns}
    selectedVoucherColumns={selectedVoucherColumns}
    vouchers={vouchers}
    updateVoucherLine={updateVoucherLine}
    statusChanged={statusChanged}
    setStatusChanged={setStatusChanged}

  />
)};

export default TransportTasksTab;
