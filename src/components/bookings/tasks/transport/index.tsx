import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { SelectDriver, SelectDriverVoucherLine, SelectGuide, SelectTransportVoucher } from "~/server/db/schemaTypes";
import TransportVouchersTasksTab from './taskTab';
import { TransportVoucher } from "~/app/dashboard/bookings/[id]/edit/context";
import { BookingLineWithAllData } from "~/lib/types/booking";

export type TransportVoucherData = SelectTransportVoucher & {
  driver: SelectDriver | null
  guide: SelectGuide | null
  driverVoucherLines: SelectDriverVoucherLine[]
  // guideVoucherLines: SelectGuideVoucherLine[]
}

// Define specific columns for transport
const voucherColumns: ColumnDef<TransportVoucher>[] = [
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
    accessorFn: (row) => {
      let vehicle = "N/A";
      if(row.driver) {
        vehicle = row.driverVoucherLine?.vehicleType ?? "Not Assigned"
      }
      return vehicle;
    },
  },
  {
    header: "Language",
    accessorFn: (row) => row.voucher.language,
  },
  {
    header: "Pickup Date",
    accessorFn: (row) => row.voucher.startDate,
  },
  {
    header: "Drop Off Date",
    accessorFn: (row) => row.voucher.endDate,
  },

  {
    accessorFn: (row) => row.driver?.contactNumber ?? row.guide?.primaryContactNumber,
    header: "Contact Number",
    cell: (info) => info.getValue() ?? "N/A",
  },
  {
    accessorKey: "status",
    header: "Status",
    accessorFn: (row) => row.voucher.status,
  },
  // {
  //   header: "Progress",
  //   accessorFn: (row) => row.status,
  // },
];

const selectedVoucherColumns: ColumnDef<TransportVoucher>[] = [
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
    accessorFn: (row) => row.driverVoucherLine?.vehicleType,
  },
  {
    header: "Language",
    accessorFn: (row) => row.voucher.language,
  },
  {
    header: "Pickup Date",
    accessorFn: (row) => row.voucher.startDate
  },
  {
    header: "Drop Off Date",
    accessorFn: row => row.voucher.endDate
  },
  {
    header: "Remarks",
    accessorFn: row => row.voucher.remarks
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
const TransportTasksTab = ({ bookingLineId, vouchers, bookingData }: { bookingLineId: string, vouchers: TransportVoucher[], bookingData: BookingLineWithAllData }) => {
  const [statusChanged, setStatusChanged] = useState<boolean>(false);

  useEffect(()=>{
    console.log("Status changed")
  },[statusChanged])


  return(
  <TransportVouchersTasksTab
    bookingLineId={bookingLineId}
    bookingData={bookingData}
    voucherColumns={voucherColumns}
    selectedVoucherColumns={selectedVoucherColumns}
    vouchers={vouchers}
    updateVoucherLine={updateVoucherLine}
    statusChanged={statusChanged}
    setStatusChanged={setStatusChanged}

  />
)};

export default TransportTasksTab;
