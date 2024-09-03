import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "~/lib/utils/index";
import { SelectBookingLine, SelectRestaurant, SelectRestaurantVoucher, SelectRestaurantVoucherLine } from "~/server/db/schemaTypes"; // Adjust this import based on your schema
// import { RestaurantVoucherData } from "../restaurants"; // Adjust this import based on your data type
import { getRestaurantVouchers } from "~/server/db/queries/booking/restaurantVouchers";
import TasksTab from "~/components/common/tasksTab";
import RestaurantsForm from "./form"; // Adjust path if needed

export type RestaurantVoucherData = SelectRestaurantVoucher & {
    bookingLine: SelectBookingLine;
    restaurant: SelectRestaurant;
    voucherLine?: SelectRestaurantVoucherLine[];
  };
// Define specific columns for restaurant vouchers
const restaurantColumns: ColumnDef<RestaurantVoucherData>[] = [
  {
    accessorKey: "restaurant.restaurantName",
    header: "Restaurant",
  },
  {
    accessorKey: "restaurant.primaryEmail",
    header: "Email",
    cell: (info) => info.getValue() ?? "N/A",
  },
  {
    accessorKey: "voucherLine",
    header: "Progress",
    accessorFn: (row) => row.voucherLine?.length || 1,
  },
];

const restaurantVoucherLineColumns: ColumnDef<SelectRestaurantVoucherLine>[] = [
  {
    header: "Head Count",
    accessorFn: (row) => `${row.adultsCount}-Adults | ${row.kidsCount}-Kids`,
  },
  {
    accessorKey: "checkInDate",
    header: "Check In",
    accessorFn: (row) => formatDate(row.date),
  },
  {
    accessorKey: "checkOutDate",
    header: "Check Out",
    accessorFn: (row) => formatDate(row.date),
  },
  {
    accessorKey: "basis",
    header: "Occupancy",
  },
];


const RestaurantsTasksTab = ({ bookingLineId }: { bookingLineId: string }) => (
    <TasksTab
      bookingLineId={bookingLineId}
      columns={restaurantColumns}
      voucherColumns={restaurantVoucherLineColumns}
      fetchVouchers={getRestaurantVouchers}
      formComponent={RestaurantsForm}
    />
  );
  
  export default RestaurantsTasksTab;


