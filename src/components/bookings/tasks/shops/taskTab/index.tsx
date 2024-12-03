"use client";
import { ColumnDef } from "@tanstack/react-table";
import html2pdf from "html2pdf.js";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { useOrganization, useUser } from "@clerk/nextjs";
import LoadingLayout from "~/components/common/dashboardLoading";
import { UserResource } from "@clerk/types";
import VoucherButton from "../../hotelsTaskTab/taskTab/VoucherButton";
import { BookingLineWithAllData } from "~/lib/types/booking";
import { getBookingLineWithAllData } from "~/server/db/queries/booking";

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
  const [bookingData, setBookingData] = useState<BookingLineWithAllData>();
  const [bookingLoading, setBookingLoading] = useState(false)


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

  const handleConfirm = async () => {
    if (selectedVoucher) {
      if (selectedVoucher.status == "vendorConfirmed") {
        toast({
          title: "Uh Oh!",
          description: "You have already confirmed",
        });
        return
      }

      try {
        setIsConfirming(true)
        const updateResult = await updateShopVoucherStatus(selectedVoucher.id, "vendorConfirmed");

        if (!updateResult) {
          throw new Error("Couldn't update the status")
        }

        setIsConfirming(false)
        toast({
          title: "Success!",
          description: "Shop is confirmed",
        });
      } catch (error) {
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
    setSelectedVoucher(vouchers ? vouchers[0] : undefined);

    const fetchBooking = async () => {
      if (vouchers) {
        try {
          setBookingLoading(true)
          const booking = await getBookingLineWithAllData(vouchers[0]?.bookingLineId ?? "")
          if (booking) {
            setBookingData(booking);
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
      phone: selectedVoucher.shop.contactNumber,
      email: selectedVoucher.shop.primaryEmail,
    };
  };
  const pathname = usePathname();

  if (bookingLoading) {
    return <LoadingLayout />;
  }


  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="flex w-full flex-row justify-center gap-3">
        <div>
          <Calendar />
        </div>
        <div className="card w-full space-y-6">
          <div className="flex justify-between">
            <div className="card-title">Voucher Information</div>
            <Link href={`${pathname.replace("/tasks", "")}/edit?tab=shops`}>
              <Button variant={"outline"}>Add Vouchers</Button>
            </Link>
          </div>          <div className="text-sm font-normal">Click the line to send the voucher</div>
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

            {bookingData && (
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
                    bookingData={bookingData}
                  />
                }
                size="large"
              />
            )}
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

interface ProceedContentProps {
  voucherColumns: any;
  vouchers: ShopVoucherData[];
  setStatusChanged: React.Dispatch<React.SetStateAction<boolean>>;
  bookingData: BookingLineWithAllData;
}

const ProceedContent: React.FC<ProceedContentProps> = ({
  voucherColumns,
  vouchers,
  setStatusChanged,
  bookingData
}) => {
  const VoucherLineColumnsWithRate = [...voucherColumns];

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
              <ShopVoucherPDF vouchers={vouchers} organization={organization} user={user as UserResource} bookingData={bookingData} />
            </div>
          } />

        )}
      </div>
      <div ref={componentRef}>
        {organization && user && (
          <ShopVoucherPDF vouchers={vouchers} organization={organization} user={user as UserResource} bookingData={bookingData} />
        )}
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
