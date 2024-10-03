"use client";
import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { DataTableWithActions } from "~/components/common/dataTableWithActions/index";
import { ColumnDef } from "@tanstack/react-table";
import Popup from "../popup";
import { Input } from "~/components/ui/input";
import { useToast } from "~/hooks/use-toast";
import { ConfirmationForm } from "./confirmationForm";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import Voucher from "./voucherComponent";
import { DataTable } from "~/components/bookings/home/dataTable";
import html2pdf from "html2pdf.js";

// Define props type for the TasksTab component
interface TasksTabProps<T, L> {
  bookingLineId: string;
  columns: ColumnDef<T>[]; // Columns for the main vouchers
  voucherColumns: ColumnDef<L>[]; // Columns for the voucher lines
  vouchers: T[]; // Directly pass the voucher array
  formComponent: React.FC<{
    selectedItem: any | undefined;
    onSave: () => void;
    vendor: any;
  }>; // Form component for editing/creating vouchers
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
}

interface WithOptionalVoucherLine<L, T> {
  voucherLines?: L[] | T[];
}

const TasksTab = <
  T extends object & WithOptionalVoucherLine<L, T>,
  L extends object,
>({
  bookingLineId,
  columns,
  voucherColumns,
  vouchers,
  formComponent: FormComponent,
  updateVoucherLine,
  updateVoucherStatus,
  contactDetails,
}: TasksTabProps<T, L>) => {
  const [selectedVoucher, setSelectedVoucher] = useState<any>();
  const [selectedVoucherLine, setSelectedVoucherLine] = useState<any>();
  const [rate, setRate] = useState<string | number>(0);
  const [statusChanged, setStatusChanged] = useState<boolean>(false);

  const { toast } = useToast();

  const onVoucherRowClick = (row: T) => {
    setSelectedVoucher(row);
  };

  const onVoucherLineRowClick = (row: L) => {
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

  // const confirmationContent = (
  //   <div>
  //     <p>Confirmation</p>
  //   </div>
  // );

  const cancelContent = (
    <div>
      <p>Cancel</p>
    </div>
  );

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

  useEffect(() => {
    console.log("Status changed");
  }, [statusChanged]);

  const voucherData = {
    clientName: "John Doe",
    bookingId: "12345",
    hotelName: "Grand Hotel",
    checkInDate: "2023-10-01",
    checkOutDate: "2023-10-05",
    numberOfDays: 4,
    roomType: "Deluxe Suite",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="flex w-full flex-row justify-center gap-3">
        <div>
          <Calendar />
        </div>
        <div className="card w-full space-y-6">
          <div className="card-title">Voucher Information</div>
          <DataTableWithActions
            columns={columns}
            data={vouchers}
            onRowClick={onVoucherRowClick}
            onView={() => alert("View action triggered")}
            onEdit={() => alert("Edit action triggered")}
            onDelete={() => alert("Delete action triggered")}
          />
          <div className="text-sm font-normal">
            {selectedVoucher && getFirstObjectName(selectedVoucher)
              ? `${getFirstObjectName(selectedVoucher)} - Voucher Lines`
              : "Voucher Lines"}
          </div>

          <DataTableWithActions
            columns={voucherColumns}
            data={
              selectedVoucher
                ? selectedVoucher.voucherLines // Check if `voucherLines` is defined
                  ? selectedVoucher.voucherLines // Use `voucherLines` if present
                  : Array.isArray(selectedVoucher.voucherLine) // Otherwise, check if `voucherLine` is an array
                    ? selectedVoucher.voucherLine // Use `voucherLine` if it's already an array
                    : [selectedVoucher.voucherLine ?? selectedVoucher] // If `voucherLine` is a single object, wrap in an array
                : []
            }
            onRowClick={onVoucherLineRowClick}
            onView={() => alert("View action triggered")}
            onEdit={() => alert("Edit action triggered")}
            onDelete={() => alert("Delete action triggered")}
          />
          <div
            className={`flex flex-row items-end justify-end ${!selectedVoucher ? "hidden" : ""}`}
          >
            <div className="flex flex-row gap-2">
              <Popup
                title="Cancel Voucher"
                description="This action cannot be undone"
                trigger={cancelButton}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                dialogContent={cancelContent}
                size="small"
              />

              <Popup
                title="Contact"
                description="Loading Contact Details"
                trigger={contactButton}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                dialogContent={ContactContent(
                  contactDetails?.phone ?? "",
                  contactDetails?.phone ?? "",
                )}
                size="small"
              />

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

export default TasksTab;

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

      useEffect(() => {
        setLocalRate(initialRate);
      }, [initialRate]);

      const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const newRate = parseFloat(inputValue);

        // Check if the newRate is a valid number
        if (!isNaN(newRate)) {
          setLocalRate(newRate);
          setRate(newRate);
        } else {
          setLocalRate(""); // Set to '' if the input is not a valid number
          setRate("");
        }

        // Update the row data with the new rate value
        (row.original as Record<string, any>)[column.id] = newRate;
      };

      return (
        <Input
          type="number"
          value={rate === "" ? "" : rate}
          onChange={handleRateChange}
          className="rounded border border-gray-300 p-1"
          style={{ width: "80px" }}
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
    headerElement.innerHTML = `
      <div style="padding: 20px; background-color: #004080; color: white; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">Tour Agency Hotel Voucher</h1>
        <p style="margin: 0; font-size: 14px;">This voucher is issued for the following booking details</p>
      </div>
    `;
  
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
      <div style="padding: 20px; background-color: #004080; color: white; text-align: center;">
        <p style="margin: 0; font-size: 12px;">Tour Agency, 123 Travel Street, City, Country</p>
        <p style="margin: 0; font-size: 12px;">Email: info@touragency.com | Phone: +1 234 567 890</p>
      </div>
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
      downloadPDF()
      return;
    }

    try {
      downloadPDF()
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
      <div ref={componentRef} className="flex flex-col gap-4 p-4">
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
          <Input
            placeholder="Rates Confirmed By"
            value={ratesConfirmedBy}
            onChange={(e) => setRatesConfirmedBy(e.target.value)}
          />
          <Input
            placeholder="Rates Confirmed To"
            value={ratesConfirmedTo}
            onChange={(e) => setRatesConfirmedTo(e.target.value)}
          />
          <Input
            placeholder="Availability Confirmed By"
            value={availabilityConfirmedBy}
            onChange={(e) => setAvailabilityConfirmedBy(e.target.value)}
          />
          <Input
            placeholder="Availability Confirmed To"
            value={availabilityConfirmedTo}
            onChange={(e) => setAvailabilityConfirmedTo(e.target.value)}
          />
        </div>
      </div>

      <div className="flex w-full flex-row justify-end gap-2">
        <Button variant="primaryGreen" onClick={handleSendVoucher}>
          Download Voucher
        </Button>
        <Button variant="primaryGreen" onClick={handleSubmit}>
          Save Voucher Rates
        </Button>
      </div>
      <div>
        {/* <Voucher
        clientName="John Doe"
        bookingId="AB12345"
        hotelName="Luxury Hotel"
        checkInDate="2024-10-05"
        checkOutDate="2024-10-10"
        numberOfDays={5}
        roomType="Deluxe Suite"
      /> */}
      </div>
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
