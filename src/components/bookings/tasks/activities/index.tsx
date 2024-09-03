import React from 'react';
import { getActivityVouchers } from "~/server/db/queries/booking/activityVouchers";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "~/lib/utils/index";
import TasksTab from "~/components/common/tasksTab";
import ActivityForm from './form';
import { SelectActivity, SelectActivityVendor, SelectActivityVoucher } from '~/server/db/schemaTypes';

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
  {
    header: "Voucher Lines",
    accessorFn: (row) => 1,
  },
  {
    header: "Progress",
    accessorFn: (row) => 1,
  },
];

const activityVoucherLineColumns: ColumnDef<SelectActivityVoucher>[] = [
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

// Use TasksTab for Activities
const ActivitiesTasksTab = ({ bookingLineId, vouchers }: { bookingLineId: string ; vouchers:ActivityVoucherData[] }) => (
  <TasksTab
    bookingLineId={bookingLineId}
    columns={activityColumns}
    voucherColumns={activityVoucherLineColumns}
    vouchers={vouchers}
    formComponent={ActivityForm}
  />
);

export default ActivitiesTasksTab;
