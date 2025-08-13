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
  updateRestaurantVoucherStatusWithConfirmationDetails,
} from "~/server/db/queries/booking/restaurantVouchers";
import TasksTab from "~/components/common/tasksTab";
import RestaurantsVoucherForm from "./form";
import RestaurantVouchersTasksTab from "./taskTab";
import { VoucherConfirmationDetails } from "~/lib/types/booking";
import { toast } from "~/hooks/use-toast";
import { useState } from "react";

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



const RestaurantsTasksTab = ({
  bookingLineId,
  vouchers,
  currency
}: {
  bookingLineId: string;
  vouchers: RestaurantVoucherData[];
  currency:string
}) => {
  const [localVouchers, setLocalVouchers] = useState(vouchers);

  const updateVoucherLinesRates = async (
    ratesMap: Map<string,string>,
    voucherId:string,
    confirmationDetails?: {
      availabilityConfirmedBy: string;
      availabilityConfirmedTo: string;
      ratesConfirmedBy: string;
      ratesConfirmedTo: string;
      specialNote:string;
      billingInstructions:string;
    },
  ) => {
    if (!confirmationDetails) {
      throw new Error("Failed");
    }
  
    try {
      await bulkUpdateRestaurantVoucherRates(ratesMap,voucherId, {
        availabilityConfirmedBy: confirmationDetails.availabilityConfirmedBy,
        availabilityConfirmedTo: confirmationDetails.availabilityConfirmedTo,
        ratesConfirmedBy: confirmationDetails.ratesConfirmedBy,
        ratesConfirmedTo: confirmationDetails.ratesConfirmedTo,
        specialNote: confirmationDetails.specialNote,
        billingInstructions: confirmationDetails.billingInstructions
  
      });
      
      // Update local vouchers state with the new data
      setLocalVouchers((prev) =>
        prev.map((v) =>
          v.id === voucherId ? {
            ...v,
            voucherLines: v.voucherLines.map((vl) =>
              ratesMap.has(vl.id) ? { ...vl, rate: ratesMap.get(vl.id) ?? null } : vl
            ),
            availabilityConfirmedBy: confirmationDetails.availabilityConfirmedBy,
            availabilityConfirmedTo: confirmationDetails.availabilityConfirmedTo,
            ratesConfirmedBy: confirmationDetails.ratesConfirmedBy,
            ratesConfirmedTo: confirmationDetails.ratesConfirmedTo,
            specialNote: confirmationDetails.specialNote,
            billingInstructions: confirmationDetails.billingInstructions
          } : v
        )
      );
      
      toast({
        title: "Voucher lines updated",
        description: "Voucher lines rates have been updated successfully",
      })
    } catch (error) {
      console.error("Error updating voucher line:", error);
      toast({
        title: "Error",
        description: "Error while updating the voucher line",
      })
    }
  };
  
  const updateVoucherStatus = async (voucher: SelectRestaurantVoucher, confirmationDetails?:VoucherConfirmationDetails) => {
    try {
      const bulkUpdateResponse = confirmationDetails ? await updateRestaurantVoucherStatusWithConfirmationDetails(voucher, confirmationDetails) :  await updateRestaurantVoucherStatus(voucher);
  
      if (!bulkUpdateResponse) {
        throw new Error("Failed");
      }
      toast({
        title: "Voucher status updated",
        description: "Voucher status has been updated successfully " + voucher.status,
      })

      setLocalVouchers((prev) =>
        prev.map((v) =>
          v.id === voucher.id ? { 
            ...v, 
            status: voucher.status,
            responsiblePerson:voucher.responsiblePerson ?? confirmationDetails?.responsiblePerson ?? "",
            confirmationNumber:voucher.confirmationNumber ?? confirmationDetails?.confirmationNumber ?? "",
            reminderDate:voucher.reminderDate ?? confirmationDetails?.reminderDate ?? "",
          } : v
        )
      );
      return true;
    } catch (error) {
      console.error("Error updating voucher line:", error);
      toast({
        title: "Error",
        description: "Error while updating the voucher status",
      })
      return false;
    }
  };

  // Callback to handle voucher updates from ProceedContent
  const handleVoucherUpdate = (updatedVoucher: RestaurantVoucherData) => {
    console.log("Updating voucher in parent component:", updatedVoucher);
    setLocalVouchers((prev) => {
      const newVouchers = prev.map((v) =>
        v.id === updatedVoucher.id ? updatedVoucher : v
      );
      console.log("Updated vouchers:", newVouchers);
      return newVouchers;
    });
  };

  // Callback to handle voucher deletion
  const handleVoucherDelete = (deletedVoucherId: string) => {
    setLocalVouchers((prev) =>
      prev.filter((v) => v.id !== deletedVoucherId)
    );
  };

  return (
  <RestaurantVouchersTasksTab
    bookingLineId={bookingLineId}
    columns={restaurantColumns}
    voucherColumns={restaurantVoucherLineColumns}
    vouchers={localVouchers}
    // formComponent={RestaurantsVoucherForm}
    updateVoucherLine={updateVoucherLinesRates}
    updateVoucherStatus={updateVoucherStatus}
    currency={currency}
    onVoucherUpdate={handleVoucherUpdate}
    onVoucherDelete={handleVoucherDelete}
  />
)};

export default RestaurantsTasksTab;
