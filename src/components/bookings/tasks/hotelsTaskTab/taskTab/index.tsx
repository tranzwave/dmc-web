"use client";
import { ColumnDef } from "@tanstack/react-table";
import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Input } from "~/components/ui/input";
import { useToast } from "~/hooks/use-toast";
// import Voucher from "./voucherComponent";
import html2pdf from "html2pdf.js";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DataTable } from "~/components/bookings/home/dataTable";
import LoadingLayout from "~/components/common/dashboardLoading";
import DeletePopup from "~/components/common/deletePopup";
import Popup from "~/components/common/popup";
import { ConfirmationForm } from "~/components/common/tasksTab/confirmationForm";
import { deleteHotelVoucherLine } from "~/server/db/queries/booking";
import { getAllHotelsV2 } from "~/server/db/queries/hotel";
import { SelectHotel, SelectHotelVoucherLine } from "~/server/db/schemaTypes";
import { HotelVoucherData } from "..";
import HotelsVoucherForm from "../voucherForm";
import ProceedContent from "./proceedPopup";
import ConfirmationContent from "./confirmationPopup";
import ContactContent from "./ContactPopup";
import { createRoot } from "react-dom/client";
import HotelVoucherPDF from "../voucherTemplate";

interface TasksTabProps<T, L> {
  bookingLineId: string;
  columns: ColumnDef<HotelVoucherData>[];
  voucherColumns: ColumnDef<SelectHotelVoucherLine>[];
  vouchers: HotelVoucherData[];
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

const HotelVouchersTasksTab = <
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
  const [selectedVoucher, setSelectedVoucher] = useState<HotelVoucherData>();
  const [selectedVoucherLine, setSelectedVoucherLine] =
    useState<SelectHotelVoucherLine>();
  const [rate, setRate] = useState<string>('0');
  const [statusChanged, setStatusChanged] = useState<boolean>(false);
  const [isInprogressVoucherDelete, setIsInProgressVoucherDelete] =
    useState(false);
  const [isProceededVoucherDelete, setIsProceededVoucherDelete] =
    useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState<SelectHotel[]>([]);
  const [error, setError] = useState<string | null>();
  const deleteVoucherRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const { toast } = useToast();

  const getHotels = async () => {
    setLoading(true);

    try {
      const newResponse = await getAllHotelsV2();

      if (!newResponse) {
        throw new Error(`Error: Couldn't get hotels`);
      }
      console.log("Fetched Hotels:", newResponse);

      setHotels(newResponse);
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

  const onVoucherRowClick = (row: HotelVoucherData) => {
    setSelectedVoucher(row);
    setRate(row.voucherLines[0]?.rate ?? '0');
    if (setSelectedVendor) {
      setSelectedVendor(row);
    }
  };

  const onVoucherLineRowClick = (row: SelectHotelVoucherLine) => {
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

  const downloadCancellationVoucher = ()=>{
    try {
      downloadPDF()
    } catch (error) {
      console.error(error)
    }
  }

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
  }, [statusChanged]);

  if (loading) {
    return <LoadingLayout />;
  }

  const downloadPDF = () => {
    const tempContainer = deleteVoucherRef.current;
  
    if (tempContainer && selectedVoucher) {
      // Make the container visible
      tempContainer.style.display = "block";
  
      // Create a root and render the CancellationVoucher component into tempContainer
      const root = createRoot(tempContainer);
      root.render(<HotelVoucherPDF voucher={selectedVoucher} />);
  
      const options = {
        filename: `cancellation_voucher_${selectedVoucher.hotel.name}.pdf`,
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
      };
  
      // Generate the PDF and then clean up
      html2pdf()
        .set(options)
        .from(tempContainer)
        .save()
        .then(() => {
          // Hide the container and unmount the component after PDF is generated
          tempContainer.style.display = "none";
          root.unmount(); // Unmount the component
        });
    }
  };

  const handleInProgressVoucherDelete = async () => {
    if (selectedVoucher && selectedVoucher.status) {
      try {
        setIsDeleting(true);
        const deletedData = await deleteHotelVoucherLine(
          selectedVoucher.voucherLines[0]?.id ?? "",
        );
        if (!deletedData) {
          throw new Error("Couldn't delete voucher");
        }

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
        const voucher = selectedVoucher
        voucher.status = "cancelled"
        setStatusChanged(true);
        await updateVoucherStatus(voucher);
        // const deletedData = await deleteHotelVoucherLine(
        //   selectedVoucher.voucherLines[0]?.id ?? "",
        // );
        // if (!deletedData) {
        //   throw new Error("Couldn't delete voucher");
        // }

        // deleteVoucherLineFromLocalContext();
        toast({
          title: "Success",
          description: `Voucher ${selectedVoucher.voucherLines[0]?.id ?? ""} is cancelled`,
        });
        setIsDeleting(false);
        // window.location.reload();
      } catch (error) {
        toast({
          title: "Uh Oh",
          description: `Couldn't cancel this voucher`,
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
            <Link href={`${pathname.replace("/tasks", "")}/edit?tab=hotels`}>
              <Button variant={"outline"}>Add Vouchers</Button>
            </Link>
          </div>
          <div className="text-sm font-normal">
            Click the line to send the voucher
          </div>
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
              {selectedVoucher && selectedVoucher.voucherLines[0] && selectedVoucher.status === 'cancelled' && (
                <>
                  <Button
                    variant={"outline"}
                    className="border-red-600"
                    onClick={downloadCancellationVoucher}
                  >
                    Download Cancellation Voucher
                  </Button>
                </>
              )}
              {selectedVoucher && selectedVoucher.voucherLines[0] && selectedVoucher.status !== 'cancelled' && (
                <div className="flex flex-row gap-2">
                  <Button
                    variant={"outline"}
                    className="border-red-600"
                    onClick={renderCancelContent}
                  >
                    Cancel
                  </Button>

                  <Popup
                    title={`${selectedVoucher.hotel.name} Contact Details`}
                    description={``}
                    trigger={contactButton}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                    dialogContent={ContactContent(
                      selectedVoucher.hotel.primaryContactNumber,
                      selectedVoucher.hotel.primaryEmail,
                    )}
                    size="small"
                  />
                  <DeletePopup
                    itemName={`Voucher for ${selectedVoucher?.hotel.name}`}
                    onDelete={handleInProgressVoucherDelete}
                    isOpen={isInprogressVoucherDelete}
                    setIsOpen={setIsInProgressVoucherDelete}
                    isDeleting={isDeleting}
                    description="You haven't sent this to the vendor yet. You can cancel the
                voucher without sending a cancellation voucher"
                    cancel={true}
                  />

                  <DeletePopup
                    itemName={`Voucher for ${selectedVoucher?.hotel.name}`}
                    onDelete={handleProceededVoucherDelete}
                    isOpen={isProceededVoucherDelete}
                    setIsOpen={setIsProceededVoucherDelete}
                    isDeleting={isDeleting}
                    description="You have sent this to the vendor. This will download the cancellation voucher"
                    cancel={true}
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
                      <HotelsVoucherForm
                        onSave={() => {
                          console.log("saving");
                        }}
                        defaultValues={{
                          hotel: selectedVoucher?.hotel,
                          ...selectedVoucher.voucherLines[0],
                        }}
                        hotels={hotels}
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
                        type="hotel"
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
      <div ref={deleteVoucherRef}></div>
    </div>
  );
};

export default HotelVouchersTasksTab;
