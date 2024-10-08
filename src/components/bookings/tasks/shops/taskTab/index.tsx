"use client";
import { ColumnDef } from "@tanstack/react-table";
import html2pdf from "html2pdf.js";
import React, { useEffect, useRef, useState } from "react";
import { DataTableWithActions } from "~/components/common/dataTableWithActions/index";
import DeletePopup from "~/components/common/deletePopup";
import Popup from "~/components/common/popup";
import { ConfirmationForm } from "~/components/common/tasksTab/confirmationForm";
import ContactContent from "~/components/common/tasksTab/contactContent";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { useToast } from "~/hooks/use-toast";
import { updateShopVoucherStatus } from "~/server/db/queries/booking/shopsVouchers";
import { ShopVoucherData } from "..";
import ShopVoucherPDF from "../voucherTemplate";

interface TasksTabProps {
  bookingLineId: string;
  voucherColumns: ColumnDef<ShopVoucherData>[];
  selectedVoucherColumns: ColumnDef<ShopVoucherData>[];
  vouchers: ShopVoucherData[];
  updateVoucherLine: (
    data: any,
    confirmationDetails?: {
      availabilityConfirmedBy: string;
      availabilityConfirmedTo: string;
      ratesConfirmedBy: string;
      ratesConfirmedTo: string;
    },
  ) => Promise<void>;
  contactDetails?: { phone: string; email: string };
}

const ShopVouchersTasksTab = ({
  bookingLineId,
  voucherColumns,
  selectedVoucherColumns,
  vouchers,
  updateVoucherLine,
}: TasksTabProps) => {
  const [selectedVoucher, setSelectedVoucher] = useState<ShopVoucherData>();
  //   const [selectedVoucherLine, setSelectedVoucherLine] = useState<ShopVoucherData>();
  const [rate, setRate] = useState<string | number>(0);
  const [statusChanged, setStatusChanged] = useState<boolean>(false);
  const [isInprogressVoucherDelete, setIsInProgressVoucherDelete] =
    useState(false);
  const [isProceededVoucherDelete, setIsProceededVoucherDelete] =
    useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false)

  const { toast } = useToast();

  const onVoucherRowClick = (row: ShopVoucherData) => {
    setSelectedVoucher(row);
  };

  const onVoucherLineRowClick = (row: ShopVoucherData) => {
    console.log(row);
    // setSelectedVoucherLine(row);
    console.log("Updating");
    // console.log(selectedVoucherLine);
  };

  const handleConfirm = async() => {
    if(selectedVoucher){
      if(selectedVoucher.status == "vendorConfirmed"){
        toast({
          title: "Uh Oh!",
          description: "You have already confirmed",
        });
        return
      }

      try{
        setIsConfirming(true)
        const updateResult = await updateShopVoucherStatus(selectedVoucher.id, "vendorConfirmed");

        if(!updateResult){
          throw new Error("Couldn't update the status")
        }

        setIsConfirming(false)
        toast({
          title: "Success!",
          description: "Shop is confirmed",
        });
      } catch (error){
        console.error("Couldn't confirm this shop")
        setIsConfirming(false)
        toast({
          title: "Uh Oh!",
          description: "Couldn't confirm the shop",
        });
      }
    }
    console.log("Vendor confirmed");
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
    <Button variant={"primaryGreen"}>Confirm Shop</Button>
  );

  const contactButton = (
    <Button variant={"outline"} className="border-primary-green">
      Contact
    </Button>
  );

  const aosDocButton = (
    <Button variant={"primaryGreen"}>Amount of Sales Document</Button>
  );

  useEffect(() => {
    console.log("Status changed");
  }, [statusChanged]);

  const getContactDetails = () => {
    if (!selectedVoucher) {
      return {
        phone: "",
        email: "",
      };
    }
    return {
      phone: selectedVoucher.shop.contactNumber,
      email: selectedVoucher.shop.primaryEmail,
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
            columns={voucherColumns}
            onRowClick={onVoucherRowClick}
            onView={() => alert("View action triggered")}
            onEdit={() => alert("Edit action triggered")}
            onDelete={() => alert("Delete action triggered")}
          />
          <div className="flex flex-row items-center justify-between">
            <div className="text-sm font-normal">
              {selectedVoucher
                ? `${selectedVoucher.shop.name} - Voucher`
                : "Select a voucher from above table"}
            </div>

            <Popup
              title={"Amount of sales"}
              description="Please click on preview button to get the document"
              trigger={aosDocButton}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
              dialogContent={
                <ProceedContent
                  voucherColumns={voucherColumns}
                  vouchers={vouchers}
                  setStatusChanged={setStatusChanged}
                />
              }
              size="large"
            />
          </div>

          <DataTableWithActions
            columns={voucherColumns}
            data={selectedVoucher ? [selectedVoucher] : []}
            onRowClick={onVoucherLineRowClick}
            onView={() => alert("View action triggered")}
            onEdit={() => alert("Edit action triggered")}
            onDelete={() => alert("Delete action triggered")}
          />
          <div
            className={`flex flex-row items-end justify-end ${!selectedVoucher ? "hidden" : ""}`}
          >
            <div className="flex flex-row gap-2">
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
                    dialogContent={ContactContent(
                      selectedVoucher.shop.contactNumber,
                      selectedVoucher.shop.primaryEmail ?? "N/A",
                    )}
                    size="small"
                  />
                  <DeletePopup
                    itemName={`Voucher for ${selectedVoucher?.shop.name}`}
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
                    itemName={`Voucher for ${selectedVoucher?.shop.name}`}
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
              <Button variant={"primaryGreen"} onClick={handleConfirm} disabled={isConfirming}>
                Confirm Shop
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopVouchersTasksTab;

// const CreateRateColumn = <T extends object>(
//   initialRate: number | string,
//   setRate: React.Dispatch<SetStateAction<number | string>>,
// ): ColumnDef<T> => ({
//   accessorKey: "rate",
//   header: "Rate - USD",
//   cell: ({ getValue, row, column }) => {
//     // Create a separate component to handle state and rendering
//     const RateInput = () => {
//       const [rate, setLocalRate] = useState<number | string>(initialRate);

//       useEffect(() => {
//         setLocalRate(initialRate);
//       }, [initialRate]);

//       const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const inputValue = e.target.value;
//         const newRate = parseFloat(inputValue);

//         // Check if the newRate is a valid number
//         if (!isNaN(newRate)) {
//           setLocalRate(newRate);
//           setRate(newRate);
//         } else {
//           setLocalRate(""); // Set to '' if the input is not a valid number
//           setRate("");
//         }

//         // Update the row data with the new rate value
//         (row.original as Record<string, any>)[column.id] = newRate;
//       };

//       return (
//         <Input
//           type="number"
//           value={rate === "" ? "" : rate}
//           onChange={handleRateChange}
//           className="rounded border border-gray-300 p-1"
//           style={{ width: "80px" }}
//         />
//       );
//     };

//     // Render the RateInput component inside the cell
//     return <RateInput />;
//   },
// });
interface ProceedContentProps {
  voucherColumns: any;
  vouchers: ShopVoucherData[];
  setStatusChanged: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProceedContent: React.FC<ProceedContentProps> = ({
  voucherColumns,
  vouchers,
  setStatusChanged,
}) => {
  const VoucherLineColumnsWithRate = [...voucherColumns];

  const componentRef = useRef<HTMLDivElement>(null);

  const downloadPDF = () => {
    const tempContainer = document.createElement("div");

    const componentElement = componentRef.current?.cloneNode(true);

    // Create the footer section
    const footerElement = document.createElement("div");
    footerElement.innerHTML = `
      <div>
      </div>
    `;

    if (componentElement) {
      tempContainer.appendChild(componentElement);
    }

    tempContainer.style.width = "210mm"; // Set width to A4 size (portrait)
    tempContainer.style.minHeight = "297mm"; // Minimum height of A4 size
    tempContainer.style.padding = "10mm"; // Padding for the container
    tempContainer.style.backgroundColor = "white"; // Set background to white

    document.body.appendChild(tempContainer);

    // Generate the PDF from the temporary container
    const options = {
      filename: `Amount_Of_Sales_${vouchers[0]?.bookingLineId}.pdf`,
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

  return (
    <div className="mb-9 space-y-6">
      <div className="flex flex-row justify-end">
        <Button variant="primaryGreen" onClick={downloadPDF}>
          Download Amount Of Sales Document
        </Button>
      </div>
      <div ref={componentRef}>
        <ShopVoucherPDF vouchers={vouchers} />
      </div>
      <div className="flex w-full flex-row justify-end gap-2"></div>
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
