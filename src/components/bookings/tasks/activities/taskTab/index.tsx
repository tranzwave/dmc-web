"use client";
import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { DataTableWithActions } from "~/components/common/dataTableWithActions/index";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "~/components/ui/input";
import { useToast } from "~/hooks/use-toast";
import { DataTable } from "~/components/bookings/home/dataTable";
import html2pdf from "html2pdf.js";
import {SelectActivityVoucher, SelectRestaurantVoucherLine } from "~/server/db/schemaTypes";
import Popup from "~/components/common/popup";
import DeletePopup from "~/components/common/deletePopup";
import { ConfirmationForm } from "~/components/common/tasksTab/confirmationForm";
import { ActivityVoucherData } from "..";
import ContactContent from "~/components/common/tasksTab/contactContent";

interface TasksTabProps {
  bookingLineId: string;
  columns: ColumnDef<ActivityVoucherData>[];
  voucherColumns: ColumnDef<SelectActivityVoucher>[]; 
  vouchers: ActivityVoucherData[];
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
  selectedVendor?:any
  setSelectedVendor?: React.Dispatch<React.SetStateAction<any>>;

}

const ActivityVouchersTasksTab = ({
  bookingLineId,
  columns,
  voucherColumns,
  vouchers,
//   formComponent: FormComponent,
  updateVoucherLine,
  updateVoucherStatus,
  setSelectedVendor,

}: TasksTabProps) => {
  const [selectedVoucher, setSelectedVoucher] = useState<ActivityVoucherData>();
  const [selectedVoucherLine, setSelectedVoucherLine] = useState<SelectActivityVoucher>();
  const [rate, setRate] = useState<string | number>(0);
  const [statusChanged, setStatusChanged] = useState<boolean>(false);
  const [isInprogressVoucherDelete, setIsInProgressVoucherDelete] =
    useState(false);
  const [isProceededVoucherDelete, setIsProceededVoucherDelete] =
    useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { toast } = useToast();

  const onVoucherRowClick = (row: ActivityVoucherData) => {
    setSelectedVoucher(row);
    if(setSelectedVendor){
      setSelectedVendor(row)
    }
  };

  const onVoucherLineRowClick = (row: SelectActivityVoucher) => {
    console.log(row);
    // setSelectedVoucherLine(row);
    console.log("Updating");
    console.log(selectedVoucherLine);
  };

  const handleConfirm = () => {
    console.log("Confirmed");
  };

  const handleCancel = () => {
    console.log("Cancelled");
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

  useEffect(() => {
    console.log("Status changed");
  }, [statusChanged]);

  const getContactDetails = () => {
    if(!selectedVoucher){
      return {
        phone: "",
        email:""

      }
    }
    return {
      phone: selectedVoucher.activityVendor.contactNumber,
      email: selectedVoucher.activityVendor.primaryEmail,
    };
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
            data={vouchers}
            columns={columns}
            onRowClick={onVoucherRowClick}
            onView={() => alert("View action triggered")}
            onEdit={() => alert("Edit action triggered")}
            onDelete={() => alert("Delete action triggered")}
          />
          <div className="flex flex-row items-center justify-between">
            <div className="text-sm font-normal">
              {selectedVoucher
                ? `${selectedVoucher.activityVendor.name} - Voucher Lines`
                : "Voucher Lines"}
            </div>
            {selectedVoucher ? (
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
                  dialogContent={ContactContent(selectedVoucher.activityVendor.contactNumber, selectedVoucher.activityVendor.primaryEmail ?? "N/A")}
                  size="small"
                />
                <DeletePopup
                  itemName={`Voucher for ${selectedVoucher?.activityVendor.name}`}
                  onDelete={() => {
                    console.log("Deleting");
                  }}
                  isOpen={isInprogressVoucherDelete}
                  setIsOpen={setIsInProgressVoucherDelete}
                  isDeleting={isDeleting}
                  description="You haven't sent this to the vendor yet. You can delete the
                voucher without sending a cancellation voucher"
                />
                <DeletePopup
                  itemName={`Voucher for ${selectedVoucher?.activityVendor.name}`}
                  onDelete={() => {
                    console.log("Deleting");
                  }}
                  isOpen={isProceededVoucherDelete}
                  setIsOpen={setIsProceededVoucherDelete}
                  isDeleting={isDeleting}
                  description={`You have already proceeded with this voucher, and it's in the status of ${selectedVoucher.status} \n
                Are you sure you want to cancel this voucher? This will give you the cancellation voucher and delete the voucher from this booking`}
                />
              </div>
            ) : (
              ""
            )}
          </div>

          {/* <DataTableWithActions
            columns={voucherColumns}
            data={selectedVoucher ?? []}
            onRowClick={onVoucherLineRowClick}
            onView={() => alert("View action triggered")}
            onEdit={() => alert("Edit action triggered")}
            onDelete={() => alert("Delete action triggered")}
          /> */}
          <div
            className={`flex flex-row items-end justify-end ${!selectedVoucher ? "hidden" : ""}`}
          >
            <div className="flex flex-row gap-2">
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
                  selectedVoucher ? `${selectedVoucher.activityVendor.name} - Voucher`
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
        </div>
      </div>
    </div>
  );
};

export default ActivityVouchersTasksTab;

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


