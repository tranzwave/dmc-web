"use client";
import { ColumnDef } from "@tanstack/react-table";
import html2pdf from "html2pdf.js";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import DeletePopup from "~/components/common/deletePopup";
import DeleteReasonPopup from "~/components/common/deleteReasonPopup";
import CancellationReasonPopup from "~/components/common/deleteReasonPopup/cancellationReasonPopup";
import Popup from "~/components/common/popup";
import ContactContent from "~/components/common/tasksTab/contactContent";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { useToast } from "~/hooks/use-toast";
import { deleteActivitiesVoucher, getBookingLineWithAllData } from "~/server/db/queries/booking";
import { updateActivityVoucherStatus } from "~/server/db/queries/booking/activityVouchers";
import { ActivityVoucherData } from "..";
import ActivityVoucherPDF from "../voucherTemplate";
import { useOrganization, useUser } from "@clerk/nextjs";
import LoadingLayout from "~/components/common/dashboardLoading";
import { UserResource } from "@clerk/types";
import VoucherButton from "../../hotelsTaskTab/taskTab/VoucherButton";

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
  const [isVoucherDelete, setIsVoucherDelete] =
    useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [bookingName, setBookingName] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false)



  const { toast } = useToast();

  const onVoucherRowClick = (row: ActivityVoucherData) => {
    setSelectedVoucher(row);
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
      if (selectedVoucher.status === "cancelled") {
        toast({
          title: "Uh Oh!",
          description: "This voucher already cancelled",
        });
        return;
      }

      try {
        setIsConfirming(true);
        const updateResult = await updateActivityVoucherStatus(
          selectedVoucher.id,
          "vendorConfirmed",
        );

        if (!updateResult) {
          throw new Error("Couldn't update the status");
        }

        setIsConfirming(false);
        toast({
          title: "Success!",
          description: "Activity is confirmed",
        });
      } catch (error) {
        console.error("Couldn't confirm this activity");
        setIsConfirming(false);
        toast({
          title: "Uh Oh!",
          description: "Couldn't confirm the activity",
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
        if (selectedVoucher.status === "inprogress") {
          setIsInProgressVoucherDelete(true);
        }
        if (selectedVoucher.status === "vendorConfirmed") {
          setIsProceededVoucherDelete(true);
        }
        if (selectedVoucher.status === "cancelled") {
          setIsVoucherDelete(true);
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
    setSelectedVoucher(vouchers ? vouchers[0] : undefined);

    const fetchBooking = async () => {
      if (vouchers) {
        try {
          setBookingLoading(true)
          const booking = await getBookingLineWithAllData(vouchers[0]?.bookingLineId ?? "")
          if (booking) {
            setBookingName(booking.booking.client.name);
          }
          setBookingLoading(false)
        } catch (error) {
          console.error(error)
          setBookingLoading(false)
        }
      }

    }
    fetchBooking()
  }, [statusChanged, vouchers]);

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
  const pathname = usePathname();

  const handleInProgressVoucherDelete = async () => {
    if (selectedVoucher && selectedVoucher.status) {
      try {
        setIsDeleting(true);
        const deletedData = await deleteActivitiesVoucher(
          selectedVoucher?.id ?? "",
          "",
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

  const handleProceededVoucherDelete = async (reason: string) => {
    if (selectedVoucher && selectedVoucher.status) {
      try {
        setIsDeleting(true);
        const deletedData = await deleteActivitiesVoucher(
          selectedVoucher?.id ?? "",
          reason, // Pass the reason to the backend
        );
        if (!deletedData) {
          throw new Error("Couldn't delete voucher");
        }
        toast({
          title: "Success",
          description: `Successfully cancelled the confirmed voucher! Please refresh!`,
        });
        setIsDeleting(false);
      } catch (error) {
        toast({
          title: "Uh Oh",
          description: `Couldn't delete this voucher`,
        });
        setIsDeleting(false);
      }
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
              href={`${pathname.replace("/tasks", "")}/edit?tab=activities`}
            >
              <Button variant={"outline"}>Add Vouchers</Button>
            </Link>
          </div>
          <div className="text-sm font-normal">
            Click the line to send the voucher
          </div>
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
                ? `${selectedVoucher.activityVendor.name} - Voucher`
                : "Select a voucher from above table"}
            </div>

            <Popup
              title={"Activities by Date"}
              description="Please click on preview button to get the document"
              trigger={
                <Button variant={"primaryGreen"}>Activities by Dates</Button>
              }
              onConfirm={handleConfirm}
              onCancel={() => console.log("Cancelled")}
              dialogContent={
                <ProceedContent
                  voucherColumns={voucherColumns}
                  vouchers={vouchers}
                  setStatusChanged={setStatusChanged}
                  bookingName={bookingName}
                />
              }
              size="large"
            />
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
                    {isDeleting ? (
                      <div className="flex flex-row gap-2">
                        <LoaderCircle size={16} />{" "}
                        <div>
                          {selectedVoucher.status === "cancelled"
                            ? "Loading"
                            : "Cancelling"}
                        </div>
                      </div>
                    ) : (
                      <div>
                        {selectedVoucher.status === "cancelled"
                          ? "Reason"
                          : "Cancel"}
                      </div>
                    )}
                  </Button>

                  <Popup
                    title="Contact"
                    description="Loading Contact Details"
                    trigger={contactButton}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                    dialogContent={ContactContent(
                      selectedVoucher.activityVendor.contactNumber,
                      selectedVoucher.activityVendor.primaryEmail ?? "N/A",
                    )}
                    size="small"
                  />
                  <DeletePopup
                    itemName={`Voucher for ${selectedVoucher?.activityVendor.name}`}
                    onDelete={handleInProgressVoucherDelete}
                    isOpen={isInProgressVoucherDelete}
                    setIsOpen={setIsInProgressVoucherDelete}
                    isDeleting={isDeleting}
                    description="You haven't sent this to the vendor yet. You can delete the
                voucher without sending a cancellation voucher"
                  />
                  <DeleteReasonPopup
                    itemName={`Voucher for ${selectedVoucher?.activityVendor.name}`}
                    onDelete={handleProceededVoucherDelete}
                    isOpen={isProceededVoucherDelete}
                    setIsOpen={setIsProceededVoucherDelete}
                    isDeleting={isDeleting}
                    description={`You have already proceeded with this voucher, and it's in the status of ${selectedVoucher.status} \n
                Are you sure you want to cancel this voucher?`}
                  />

                  <CancellationReasonPopup
                    itemName={`Voucher for ${selectedVoucher?.activityVendor.name}`}
                    cancellationReason={
                      selectedVoucher?.reasonToDelete ?? "No reason provided. This is cancelled before confirm."
                    }
                    isOpen={isVoucherDelete}
                    setIsOpen={setIsVoucherDelete}
                  />
                </div>
              ) : (
                ""
              )}
              <Button
                variant={"primaryGreen"}
                onClick={handleConfirm}
                disabled={isConfirming}
              >
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
  bookingName: string;
}

const ProceedContent: React.FC<ProceedContentProps> = ({
  voucherColumns,
  vouchers,
  setStatusChanged,
  bookingName
}) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const { organization, isLoaded: isOrgLoaded } = useOrganization();
  const { isLoaded, user } = useUser();

  if (!isLoaded || !isOrgLoaded) {
    return (
      <LoadingLayout />
    )
  }

  return (
    <div className="mb-9 space-y-6">
      <div className="flex flex-row justify-end">
        {organization && user && (
          <VoucherButton voucherComponent={
            <div>
              <ActivityVoucherPDF vouchers={vouchers} bookingName={bookingName} organization={organization} user={user as UserResource} />
            </div>
          } />

        )}
      </div>
      <div ref={componentRef}>
        {organization && user && (
          <ActivityVoucherPDF vouchers={vouchers} bookingName={bookingName} organization={organization} user={user as UserResource} />
        )}
      </div>
      <div className="flex w-full flex-row justify-end gap-2"></div>
    </div>
  );
};
