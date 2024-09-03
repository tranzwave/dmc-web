import React from 'react';
import { getActivityVouchers } from "~/server/db/queries/booking/activityVouchers";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "~/lib/utils/index";
import TasksTab from "~/components/common/tasksTab";
import ActivityForm from './form';
import { SelectActivityVoucher } from '~/server/db/schemaTypes';

export type ActivityVoucherData = SelectActivityVoucher & {

}



// Define specific columns for activities
const activityColumns: ColumnDef<ActivityVoucherData>[] = [
  {
    accessorKey: "activity.activityName",
    header: "Activity",
  },
  {
    accessorKey: "activity.primaryEmail",
    header: "Email",
    cell: (info) => info.getValue() ?? "N/A",
  },
  {
    accessorKey: "voucherLine",
    header: "Voucher Lines",
    accessorFn: (row) => row.city,
  },
  {
    accessorKey: "voucherLine",
    header: "Progress",
    accessorFn: (row) => row.activityName,
  },
];

const activityVoucherLineColumns: ColumnDef<SelectActivityVoucher>[] = [
  {
    header: "Head Count",
    accessorFn: (row) => `${row.participantsCount}-Adults | ${row.participantsCount}-Kids`,
  },
  {
    accessorKey: "activityDate",
    header: "Activity Date",
    accessorFn: (row) => formatDate(row.date),
  },
  {
    accessorKey: "activityTime",
    header: "Activity Time",
  },
  {
    accessorKey: "basis",
    header: "Basis",
  },
  {
    header: "Details",
    accessorFn: (row) => `${row.remarks}`,
  },
];

// Use TasksTab for Activities
const ActivitiesTasksTab = ({ bookingLineId }: { bookingLineId: string }) => (
  <TasksTab
    bookingLineId={bookingLineId}
    columns={activityColumns}
    voucherColumns={activityVoucherLineColumns}
    fetchVouchers={getActivityVouchers}
    formComponent={ActivityForm}
  />
);

export default ActivitiesTasksTab;
