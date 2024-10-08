"use client";
import { ColumnDef } from "@tanstack/react-table";
import html2pdf from "html2pdf.js";
import React, { useEffect, useRef, useState } from "react";
import { DataTableWithActions } from "~/components/common/dataTableWithActions/index";
import DeletePopup from "~/components/common/deletePopup";
import Popup from "~/components/common/popup";
import ContactContent from "~/components/common/tasksTab/contactContent";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { useToast } from "~/hooks/use-toast";
import { updateShopVoucherStatus } from "~/server/db/queries/booking/shopsVouchers";
import { ActivityVoucherData } from "..";
import ShopVoucherPDF from "../voucherTemplate";

interface TasksTabProps {
  bookingLineId: string;
  voucherColumns: ColumnDef<ActivityVoucherData>[];
  selectedVoucherColumns: ColumnDef<ActivityVoucherData>[];
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
  contactDetails?: { phone: string; email: string };
  // columns: ColumnDef<ActivityVoucherData>[]; // Ensure to use the correct type

}

const ActivityVouchersTab = ({
  bookingLineId,
  voucherColumns,
  selectedVoucherColumns,
  vouchers,
  updateVoucherLine,
}: TasksTabProps) => {
  const [selectedVoucher, setSelectedVoucher] = useState<ActivityVoucherData>();
  const [rate, setRate] = useState<string | number>(0);
  const [statusChanged, setStatusChanged] = useState<boolean>(false);
  const [isInProgressVoucherDelete, setIsInProgressVoucherDelete] =
    useState(false);
  const [isProceededVoucherDelete, setIsProceededVoucherDelete] =
    useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const { toast } = useToast();

  const onVoucherRowClick = (row: ActivityVoucherData) => {
    // setSelectedVoucher(row);
    console.log(row);
    console.log("Updating");


  };

  const handleConfirm = async () => {
    if (selectedVoucher) {
      if (selectedVoucher.status === "vendorConfirmed") {
        toast({
          title: "Uh Oh!",
          description: "You have already confirmed",
        });
        return;
      }

      try {
        setIsConfirming(true);
        const updateResult = await updateShopVoucherStatus(selectedVoucher.id, "vendorConfirmed");

        if (!updateResult) {
          throw new Error("Couldn't update the status");
        }

        setIsConfirming(false);
        toast({
          title: "Success!",
          description: "Shop is confirmed",
        });
      } catch (error) {
        console.error("Couldn't confirm this shop");
        setIsConfirming(false);
        toast({
          title: "Uh Oh!",
          description: "Couldn't confirm the shop",
        });
      }
    }
    console.log("Vendor confirmed");
  };

  const renderCancelContent = () => {
    if (selectedVoucher) {
      if (selectedVoucher.status) {
        if (selectedVoucher.status === "inprogress") {
          setIsInProgressVoucherDelete(true);
        } else {
          setIsProceededVoucherDelete(true);
        }
      }
    }
  };

  const contactButton = (
    <Button variant={"outline"} className="border-primary-green">
      Contact
    </Button>
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
            columns={voucherColumns}
            onRowClick={onVoucherRowClick}
            onView={() => alert("View action triggered")}
            onEdit={() => alert("Edit action triggered")}
            onDelete={() => alert("Delete action triggered")}
          />
          <div className="flex flex-row items-center justify-between">
            <div className="text-sm font-normal">
              {selectedVoucher
                ? `${selectedVoucher.activityVendor.name} - Voucher`
                : "Select a voucher from above table"}
            </div>

            <Popup
              title={"Amount of sales"}
              description="Please click on preview button to get the document"
              trigger={<Button variant={"primaryGreen"}>Amount of Sales Document</Button>}
              onConfirm={handleConfirm}
              onCancel={() => console.log("Cancelled")}
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
            onRowClick={() => console.log("Row clicked")}
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
                    onCancel={() => console.log("Cancelled")}
                    dialogContent={ContactContent(
                      selectedVoucher.activityVendor.contactNumber,
                      selectedVoucher.activityVendor.primaryEmail ?? "N/A",
                    )}
                    size="small"
                  />
                  <DeletePopup
                    itemName={`Voucher for ${selectedVoucher?.activityVendor.name}`}
                    onDelete={() => console.log("Deleting")}
                    isOpen={isInProgressVoucherDelete}
                    setIsOpen={setIsInProgressVoucherDelete}
                    isDeleting={isDeleting}
                    description="You haven't sent this to the vendor yet. You can delete the
                voucher without sending a cancellation voucher"
                  />
                  <DeletePopup
                    itemName={`Voucher for ${selectedVoucher?.activityVendor.name}`}
                    onDelete={() => console.log("Deleting")}
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
                Confirm Activity
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityVouchersTab;

interface ProceedContentProps {
  voucherColumns: any;
  vouchers: ActivityVoucherData[];
  setStatusChanged: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProceedContent: React.FC<ProceedContentProps> = ({
  voucherColumns,
  vouchers,
  setStatusChanged,
}) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const downloadPDF = () => {
    const tempContainer = document.createElement("div");
    const componentElement = componentRef.current?.cloneNode(true);
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
    const options = {
      filename: `Amount_Of_Sales_${vouchers[0]?.bookingLineId}.pdf`,
      jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
    };
    html2pdf()
      .set(options)
      .from(tempContainer)
      .save()
      .then(() => {
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
