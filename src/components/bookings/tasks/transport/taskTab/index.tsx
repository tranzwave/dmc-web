"use client";
import { ColumnDef } from "@tanstack/react-table";
import html2pdf from "html2pdf.js";
import { LoaderCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import DeletePopup from "~/components/common/deletePopup";
import Popup from "~/components/common/popup";
import ContactContent from "~/components/common/tasksTab/contactContent";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { useToast } from "~/hooks/use-toast";
import { deleteTransportVoucher, updateTransportVoucherStatus } from "~/server/db/queries/booking/transportVouchers";
import { TransportVoucherData } from "..";
import DriverTransportVoucherPDF from "../driverVoucherTemplate";
import GuideTransportVoucherPDF from "../guideVoucherTemplate";

interface TasksTabProps {
  bookingLineId: string;
  voucherColumns: ColumnDef<TransportVoucherData>[];
  selectedVoucherColumns: ColumnDef<TransportVoucherData>[];
  vouchers: TransportVoucherData[];
  updateVoucherLine: (
    data: any,
    confirmationDetails?: {
      availabilityConfirmedBy: string;
      availabilityConfirmedTo: string;
      ratesConfirmedBy: string;
      ratesConfirmedTo: string;
    },
  ) => Promise<void>;
  setStatusChanged: React.Dispatch<React.SetStateAction<boolean>>;
  statusChanged:boolean
  contactDetails?: { phone: string; email: string };
  // columns: ColumnDef<ActivityVoucherData>[]; // Ensure to use the correct type
}

const ActivityVouchersTab = ({
  bookingLineId,
  voucherColumns,
  selectedVoucherColumns,
  vouchers,
  updateVoucherLine,
  setStatusChanged,
  statusChanged
}: TasksTabProps) => {
  const [selectedVoucher, setSelectedVoucher] =
    useState<TransportVoucherData>();
  const [rate, setRate] = useState<string | number>(0);
  
  const [isInProgressVoucherDelete, setIsInProgressVoucherDelete] =
    useState(false);
  const [isProceededVoucherDelete, setIsProceededVoucherDelete] =
    useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const { toast } = useToast();
  const router = useRouter()
  const pathname = usePathname() 

  const onVoucherRowClick = (row: TransportVoucherData) => {
    setSelectedVoucher(row);
    console.log(selectedVoucher)
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
        const updateResult = await updateTransportVoucherStatus(
          selectedVoucher.id,
          "vendorConfirmed",
        );

        if (!updateResult) {
          throw new Error("Couldn't update the status");
        }

        setIsConfirming(false);
        toast({
          title: "Success!",
          description: "Driver is confirmed",
        });
      } catch (error) {
        console.error("Couldn't confirm this driver");
        setIsConfirming(false);
        toast({
          title: "Uh Oh!",
          description: "Couldn't confirm the driver",
        });
      }
    }
    console.log("Driver confirmed");
    setStatusChanged(!statusChanged)
    router.push(`${pathname}?tab=transport`)
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

  const deleteVoucher = async()=>{
    if (selectedVoucher) {
      if (selectedVoucher.status === "cancelled") {
        toast({
          title: "Uh Oh!",
          description: "This is already cancelled",
        });
        return;
      }

      try {
        setIsDeleting(true);
        const updateResult = await deleteTransportVoucher(
          selectedVoucher.id
        );

        if (!updateResult) {
          throw new Error("Couldn't update the status");
        }

        setIsDeleting(false);
        toast({
          title: "Success!",
          description: "Driver is deleted",
        });
      } catch (error) {
        console.error("Couldn't delete this driver");
        setIsDeleting(false);
        toast({
          title: "Uh Oh!",
          description: "Couldn't delete the driver",
        });
      }
    }
    console.log("Driver Deleted");
    setStatusChanged(!statusChanged)
    // router.push(`${pathname}?tab=transport`)
    router.refresh()
  }

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
      phone: selectedVoucher?.driver?.contactNumber || selectedVoucher?.guide?.primaryContactNumber,
      email: selectedVoucher?.driver?.primaryEmail || selectedVoucher?.guide?.primaryEmail,
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
          <div className="text-sm font-normal">Click the line to send the voucher</div>
          <DataTable
            data={vouchers}
            columns={voucherColumns}
            onRowClick={onVoucherRowClick}
          />
          {/* <DataTableWithActions
            data={vouchers}
            columns={voucherColumns}
            onRowClick={onVoucherRowClick}
            onView={() => alert("View action triggered")}
            onEdit={() => alert("Edit action triggered")}
            onDelete={() => alert("Delete action triggered")}
          /> */}
          <div className="flex flex-row items-center justify-between">
            <div className="text-sm font-normal">
              {selectedVoucher
                ? `${selectedVoucher.driver?.name || selectedVoucher.guide?.name} - Voucher`
                : "Select a voucher from above table"}
            </div>

            {selectedVoucher && (
              <Popup
                title={"Log Sheet"}
                description="Please click on preview button to get the document"
                trigger={<Button variant={"primaryGreen"}>Log Sheet</Button>}
                onConfirm={handleConfirm}
                onCancel={() => console.log("Cancelled")}
                dialogContent={
                  <ProceedContent
                    voucherColumns={voucherColumns}
                    voucher={selectedVoucher}
                    setStatusChanged={setStatusChanged}
                  />
                }
                size="large"
              />
            )}
          </div>

          <DataTable
            columns={voucherColumns}
            data={selectedVoucher ? [selectedVoucher] : []}
            onRowClick={() => console.log("Row clicked")}
          />

          {/* <DataTableWithActions
            columns={voucherColumns}
            data={selectedVoucher ? [selectedVoucher] : []}
            onRowClick={() => console.log("Row clicked")}
            onView={() => alert("View action triggered")}
            onEdit={() => alert("Edit action triggered")}
            onDelete={() => alert("Delete action triggered")}
          /> */}
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
                    disabled={isDeleting}
                  >
                    {isDeleting ? (<div className="flex flex-row gap-2"><LoaderCircle size={16}/> <div>Deleting</div></div>): (<div>Delete</div>)}
                  </Button>

                  <Popup
                    title="Contact"
                    description="Loading Contact Details"
                    trigger={contactButton}
                    onConfirm={handleConfirm}
                    onCancel={() => console.log("Cancelled")}
                    dialogContent={ContactContent(
                      selectedVoucher?.driver?.primaryContactNumber ?? selectedVoucher?.guide?.primaryContactNumber ?? "N/A" ,
                      selectedVoucher?.driver?.primaryEmail ?? selectedVoucher?.guide?.primaryEmail ?? "N/A",
                    )}
                    size="small"
                  />
                  <Button
                    variant={"primaryGreen"}
                    onClick={handleConfirm}
                    disabled={isConfirming}
                  >
                    Confirm Driver
                  </Button>
                  <DeletePopup
                    itemName={`Voucher for ${selectedVoucher?.driver?.name}`}
                    onDelete={deleteVoucher}
                    isOpen={isInProgressVoucherDelete}
                    setIsOpen={setIsInProgressVoucherDelete}
                    isDeleting={isDeleting}
                    description="You haven't confirmed with the driver yet. You can delete the
                voucher straight away"
                  />
                  <DeletePopup
                    itemName={`Voucher for ${selectedVoucher?.driver?.name}`}
                    onDelete={deleteVoucher}
                    isOpen={isProceededVoucherDelete}
                    setIsOpen={setIsProceededVoucherDelete}
                    isDeleting={isDeleting}
                    description={`You have already proceeded with this driver/guide, and it's in the status of ${selectedVoucher.status} \n
                Are you sure you want to cancel this driver/guide? This will delete the driver from this booking`}
                  />
                </div>
              ) : (
                ""
              )}
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
  voucher: TransportVoucherData;
  setStatusChanged: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProceedContent: React.FC<ProceedContentProps> = ({
  voucherColumns,
  voucher,
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
      filename: `Activities_by_Date_${voucher.bookingLineId}.pdf`,
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
          Download PDF
        </Button>
      </div>
      <div ref={componentRef}>
      {voucher.driver?.type === 'driver' ? (
    <DriverTransportVoucherPDF voucher={voucher} />
  ) : (
    <GuideTransportVoucherPDF voucher={voucher} />
  )}
      </div>
      <div className="flex w-full flex-row justify-end gap-2"></div>
    </div>
  );
};
