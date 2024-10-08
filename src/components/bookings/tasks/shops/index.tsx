import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "~/lib/utils/index";
import { SelectClient, SelectShop, SelectShopVoucher } from "~/server/db/schemaTypes";
import ShopVouchersTasksTab from "./taskTab";



export type ShopVoucherData = SelectShopVoucher & {
  shop: SelectShop;
  client: SelectClient; // Add client data here

};

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
    accessorKey: "client.name",
    header: "Client Name",
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

const shopVoucherLineColumns: ColumnDef<ShopVoucherData>[] = [
  {
    header: "Shop Type",
    accessorFn: (row) => row.shopType,
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
    accessorFn: (row) => row.time,
  },
  {
    header: "Remarks",
    accessorFn: (row) => `${row.remarks}`,
  },
];

const updateVoucherLine = async (voucher: any) => {
  console.log("Updating");
};

const updateVoucherStatus = async (voucher: any) => {
  console.log("Updating");
  return true;
};

// Use TasksTab for Shops
const ShopsTasksTab = ({
  bookingLineId,
  vouchers,
}: {
  bookingLineId: string;
  vouchers: ShopVoucherData[];
}) => (
  <ShopVouchersTasksTab
    bookingLineId={bookingLineId}
    voucherColumns={shopColumns}
    selectedVoucherColumns={shopVoucherLineColumns}
    vouchers={vouchers}
    updateVoucherLine={updateVoucherLine}
    updateVoucherStatus={updateVoucherStatus}
  />
);

export default ShopsTasksTab;
