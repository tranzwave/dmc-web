import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "~/lib/utils/index";
import { SelectActivity, SelectActivityVendor, SelectActivityVoucher } from '~/server/db/schemaTypes';
import ActivityVouchersTasksTab from './taskTab';

export type ActivityVoucherData = SelectActivityVoucher & {
  activity: SelectActivity,
  activityVendor: SelectActivityVendor
}

// Define specific columns for activities
const activityColumns: ColumnDef<ActivityVoucherData>[] = [
  {
    header: "Vendor",
    accessorFn: (row) => row.activityVendor.name,
  },
  {
    header: "Activity",
    accessorFn: (row) => row.activityName,
  },
  {
    header: "Contact Number",
    accessorFn: (row) => row.activityVendor.contactNumber,
  },
  // {
  //   header: "Voucher Lines",
  //   accessorFn: (row) => 1,
  // },
  // {
  //   header: "Progress",
  //   accessorFn: (row) => 1,
  // },
];

const activityVoucherLineColumns: ColumnDef<ActivityVoucherData>[] = [
  {
    header: "City",
    accessorFn: row => row.city
  },
  {
    header: "Date",
    accessorFn: (row) => formatDate(row.date),
  },
  {
    header: "Time",
    accessorFn: (row) => row.time,
  },
  {
    header: "Head Count",
    accessorFn: (row) => `${row.participantsCount}`,
  },
  {
    header: "Remarks",
    accessorFn: (row) => `${row.remarks}`,
  },
];

const updateVoucherLine = async(voucher:ActivityVoucherData)=>{
  console.log("Updating")
}

const updateVoucherStatus = async(voucher:ActivityVoucherData)=>{
  console.log("Updating")
  return true
}

// Use TasksTab for Activities
const ActivitiesTasksTab = ({ bookingLineId, vouchers }: { bookingLineId: string ; vouchers:ActivityVoucherData[] }) => (
  <ActivityVouchersTasksTab
    bookingLineId={bookingLineId}
    voucherColumns={activityColumns}
    selectedVoucherColumns={activityVoucherLineColumns}
    vouchers={vouchers}
    updateVoucherLine={updateVoucherLine}
    // updateVoucherStatus={updateVoucherStatus}
  />
);

export default ActivitiesTasksTab;
