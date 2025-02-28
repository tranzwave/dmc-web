import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "~/lib/utils/index";
import { SelectShop, SelectShopVoucher } from "~/server/db/schemaTypes";
import ShopVouchersTasksTab from "./taskTab";



export type ShopVoucherData = SelectShopVoucher & {
  shop: SelectShop;

};

// Define specific columns for shops
const shopColumns: ColumnDef<ShopVoucherData>[] = [
  {
    accessorKey: "shop.name",
    header: "Shop",
  },
  {
    header: "Shop Type",
    accessorFn: (row) => row.shopType,
  },
  {
    header: "City",
    accessorFn: (row) => row.city,
  },
  {
    accessorKey: "shop.contactNumber",
    header: "Contact Number",
    cell: (info) => info.getValue() ?? "N/A",
  },
  {
    header: "Date",
    accessorFn: (row) => formatDate(row.date),
  },
  {
    header: "Adults Count",
    accessorFn: (row) => `${row.adultsCount}`,
  },
  {
    header: "Kids Count",
    accessorFn: (row) => `${row.kidsCount}`,
  },
  {
    header: "Status",
    accessorFn: (row) => row.status,
  },

];

const shopVoucherLineColumns: ColumnDef<ShopVoucherData>[] = [
  {
    header: "Shop Type",
    accessorFn: (row) => row.shopType,
  },
  {
    header: "Adults Count",
    accessorFn: (row) => `${row.adultsCount}`,
  },
  {
    header: "Kids Count",
    accessorFn: (row) => `${row.kidsCount}`,
  },
  {
    header: "Date",
    accessorFn: (row) => formatDate(row.date),
  },
  // {
  //   header: "Time",
  //   accessorFn: (row) => row.time,
  // },
  {
    header: "Remarks",
    accessorFn: (row) => `${row.remarks}`,
  },
];

const updateVoucherLine = async (voucher: ShopVoucherData) => {
  console.log("Updating");
};

const updateVoucherStatus = async (voucher: ShopVoucherData) => {
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
  />
);

export default ShopsTasksTab;
