import { ColumnDef } from "@tanstack/react-table";
import HotelsForm from "./voucherForm/index";
import { formatDate } from "~/lib/utils/index";
import { SelectHotelVoucher, SelectHotelVoucherLine } from "~/server/db/schemaTypes";
import TasksTab from "~/components/common/tasksTab";
import { HotelVoucherData } from "../hotels";
import { bulkUpdateHotelVoucherRates, updateHotelVoucherStatus } from "~/server/db/queries/booking/hotelVouchers";
import { useToast } from "~/hooks/use-toast";

// Define specific columns for hotels
const hotelColumns: ColumnDef<HotelVoucherData>[] = [
  {
    accessorKey: "hotel.name",
    header: "Hotel",
  },
  {
    accessorKey: "hotel.primaryEmail",
    header: "Email",
    cell: (info) => info.getValue() ?? "N/A",
  },
  {
    accessorKey: "voucherLine",
    header: "Voucher Lines",
    accessorFn: (row) => row.voucherLine.length,
  },
  {
    accessorKey: "voucherLine",
    header: "Progress",
    accessorFn: (row) => row.voucherLine.length,
  },
];

const hotelVoucherLineColumns: ColumnDef<SelectHotelVoucherLine>[] = [
  {
    header: "Head Count",
    accessorFn: (row) => `${row.adultsCount}-Adults | ${row.kidsCount}-Kids`,
  },
  {
    accessorKey: "checkInDate",
    header: "Check In",
    accessorFn: (row) => formatDate(row.checkInDate),
  },
  {
    accessorKey: "checkOutDate",
    header: "Check Out",
    accessorFn: (row) => formatDate(row.checkOutDate),
  },
  {
    accessorKey: "basis",
    header: "Occupancy",
  },
  {
    header: "Room",
    accessorFn: (row) => `${row.roomType} - ${row.roomCount} Room`,
  },
];






// Update the HotelsTasksTab component to receive vouchers as a prop
const HotelsTasksTab = ({
  bookingLineId,
  vouchers,
}: {
  bookingLineId: string;
  vouchers: HotelVoucherData[]; // Accept vouchers as a prop
}) => {
  const {toast} = useToast()
  const updateVoucherLine = async (voucherLine: any[]) => {
    alert("Updating voucher line:");
    try{
      const bulkUpdateResponse = bulkUpdateHotelVoucherRates(voucherLine)
  
      if(!bulkUpdateResponse){
        throw new Error("Failed")
      }
    } catch(error){
      console.error("Error updating voucher line:", error);
      alert("Failed to update voucher line. Please try again.");
    }
  };
  const updateVoucherStatus = async (voucher: SelectHotelVoucher)=>{
    alert("Updating voucher status:");
    try{
      const voucherUpdateResponse = updateHotelVoucherStatus(voucher)
  
      if(!voucherUpdateResponse){
        throw new Error("Failed")
      }
      return true
    } catch(error){
      console.error("Error updating voucher line:", error);
      toast({
        title: "Error",
        description: "Error while updating the voucher status",
      })
      return false
    }
  }
  return (
  <TasksTab
    bookingLineId={bookingLineId}
    columns={hotelColumns}
    voucherColumns={hotelVoucherLineColumns}
    vouchers={vouchers} // Pass vouchers directly to TasksTab
    formComponent={HotelsForm}
    updateVoucherLine={updateVoucherLine}
    updateVoucherStatus={updateVoucherStatus}
  />
)};

export default HotelsTasksTab;
