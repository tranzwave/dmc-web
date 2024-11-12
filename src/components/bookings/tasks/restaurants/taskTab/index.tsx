"use client";
import { ColumnDef } from "@tanstack/react-table";
import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Input } from "~/components/ui/input";
import { useToast } from "~/hooks/use-toast";
// import Voucher from "./voucherComponent";
import html2pdf from "html2pdf.js";
import { DataTable } from "~/components/bookings/home/dataTable";
import DeletePopup from "~/components/common/deletePopup";
import Popup from "~/components/common/popup";
import { ConfirmationForm } from "~/components/common/tasksTab/confirmationForm";
import {
  SelectRestaurant,
  SelectRestaurantVoucherLine,
} from "~/server/db/schemaTypes";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LoadingLayout from "~/components/common/dashboardLoading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { deleteRestaurantVoucherLine } from "~/server/db/queries/booking";
import { getAllRestaurants } from "~/server/db/queries/booking/restaurantVouchers";
import { RestaurantVoucherData } from "..";
import RestaurantsVoucherForm from "../form";
import RestaurantVoucherPDF from "../voucherTemplate";
import ConfirmationContent from "./confirmationPopup";
import ContactContent from "../../hotelsTaskTab/taskTab/ContactPopup";
import ProceedContent from "../../hotelsTaskTab/taskTab/proceedPopup";

interface TasksTabProps<T, L> {
  bookingLineId: string;
  columns: ColumnDef<RestaurantVoucherData>[];
  voucherColumns: ColumnDef<SelectRestaurantVoucherLine>[];
  vouchers: RestaurantVoucherData[];
  updateVoucherLine: (
    data: any,
    confirmationDetails?: {
      availabilityConfirmedBy: string;
      availabilityConfirmedTo: string;
      ratesConfirmedBy: string;
      ratesConfirmedTo: string;
    },
  ) => Promise<void>;
  updateVoucherStatus: (data: any) => Promise<boolean>;
  contactDetails?: { phone: string; email: string };
  selectedVendor?: any;
  setSelectedVendor?: React.Dispatch<React.SetStateAction<any>>;
}

interface WithOptionalVoucherLine<L, T> {
  voucherLines?: L[] | T[];
}

const RestaurantVouchersTasksTab = <
  T extends object & WithOptionalVoucherLine<L, T>,
  L extends object,
>({
  bookingLineId,
  columns,
  voucherColumns,
  vouchers,
  updateVoucherLine,
  updateVoucherStatus,
  contactDetails,
  selectedVendor,
  setSelectedVendor,
}: TasksTabProps<T, L>) => {
  const [selectedVoucher, setSelectedVoucher] =
    useState<RestaurantVoucherData>();
  const [selectedVoucherLine, setSelectedVoucherLine] =
    useState<SelectRestaurantVoucherLine>();
  const [rate, setRate] = useState<string>('0');
  const [statusChanged, setStatusChanged] = useState<boolean>(false);
  const [isInprogressVoucherDelete, setIsInProgressVoucherDelete] =
    useState(false);
  const [isProceededVoucherDelete, setIsProceededVoucherDelete] =
    useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState<SelectRestaurant[]>([]);
  const [error, setError] = useState<string | null>();
  const deleteVoucherRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const { toast } = useToast();

  const getHotels = async () => {
    setLoading(true);

    try {
      const newResponse = await getAllRestaurants();

      if (!newResponse) {
        throw new Error(`Error: Couldn't get restaurants`);
      }
      console.log("Fetched Restaurants:", newResponse);

      setRestaurants(newResponse);
      setLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const onVoucherRowClick = (row: RestaurantVoucherData) => {
    setSelectedVoucher(row);
    setRate(row.voucherLines[0]?.rate ?? '0');
    if (setSelectedVendor) {
      setSelectedVendor(row);
    }
  };

  const onVoucherLineRowClick = (row: SelectRestaurantVoucherLine) => {
    console.log(row);
    setSelectedVoucherLine(row);
    console.log("Updating");
    console.log(selectedVoucherLine);
  };

  const getFirstObjectName = (obj: any): string => {
    if (typeof obj !== "object" || obj === null) {
      return "";
    }

    if ("name" in obj) {
      return obj.name;
    }

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const result = getFirstObjectName(obj[key]);
        if (result) {
          return result;
        }
      }
    }
    return "";
  };

  const handleConfirm = () => {
    console.log("Confirmed");
    // Add confirmation logic here
  };

  const handleCancel = () => {
    console.log("Cancelled");
    // Add cancellation logic here
  };

  const renderCancelContent = () => {
    if (selectedVoucher) {
      if (selectedVoucher.status) {
        if (selectedVoucher.status == "inprogress") {
          setIsInProgressVoucherDelete(true);
        } else {
          setIsProceededVoucherDelete(true);
        }
      }
    }
  };

  const cancelButton = (
    <Button variant={"outline"} className="border-red-600">
      Cancel
    </Button>
  );

  const addConfirmationButton = (
    <Button variant={"primaryGreen"}>Add Confirmation</Button>
  );

  const contactButton = (
    <Button variant={"outline"} className="border-primary-green">
      Contact
    </Button>
  );

  const proceedButton = <Button variant={"primaryGreen"}>Proceed</Button>;

  const amendButton = (
    <Button variant={"outline"} className="border border-primary-green">
      Amend
    </Button>
  );

  useEffect(() => {
    console.log("Status changed");
    getHotels();
    setSelectedVoucher(vouchers ? vouchers[0] : undefined)
    return () => {
      console.log("Return");
    };
  }, [statusChanged, vouchers]);

  if (loading) {
    return <LoadingLayout />;
  }

  const downloadPDF = () => {
    const tempContainer = deleteVoucherRef.current;

    if (tempContainer && selectedVoucher) {
      // Make the container visible
      tempContainer.style.display = "block";

      const options = {
        filename: `cancellation_voucher_${selectedVoucher.restaurant.name}.pdf`,
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
      };

      html2pdf()
        .set(options)
        .from(tempContainer)
        .save()
        .then(() => {
          // Hide the container after PDF is generated
          tempContainer.style.display = "none"; // Set back to hidden
        });
    }
  };

  const handleInProgressVoucherDelete = async () => {
    if (selectedVoucher && selectedVoucher.status) {
      try {
        setIsDeleting(true);
        const deletedData = await deleteRestaurantVoucherLine(
          selectedVoucher.voucherLines[0]?.id ?? "",
        );
        if (!deletedData) {
          throw new Error("Couldn't delete voucher");
        }
        toast({
          title: "Success",
          description: `Successfully cancelled the voucher! Pleas refresh!`,
        });

        // deleteVoucherLineFromLocalContext();
        setIsDeleting(false);
      } catch (error) {
        toast({
          title: "Uh Oh",
          description: `Couldn't delete this voucher`,
        });
        setIsDeleting(false);
      }
      return;
    }
  };

  const handleProceededVoucherDelete = async () => {
    if (selectedVoucher && selectedVoucher.status) {
      try {
        downloadPDF();

        setIsDeleting(true);
        const deletedData = await deleteRestaurantVoucherLine(
          selectedVoucher.voucherLines[0]?.id ?? "",
        );
        if (!deletedData) {
          throw new Error("Couldn't delete voucher");
        }

        toast({
          title: "Success",
          description: `Successfully cancelled the voucher! Pleas refresh!`,
        });
        // deleteVoucherLineFromLocalContext();
        setIsDeleting(false);
      } catch (error) {
        toast({
          title: "Uh Oh",
          description: `Couldn't delete this voucher`,
        });
        setIsDeleting(false);
      }
      return;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="flex w-full flex-row justify-center gap-3">
        <div>
          <Calendar />
        </div>
        <div className="card w-full space-y-6">
          <div className="flex justify-between">
            <div className="card-title">Voucher Information</div>
            <Link
              href={`${pathname.replace("/tasks", "")}/edit?tab=restaurants`}
            >
              <Button variant={"outline"}>Add Vouchers</Button>
            </Link>
          </div>
          <div className="text-sm font-normal">
            Click the line to send the voucher
          </div>
          {/* <DataTableWithActions
            data={vouchers}
            columns={columns}
            onRowClick={onVoucherRowClick}
            onView={() => alert("View action triggered")}
            onEdit={() => alert("Edit action triggered")}
            onDelete={() => alert("Delete action triggered")}
          /> */}
          <DataTable
            data={vouchers}
            columns={columns}
            onRowClick={onVoucherRowClick}
          />
          <div className="flex flex-row items-center justify-between">
            <div className="text-sm font-normal">
              {selectedVoucher && getFirstObjectName(selectedVoucher)
                ? `${getFirstObjectName(selectedVoucher)} - Voucher Lines`
                : "Voucher Lines"}
            </div>
          </div>

          {/* <DataTableWithActions
            columns={voucherColumns}
            data={selectedVoucher?.voucherLines ?? []}
            onRowClick={onVoucherLineRowClick}
            onView={() => alert("View action triggered")}
            onEdit={() => alert("Edit action triggered")}
            onDelete={() => alert("Delete action triggered")}
          /> */}
          <DataTable
            columns={voucherColumns}
            data={selectedVoucher?.voucherLines ?? []}
            onRowClick={onVoucherLineRowClick}
          />
          <div
            className={`flex flex-row items-end justify-end ${!selectedVoucher ? "hidden" : ""}`}
          >
            <div className="flex flex-row gap-2">

            {selectedVoucher && selectedVoucher.voucherLines[0] && (
                <div className="flex flex-row gap-2">
                  <Button
                    variant={"outline"}
                    className="border-red-600"
                    onClick={renderCancelContent}
                  >
                    Cancel
                  </Button>

                  <Popup
                    title="Contact"
                    description="Loading Contact Details"
                    trigger={contactButton}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                    dialogContent={ContactContent(
                      selectedVoucher.restaurant.contactNumber,
                      selectedVoucher.restaurant.primaryEmail,
                    )}
                    size="small"
                  />
                  <DeletePopup
                    itemName={`Voucher for ${selectedVoucher?.restaurant.name}`}
                    onDelete={handleInProgressVoucherDelete}
                    isOpen={isInprogressVoucherDelete}
                    setIsOpen={setIsInProgressVoucherDelete}
                    isDeleting={isDeleting}
                    description="You haven't sent this to the vendor yet. You can delete the
                  voucher without sending a cancellation voucher"
                  />

                  <Popup
                    title={
                      selectedVoucher && getFirstObjectName(selectedVoucher)
                        ? `${getFirstObjectName(selectedVoucher)} - Voucher`
                        : "Select a voucher first"
                    }
                    description="Amend Voucher"
                    trigger={amendButton}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                    dialogContent={
                      <RestaurantsVoucherForm
                      onSave={() => {
                        console.log("saving");
                      }}
                      // selectedItem={selectedVoucher.voucherLines[0]}
                      vendor={selectedVoucher}
                      defaultValues={{
                        restaurant: selectedVoucher?.restaurant,
                        ...selectedVoucher.voucherLines[0],
                      }}
                      restaurant={restaurants}
                    />
                    }
                    size="large"
                  />
                                <Popup
                title="Confirm Voucher"
                description="Confirm Form"
                trigger={addConfirmationButton}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                dialogContent={ConfirmationContent(
                  selectedVoucher,
                  updateVoucherStatus,
                )}
                size="small"
              />
              <Popup
                title={
                  selectedVoucher && getFirstObjectName(selectedVoucher)
                    ? `${getFirstObjectName(selectedVoucher)} - Voucher`
                    : "Select a voucher first"
                }
                description="Voucher Content"
                trigger={proceedButton}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                dialogContent={
                  <ProceedContent
                    voucherColumns={voucherColumns}
                    selectedVoucher={selectedVoucher}
                    onVoucherLineRowClick={onVoucherLineRowClick}
                    updateVoucherLine={updateVoucherLine}
                    updateVoucherStatus={updateVoucherStatus}
                    rate={rate}
                    setRate={setRate}
                    setStatusChanged={setStatusChanged}
                    type="restaurant"
                  />
                }
                size="large"
              />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantVouchersTasksTab;





