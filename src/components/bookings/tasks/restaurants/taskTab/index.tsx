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
  const [rate, setRate] = useState<string | number>(0);
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
    setRate(row.voucherLines[0]?.rate ?? 0);
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
                </div>
              )}


              <Popup
                title="Confirm Voucher"
                description="Confirm Form"
                trigger={addConfirmationButton}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                dialogContent={confirmationContent(
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
                  />
                }
                size="large"
              />
            </div>
          </div>

          {/* <div>
            {selectedVoucher && (
              <restaurantVoucherPDF voucher={selectedVoucher}/>
            )}
          </div> */}

          {/* <ProceedContent
            voucherColumns={voucherColumns}
            selectedVoucher={selectedVoucher}
            onVoucherLineRowClick={onVoucherLineRowClick}
            updateVoucherLine={updateVoucherLine}
            updateVoucherStatus={updateVoucherStatus}
            rate={rate}
            setRate={setRate}
            setStatusChanged={setStatusChanged}
          /> */}

          {/* <Voucher {...voucherData} /> */}

          {/* <FormComponent
            selectedItem={selectedVoucherLine}
            onSave={() => console.log("Saved")}
            vendor={selectedVoucher}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default RestaurantVouchersTasksTab;

const CreateRateColumn = <T extends object>(
  initialRate: number | string,
  setRate: React.Dispatch<SetStateAction<number | string>>,
): ColumnDef<T> => ({
  accessorKey: "rate",
  header: "Rate - USD",
  cell: ({ getValue, row, column }) => {
    // Create a separate component to handle state and rendering
    const RateInput = () => {
      const [rate, setLocalRate] = useState<number | string>(initialRate);
      const inputRef = useRef<HTMLInputElement | null>(null);

      useEffect(() => {
        setLocalRate(initialRate);
      }, [initialRate]);

      const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        // Allow empty input or valid decimal/float values
        if (inputValue === "" || /^(\d+(\.\d{0,2})?)?$/.test(inputValue)) {
          setLocalRate(inputValue); // Set local rate directly to the input value
          const newRate = inputValue === "" ? "" : parseFloat(inputValue);

          // Update the rate state with the new rate
          setRate(newRate);

          // Update the row data with the new rate value
          (row.original as Record<string, any>)[column.id] = newRate;
        }
      };

      // Focus the input element when it's mounted
      useEffect(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, []);

      return (
        <Input
          // ref={inputRef} // Attach the ref to the input
          type="number" // You can keep this as "number" if you want to restrict to number inputs
          value={rate}
          onChange={handleRateChange}
          className="rounded border border-gray-300 p-1"
          style={{ width: "80px" }}
          placeholder="0.00" // Optional placeholder for clarity
        />
      );
    };

    // Render the RateInput component inside the cell
    return <RateInput />;
  },
});

interface ProceedContentProps {
  voucherColumns: any;
  selectedVoucher: any;
  onVoucherLineRowClick: any;
  updateVoucherLine: any;
  updateVoucherStatus: any;
  rate: number | string;
  setRate: React.Dispatch<SetStateAction<number | string>>;
  setStatusChanged: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProceedContent: React.FC<ProceedContentProps> = ({
  voucherColumns,
  selectedVoucher,
  onVoucherLineRowClick,
  updateVoucherLine,
  updateVoucherStatus,
  rate,
  setRate,
  setStatusChanged,
}) => {
  const rateColumn = CreateRateColumn<typeof voucherColumns>(rate, setRate);
  const VoucherLineColumnsWithRate = [...voucherColumns, rateColumn];

  const [ratesConfirmedBy, setRatesConfirmedBy] = useState(
    selectedVoucher?.ratesConfirmedBy ?? "",
  );
  const [ratesConfirmedTo, setRatesConfirmedTo] = useState(
    selectedVoucher?.ratesConfirmedTo ?? "",
  );
  const [availabilityConfirmedBy, setAvailabilityConfirmedBy] = useState(
    selectedVoucher?.availabilityConfirmedBy ?? "",
  );
  const [availabilityConfirmedTo, setAvailabilityConfirmedTo] = useState(
    selectedVoucher?.availabilityConfirmedTo ?? "",
  );

  const componentRef = useRef<HTMLDivElement>(null);

  const downloadPDF = () => {
    // Create a temporary container to hold the entire PDF content
    const tempContainer = document.createElement("div");

    // Create the header section
    const headerElement = document.createElement("div");
    headerElement.innerHTML = ``;

    // Clone the componentRef element and add it as the main content
    const componentElement = componentRef.current?.cloneNode(true);

    // Create an additional section (optional, modify as needed)
    const additionalElement = document.createElement("div");
    additionalElement.innerHTML = `
      <div style="padding: 20px; background-color: #f0f0f0;">

      </div>
    `;

    // Create the footer section
    const footerElement = document.createElement("div");
    footerElement.innerHTML = `

    `;

    // Append header, main content, and footer to the temporary container
    tempContainer.appendChild(headerElement); // Add the header
    if (componentElement) {
      tempContainer.appendChild(componentElement); // Add the main content if available
    }
    tempContainer.appendChild(additionalElement); // Optional section
    tempContainer.appendChild(footerElement); // Add the footer

    // Apply some basic styling to the container for better formatting
    tempContainer.style.width = "210mm"; // Set width to A4 size (portrait)
    tempContainer.style.minHeight = "297mm"; // Minimum height of A4 size
    tempContainer.style.padding = "10mm"; // Padding for the container
    tempContainer.style.backgroundColor = "white"; // Set background to white

    // Append the temporary container to the body (invisible)
    document.body.appendChild(tempContainer);

    // Generate the PDF from the temporary container
    const options = {
      filename: "booking_summary.pdf",
      jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
    };
    html2pdf()
      .set(options)
      .from(tempContainer)
      .save()
      .then(() => {
        // Remove the temporary container after the PDF is generated
        document.body.removeChild(tempContainer);
      });
  };

  const areAllFieldsFilled = () => {
    return (
      ratesConfirmedBy.trim() !== "" &&
      ratesConfirmedTo.trim() !== "" &&
      availabilityConfirmedBy.trim() !== "" &&
      availabilityConfirmedTo.trim() !== ""
    );
  };

  const handleSubmit = async () => {
    if (!areAllFieldsFilled()) {
      alert("Please fill all the required fields.");
      return;
    }

    // Logic to check if all rates are filled
    const areAllRatesFilled = selectedVoucher?.voucherLines?.every(
      (line: any) => {
        // alert(line.rate)
        return !Number.isNaN(line.rate);
      },
    );

    if (!areAllRatesFilled) {
      alert("Please ensure all rates are filled.");
      return;
    }

    // alert(availabilityConfirmedBy)

    try {
      console.log({
        availabilityConfirmedBy: availabilityConfirmedBy,
        availabilityConfirmedTo: availabilityConfirmedTo,
        ratesConfirmedBy: ratesConfirmedBy,
        ratesConfirmedTo: ratesConfirmedTo,
      });
      await updateVoucherLine(
        selectedVoucher?.voucherLines ?? [selectedVoucher],
        {
          availabilityConfirmedBy: availabilityConfirmedBy,
          availabilityConfirmedTo: availabilityConfirmedTo,
          ratesConfirmedBy: ratesConfirmedBy,
          ratesConfirmedTo: ratesConfirmedTo,
        },
      );
      alert("Voucher line updated successfully!");
    } catch (error) {
      console.error("Failed to update voucher line:", error);
      alert("An error occurred while updating the voucher line.");
    }
  };

  const handleSendVoucher = async () => {
    if (selectedVoucher?.status !== "inprogress") {
      alert("You've already downloaded sent the voucher to vendor");
      downloadPDF();
      return;
    }

    try {
      downloadPDF();
      if (selectedVoucher?.status) {
        selectedVoucher.status = "sentToVendor";
      }
      setStatusChanged(true);
      await updateVoucherStatus(selectedVoucher);
      alert("Voucher status updated successfully");
    } catch (error) {
      console.error("Failed to update voucher status:", error);
    }
  };

  return (
    <div className="mb-9 space-y-6">
      <div className="flex flex-col gap-4 p-4">
        <DataTable
          columns={VoucherLineColumnsWithRate}
          data={
            selectedVoucher
              ? (selectedVoucher.voucherLines ?? [selectedVoucher])
              : []
          }
        />
        {/* <DataTableWithActions
        columns={VoucherLineColumnsWithRate}
        data={
          selectedVoucher
            ? (selectedVoucher.voucherLines ?? [selectedVoucher])
            : []
        }
        onRowClick={onVoucherLineRowClick}
        onView={() => alert("View action triggered")}
        onEdit={() => alert("Edit action triggered")}
        onDelete={() => alert("Delete action triggered")}
      /> */}

        <div className="grid grid-cols-4 gap-2">
          <div>
            <div className="text-[13px] text-neutral-900">
              Availability confirmed by
            </div>
            <Input
              placeholder="Availability Confirmed By"
              value={availabilityConfirmedBy}
              onChange={(e) => setAvailabilityConfirmedBy(e.target.value)}
            />
          </div>

          <div>
            <div className="text-[13px] text-neutral-900">
              Availability confirmed to
            </div>
            <Input
              placeholder="Availability Confirmed To"
              value={availabilityConfirmedTo}
              onChange={(e) => setAvailabilityConfirmedTo(e.target.value)}
            />
          </div>

          <div>
            <div className="text-[13px] text-neutral-900">
              Rates confirmed by
            </div>

            <Input
              placeholder="Rates Confirmed By"
              value={ratesConfirmedBy}
              onChange={(e) => setRatesConfirmedBy(e.target.value)}
            />
          </div>

          <div>
            <div className="text-[13px] text-neutral-900">
              Rates confirmed to
            </div>
            <Input
              placeholder="Rates Confirmed To"
              value={ratesConfirmedTo}
              onChange={(e) => setRatesConfirmedTo(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex w-full flex-row justify-end gap-2">
        <Button variant="primaryGreen" onClick={handleSubmit}>
          Save Voucher Rates
        </Button>
      </div>

      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="w-full justify-end">
            <div className="text-sm font-normal text-neutral-900">
              Preview Voucher
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-2">
            <div className="flex flex-row justify-end">
              <Button variant="primaryGreen" onClick={handleSendVoucher}>
                Download Voucher
              </Button>
            </div>
            <div ref={componentRef}>
              <RestaurantVoucherPDF voucher={selectedVoucher} />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div></div>
    </div>
  );
};

const confirmationContent = (
  selectedVoucher: any,
  updateVoucherStatus: any,
) => {
  if (!selectedVoucher?.status) {
    return (
      <div>
        <p>Please select a voucher</p>
      </div>
    );
  }
  if (selectedVoucher?.status === "sentToVendor") {
    return (
      <div className="space-y-6">
        <ConfirmationForm
          selectedVoucher={selectedVoucher}
          updateVoucherStatus={updateVoucherStatus}
        />
      </div>
    );
  }

  if (selectedVoucher?.status === "inprogress") {
    return (
      <div>
        <p>Click Proceed and send voucher first</p>
      </div>
    );
  } else {
    return <div>You have already confirmed the voucher</div>;
  }
};

const ContactContent = (phone: string, email: string) => {
  return (
    <div>
      <div className="bg-slate-100 p-2">
        <div className="text-base font-semibold">Email</div>
        <div className="text-sm font-normal text-zinc-800">{email}</div>
      </div>
      <div className="bg-slate-100 p-2">
        <div className="text-base font-semibold">Contact Number</div>
        <div className="text-sm font-normal text-zinc-800">{phone}</div>
      </div>
    </div>
  );
};
