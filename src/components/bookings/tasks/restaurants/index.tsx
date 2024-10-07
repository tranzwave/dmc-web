import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "~/lib/utils/index";
import {
  SelectBookingLine,
  SelectRestaurant,
  SelectRestaurantVoucher,
  SelectRestaurantVoucherLine,
} from "~/server/db/schemaTypes"; // Adjust this import based on your schema
// import { RestaurantVoucherData } from "../restaurants"; // Adjust this import based on your data type
import {
  bulkUpdateRestaurantVoucherRates,
  getRestaurantVouchers,
  updateRestaurantVoucherStatus,
} from "~/server/db/queries/booking/restaurantVouchers";
import TasksTab from "~/components/common/tasksTab";
import RestaurantsVoucherForm from "./form";
import RestaurantVouchersTasksTab from "./taskTab";

export type RestaurantVoucherData = SelectRestaurantVoucher & {
  restaurant: SelectRestaurant;
  voucherLines: SelectRestaurantVoucherLine[];
};
// Define specific columns for restaurant vouchers
const restaurantColumns: ColumnDef<RestaurantVoucherData>[] = [
  {
    accessorKey: "restaurant.name",
    header: "Restaurant",
  },
  {
    accessorKey: "restaurant.contactNumber",
    header: "Contact",
    cell: (info) => info.getValue() ?? "N/A",
  },
  {
    accessorKey: "voucherLine",
    header: "Voucher Lines",
    accessorFn: (row) => row.voucherLines?.length ?? "Not found",
  },
  {
    accessorKey: "status",
    header: "Status",
    accessorFn: (row) => row.status ?? "Not found",
  },
];

const restaurantVoucherLineColumns: ColumnDef<SelectRestaurantVoucherLine>[] = [
  {
    header: "Adults",
    accessorFn: (row) => `${row.adultsCount}`,
  },
  {
    header: "Kids",
    accessorFn: (row) => `${row.kidsCount}`,
  },
  {
    header: "Pax",
    accessorFn: (row) => `${row.adultsCount + row.kidsCount}`,
  },
  {
    header: "Date",
    accessorFn: (row) => formatDate(row.date),
  },
  {
    header: "Meal Type",
    accessorFn: (row) => row.mealType,
  },
];

const updateVoucherLine = async (voucherLines: any[]) => {
  alert("Updating voucher line:");
  try {
    const bulkUpdateResponse = bulkUpdateRestaurantVoucherRates(voucherLines);

    if (!bulkUpdateResponse) {
      throw new Error("Failed");
    }
  } catch (error) {
    console.error("Error updating voucher line:", error);
    alert("Failed to update voucher line. Please try again.");
  }
};

const updateVoucherStatus = async (voucher: SelectRestaurantVoucher) => {
  alert("Updating voucher status:");
  try {
    const bulkUpdateResponse = updateRestaurantVoucherStatus(voucher);

    if (!bulkUpdateResponse) {
      throw new Error("Failed");
    }
    return true;
  } catch (error) {
    console.error("Error updating voucher line:", error);
    alert("Failed to update voucher line. Please try again.");
    return false;
  }
};

const RestaurantsTasksTab = ({
  bookingLineId,
  vouchers,
}: {
  bookingLineId: string;
  vouchers: RestaurantVoucherData[];
}) => (
  <RestaurantVouchersTasksTab
    bookingLineId={bookingLineId}
    columns={restaurantColumns}
    voucherColumns={restaurantVoucherLineColumns}
    vouchers={vouchers}
    // formComponent={RestaurantsVoucherForm}
    updateVoucherLine={updateVoucherLine}
    updateVoucherStatus={updateVoucherStatus}
  />
);

export default RestaurantsTasksTab;
