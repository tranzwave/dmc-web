import React from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "~/lib/utils/index";
import { SelectShopVoucher } from "~/server/db/schemaTypes";
import TasksTab from "~/components/common/tasksTab";
import ShopsForm from './form';
import { getShopsVouchers } from '~/server/db/queries/booking/shopsVouchers';

export type ShopVoucherData = SelectShopVoucher & {

}


// Define specific columns for shops
const shopColumns: ColumnDef<ShopVoucherData>[] = [
  {
    accessorKey: "shop.shopName",
    header: "Shop",
  },
  {
    accessorKey: "shop.primaryEmail",
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
    accessorFn: (row) => row.date,
  },
];

const shopVoucherLineColumns: ColumnDef<SelectShopVoucher>[] = [
  {
    header: "Head Count",
    accessorFn: (row) => `${row.participantsCount}-Adults | ${row.participantsCount}-Kids`,
  },
  {
    accessorKey: "purchaseDate",
    header: "Purchase Date",
    accessorFn: (row) => formatDate(row.date),
  },
  {
    accessorKey: "itemDetails",
    header: "Item Details",
  },
  {
    accessorKey: "basis",
    header: "Basis",
  },
  {
    header: "Amount",
    accessorFn: (row) => `${row.hours}`,
  },
];

// Use TasksTab for Shops
const ShopsTasksTab = ({ bookingLineId }: { bookingLineId: string }) => (
  <TasksTab
    bookingLineId={bookingLineId}
    columns={shopColumns}
    voucherColumns={shopVoucherLineColumns}
    fetchVouchers={getShopsVouchers}
    formComponent={ShopsForm}
  />
);

export default ShopsTasksTab;
