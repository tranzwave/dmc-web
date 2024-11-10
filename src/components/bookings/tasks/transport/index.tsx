import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { SelectDriver, SelectDriverVoucherLine, SelectGuide, SelectGuideVoucherLine, SelectTransportVoucher } from "~/server/db/schemaTypes";
import TransportVouchersTasksTab from './taskTab';

export type TransportVoucherData = SelectTransportVoucher & {
  driver: SelectDriver | null
  guide: SelectGuide | null
  driverVoucherLines: SelectDriverVoucherLine[]
  guideVoucherLines: SelectGuideVoucherLine[]
}

// Define specific columns for transport
const voucherColumns: ColumnDef<TransportVoucherData>[] = [
  {
    accessorFn: (row) => row.driver?.name ?? row.guide?.name,
    header: "Name",
  },
  {
    header: "Type",
    accessorFn: (row) => row.driver?.type ?? row.guide?.type,
  },
  {
    header: "Vehicle",
    accessorFn: (row) => row.driverVoucherLines.map((t)=>t.vehicleType) ?? '-',
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
    accessorFn: (row) => row.driver?.contactNumber ?? row.guide?.primaryContactNumber,
    header: "Contact Number",
    cell: (info) => info.getValue() ?? "N/A",
  },
  {
    accessorKey: "status",
    header: "Status",
    accessorFn: (row) => row.status,
  },
  // {
  //   header: "Progress",
  //   accessorFn: (row) => row.status,
  // },
];

const selectedVoucherColumns: ColumnDef<TransportVoucherData>[] = [
  {
    accessorKey: "driver.name",
    header: "Driver",
    accessorFn: (row) => `${row.driver?.name}`,
  },
  {
    accessorKey: "driver.contactNumber",
    header: "Contact Number",
    accessorFn: (row) => `${row.driver?.primaryContactNumber}`,
  },
  {
    header: "Vehicle",
    accessorFn: (row) => row.driverVoucherLines.map((t)=>t.vehicleType),
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
