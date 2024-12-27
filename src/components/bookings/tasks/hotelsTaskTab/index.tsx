import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useToast } from "~/hooks/use-toast";
import { formatDate } from "~/lib/utils/index";
import {
  bulkUpdateHotelVoucherRates,
  updateHotelVoucherStatus,
  updateHotelVoucherStatusWithConfirmationDetails,
} from "~/server/db/queries/booking/hotelVouchers";
import {
  SelectHotel,
  SelectHotelVoucher,
  SelectHotelVoucherLine,
} from "~/server/db/schemaTypes";
import HotelVouchersTasksTab from "./taskTab";
import { VoucherConfirmationDetails } from "~/lib/types/booking";

export type HotelVoucherData = SelectHotelVoucher & {
  hotel: SelectHotel;
  voucherLines: SelectHotelVoucherLine[];
};
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
    accessorFn: (row) => row.voucherLines.length,
  },
  {
    accessorKey: "status",
    header: "Status",
    accessorFn: (row) => row.status,
  },
];

 const hotelVoucherLineColumns: ColumnDef<SelectHotelVoucherLine>[] = [
  {
    header: "Adults",
    accessorFn: (row) => row.adultsCount ?? 0,
  },
  {
    header: "Kids",
    accessorFn: (row) => row.kidsCount ?? 0,
  },
  {
    header: "Room Count",
    accessorFn: (row) => row.roomCount ?? 0,
  },
  {
    header: "Check-In Date",
    accessorFn: (row) => formatDate(row.checkInDate ?? ""),
  },
  // {
  //   header: "Check-In Time",
  //   accessorFn: row => row.voucherLines[0]?.checkInTime ?? ""
  // },
  {
    header: "Check-Out Date",
    accessorFn: (row) => formatDate(row.checkOutDate ?? ""),
  },
  // {
  //   header: "Check-Out Time",
  //   accessorFn: row => row.voucherLines[0]?.checkOutTime ?? ""
  // },
  {
    header: "Rooms",
    accessorFn: (row) => `${row.roomType}-${row.roomCategory}-${row.roomCount}`,
  },
  {
    header: "Basis",
    accessorFn: (row) => row.basis,
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
  const { toast } = useToast();
  const updateVoucherLinesRates = async (
    ratesMap: Map<string,string>,
    voucherId:string,
    confirmationDetails?: {
      availabilityConfirmedBy: string;
      availabilityConfirmedTo: string;
      ratesConfirmedBy: string;
      ratesConfirmedTo: string;
      specialNote:string;
      billingInstructions:string
    },
  ) => {
    if (!confirmationDetails) {
      throw new Error("Failed");
    }
    alert("Updating voucher line:");
    try {
      const bulkUpdateResponse = bulkUpdateHotelVoucherRates(ratesMap,voucherId, {
        availabilityConfirmedBy: confirmationDetails.availabilityConfirmedBy,
        availabilityConfirmedTo: confirmationDetails.availabilityConfirmedTo,
        ratesConfirmedBy: confirmationDetails.ratesConfirmedBy,
        ratesConfirmedTo: confirmationDetails.ratesConfirmedTo,
        specialNote:confirmationDetails.specialNote,
        billingInstructions:confirmationDetails.billingInstructions
      });

      if (!bulkUpdateResponse) {
        throw new Error("Failed");
      }
      window.location.reload();
    } catch (error) {
      console.error("Error updating voucher line:", error);
      alert("Failed to update voucher line. Please try again.");
    }
  };
  const updateVoucherStatus = async (voucher: SelectHotelVoucher, confirmationDetails?:VoucherConfirmationDetails) => {
    alert("Updating voucher status:");
    try {
      const voucherUpdateResponse = confirmationDetails ? await updateHotelVoucherStatusWithConfirmationDetails(voucher, confirmationDetails) :  await updateHotelVoucherStatus(voucher);

      if (!voucherUpdateResponse) {
        throw new Error("Failed");
      }
      return true;
    } catch (error) {
      console.error("Error updating voucher line:", error);
      toast({
        title: "Error",
        description: "Error while updating the voucher status",
      });
      return false;
    }
  };

  const [selectedHotel, setSelectedHotel] = useState<SelectHotel>()


  return (
    <HotelVouchersTasksTab
      bookingLineId={bookingLineId}
      columns={hotelColumns}
      voucherColumns={hotelVoucherLineColumns}
      vouchers={vouchers}
      updateVoucherLine={updateVoucherLinesRates}
      updateVoucherStatus={updateVoucherStatus}
      contactDetails={
        {
          phone:selectedHotel?.primaryContactNumber ?? "",
          email:selectedHotel?.primaryEmail ?? ""}
      }
      setSelectedVendor={setSelectedHotel}
      selectedVendor={selectedHotel}
    />
  );
};

export default HotelsTasksTab;
