import React from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "~/lib/utils/index";
import { SelectShop, SelectShopVoucher } from "~/server/db/schemaTypes";
import TasksTab from "~/components/common/tasksTab";
import ShopsForm from './form';

export type ShopVoucherData = SelectShopVoucher & {
  shop:SelectShop
}


// Define specific columns for shops
const shopColumns: ColumnDef<ShopVoucherData>[] = [
  {
    accessorKey: "shop.name",
    header: "Shop",
  },
  {
    accessorKey: "shop.contactNumber",
    header: "Contact Number",
    cell: (info) => info.getValue() ?? "N/A",
  },
  {
    accessorKey: "voucherLine",
    header: "Voucher Lines",
    accessorFn: (row) => 1,
  },
  {
    accessorKey: "voucherLine",
    header: "Progress",
    accessorFn: (row) => 1,
  },
];

const shopVoucherLineColumns: ColumnDef<SelectShopVoucher>[] = [
  {
    header: "Shop Type",
    accessorFn: row => row.shopType
  },
  {
    header: "Head Count",
    accessorFn: (row) => `${row.participantsCount}`,
  },
  {
    header: "Date",
    accessorFn: (row) => formatDate(row.date),
  },

  {
    header: "Time",
    accessorFn: row => row.time
  },
  {
    header: "Remarks",
    accessorFn: (row) => `${row.remarks}`,
  },
];

// Use TasksTab for Shops
const ShopsTasksTab = ({ bookingLineId, vouchers }: { bookingLineId: string ; vouchers: ShopVoucherData[] }) => (
  <TasksTab
    bookingLineId={bookingLineId}
    columns={shopColumns}
    voucherColumns={shopVoucherLineColumns}
    vouchers={vouchers}
    formComponent={ShopsForm}
  />
);

export default ShopsTasksTab;
