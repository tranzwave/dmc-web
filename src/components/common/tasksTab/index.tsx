"use client";
import React, { SetStateAction, useEffect, useState } from "react";
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
  updateVoucherLine: (data: any) => Promise<void>;
  updateVoucherStatus: (data: any) => Promise<boolean>;
  contactDetails?: { phone: string; email: string };
}

interface WithOptionalVoucherLine<L, T> {
  voucherLine?: L[] | T[];
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
          <div className="flex flex-row items-end justify-between">
            {selectedVoucher && getFirstObjectName(selectedVoucher)
              ? `${getFirstObjectName(selectedVoucher)} - Voucher Lines`
              : "Voucher Lines"}
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
          <DataTableWithActions
            columns={voucherColumns}
            data={
              selectedVoucher
                ? (selectedVoucher.voucherLine ?? [selectedVoucher])
                : []
            }
            onRowClick={onVoucherLineRowClick}
            onView={() => alert("View action triggered")}
            onEdit={() => alert("Edit action triggered")}
            onDelete={() => alert("Delete action triggered")}
          />
          <div className="flex w-full flex-row items-end justify-end">
            <div className="flex flex-row gap-2">
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
              {/* <Button variant={"outline"} className="border-primary-green">
                Add New Line
              </Button> */}
            </div>
          </div>
          <FormComponent
            selectedItem={selectedVoucherLine}
            onSave={() => console.log("Saved")}
            vendor={selectedVoucher}
          />
        </div>
      </div>
    </div>
  );
};

export default TasksTab;

// const CreateRateColumn = <T extends object>(
//   initialRate: number | string,
//   setRate: (rate: number | string) => void,
// ): ColumnDef<T> => ({
//   accessorKey: 'rate',
//   header: 'Rate - USD',
//   cell: ({ getValue, row, column }) => {
//     const [rate, setLocalRate] = useState<number | string>(initialRate);

//     useEffect(() => {
//       setLocalRate(initialRate);
//     }, [initialRate]);

//     const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//       const inputValue = e.target.value;
//       const newRate = parseFloat(inputValue);

//       // Check if the newRate is a valid number
//       if (!isNaN(newRate)) {
//         setLocalRate(newRate);
//         setRate(newRate);
//       } else {
//         setLocalRate(""); // Set to '' if the input is not a valid number
//         setRate("");
//       }

//       // Update the row data with the new rate value
//       (row.original as Record<string, any>)[column.id] = newRate;
//     };

//     return (
//       <Input
//         type="number"
//         value={rate === "" ? "" : rate}
//         onChange={handleRateChange}
//         className="rounded border border-gray-300 p-1"
//         style={{ width: '80px' }}
//       />
//     );
//   },
// });

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

// const ProceedContent = (
//   voucherColumns: any,
//   selectedVoucher: any,
//   onVoucherLineRowClick: any,
//   updateVoucherLine: any,
//   updateVoucherStatus: any,
//   rate: number | string,
//   setRate: any,
//   setStatusChanged: React.Dispatch<React.SetStateAction<boolean>>
// ) => {
//   const rateColumn = CreateRateColumn<typeof voucherColumns>(rate, setRate);
//   const VoucherLineColumnsWithRate = [...voucherColumns, rateColumn];

//   const [ratesConfirmedBy, setRatesConfirmedBy] = useState("");
//   const [ratesConfirmedTo, setRatesConfirmedTo] = useState("");
//   const [availabilityConfirmedBy, setAvailabilityConfirmedBy] = useState("");
//   const [availabilityConfirmedTo, setAvailabilityConfirmedTo] = useState("");
//   const { toast } = useToast();

//   const areAllFieldsFilled = () => {
//     return (
//       ratesConfirmedBy.trim() !== "" &&
//       ratesConfirmedTo.trim() !== "" &&
//       availabilityConfirmedBy.trim() !== "" &&
//       availabilityConfirmedTo.trim() !== ""
//     );
//   };

//   const handleSubmit = async () => {
//     if (!areAllFieldsFilled()) {
//       alert("Please fill all the required fields.");
//       return;
//     }

//     // Logic to check if all rates are filled
//     const areAllRatesFilled = selectedVoucher?.voucherLine?.every(
//       (line: any) => {
//         console.log(line.rate);
//         return !Number.isNaN(line.rate);
//       },
//     );

//     if (!areAllRatesFilled) {
//       alert("Please ensure all rates are filled.");
//       return;
//     }

//     try {
//       await updateVoucherLine(
//         selectedVoucher?.voucherLine ?? [selectedVoucher],
//       );
//       alert("Voucher line updated successfully!");
//     } catch (error) {
//       console.error("Failed to update voucher line:", error);
//       alert("An error occurred while updating the voucher line.");
//     }
//   };

//   const handleSendVoucher = async () => {
//     if (selectedVoucher?.status !== "inprogress") {
//       toast({
//         title: "Error",
//         description: "You've already sent the voucher to vendor",
//       });
//       return;
//     }

//     try {
//       selectedVoucher?.status ? (selectedVoucher.status = "sentToVendor") : "";
//       setStatusChanged(true)
//       await updateVoucherStatus(selectedVoucher);
//       alert("Voucher status updated successfully");
//     } catch (error) {
//       console.error("Failed to update voucher status:", error);
//     }
//   };

//   return (
//     <div className="mb-9 space-y-6">
//       <DataTableWithActions
//         columns={VoucherLineColumnsWithRate}
//         data={
//           selectedVoucher
//             ? (selectedVoucher.voucherLine ?? [selectedVoucher])
//             : []
//         }
//         onRowClick={onVoucherLineRowClick}
//         onView={() => alert("View action triggered")}
//         onEdit={() => alert("Edit action triggered")}
//         onDelete={() => alert("Delete action triggered")}
//       />

//       <div className="grid grid-cols-4 gap-2">
//         <Input
//           placeholder="Rates Confirmed By"
//           value={ratesConfirmedBy}
//           onChange={(e) => setRatesConfirmedBy(e.target.value)}
//         />
//         <Input
//           placeholder="Rates Confirmed To"
//           value={ratesConfirmedTo}
//           onChange={(e) => setRatesConfirmedTo(e.target.value)}
//         />
//         <Input
//           placeholder="Availability Confirmed By"
//           value={availabilityConfirmedBy}
//           onChange={(e) => setAvailabilityConfirmedBy(e.target.value)}
//         />
//         <Input
//           placeholder="Availability Confirmed To"
//           value={availabilityConfirmedTo}
//           onChange={(e) => setAvailabilityConfirmedTo(e.target.value)}
//         />
//       </div>
//       <div className="flex w-full flex-row justify-end gap-2">
//         <Button variant="primaryGreen" onClick={handleSendVoucher}>
//           Download Voucher
//         </Button>
//         <Button variant="primaryGreen" onClick={handleSubmit}>
//           Save Voucher Rates
//         </Button>
//       </div>
//     </div>
//   );
// };

interface ProceedContentProps {
  voucherColumns: any;
  selectedVoucher: any;
  onVoucherLineRowClick: any;
  updateVoucherLine: any;
  updateVoucherStatus: any;
  rate: number | string;
  setRate: React.Dispatch<SetStateAction<number | string>>,
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

  const [ratesConfirmedBy, setRatesConfirmedBy] = useState("");
  const [ratesConfirmedTo, setRatesConfirmedTo] = useState("");
  const [availabilityConfirmedBy, setAvailabilityConfirmedBy] = useState("");
  const [availabilityConfirmedTo, setAvailabilityConfirmedTo] = useState("");

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
    const areAllRatesFilled = selectedVoucher?.voucherLine?.every(
      (line: any) => !Number.isNaN(line.rate),
    );

    if (!areAllRatesFilled) {
      alert("Please ensure all rates are filled.");
      return;
    }

    try {
      await updateVoucherLine(
        selectedVoucher?.voucherLine ?? [selectedVoucher],
      );
      alert("Voucher line updated successfully!");
    } catch (error) {
      console.error("Failed to update voucher line:", error);
      alert("An error occurred while updating the voucher line.");
    }
  };

  const handleSendVoucher = async () => {
    if (selectedVoucher?.status !== "inprogress") {
      alert("You've already sent the voucher to vendor");
      return;
    }

    try {
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
      <DataTableWithActions
        columns={VoucherLineColumnsWithRate}
        data={
          selectedVoucher
            ? (selectedVoucher.voucherLine ?? [selectedVoucher])
            : []
        }
        onRowClick={onVoucherLineRowClick}
        onView={() => alert("View action triggered")}
        onEdit={() => alert("Edit action triggered")}
        onDelete={() => alert("Delete action triggered")}
      />

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
      <div className="flex w-full flex-row justify-end gap-2">
        <Button variant="primaryGreen" onClick={handleSendVoucher}>
          Download Voucher
        </Button>
        <Button variant="primaryGreen" onClick={handleSubmit}>
          Save Voucher Rates
        </Button>
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
