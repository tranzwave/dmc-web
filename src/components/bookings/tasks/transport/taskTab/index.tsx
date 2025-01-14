"use client";
import { ColumnDef } from "@tanstack/react-table";
import html2pdf from "html2pdf.js";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import {
  deleteDriverTransportVoucher,
  deleteGuideTransportVoucher,
  updateTransportVoucherStatus,
} from "~/server/db/queries/booking/transportVouchers";
import { TransportVoucherData } from "..";
import DriverTransportVoucherPDF from "../driverVoucherTemplate";
import GuideTransportVoucherPDF from "../guideVoucherTemplate";
import { getBookingLineWithAllData } from "~/server/db/queries/booking";
import { BookingLineWithAllData } from "~/lib/types/booking";
import LoadingLayout from "~/components/common/dashboardLoading";
import { useOrganization, useUser } from "@clerk/nextjs";
import { UserResource } from "@clerk/types";
import VoucherButton from "../../hotelsTaskTab/taskTab/VoucherButton";
import TourExpenseTrigger from "../tourExpenseSheetTemplate/tourExpenseTrigger";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import OtherTransportTab from "~/components/bookings/editBooking/forms/transportForm/otherTransportTab";

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
  statusChanged: boolean;
  contactDetails?: { phone: string; email: string };
  // columns: ColumnDef<ActivityVoucherData>[]; // Ensure to use the correct type
}

const TransportVouchersTab = ({
  bookingLineId,
  voucherColumns,
  selectedVoucherColumns,
  vouchers,
  updateVoucherLine,
  setStatusChanged,
  statusChanged,
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
  const [isVoucherDelete, setIsVoucherDelete] = useState(false);

  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingData, setBookingData] = useState<BookingLineWithAllData>();



  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  const onVoucherRowClick = (row: TransportVoucherData) => {
    setSelectedVoucher(row);
    console.log(selectedVoucher);
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
    setStatusChanged(!statusChanged);
    router.push(`${pathname}?tab=transport`);
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

  const handleInProgressVoucherDelete = async () => {
    if (selectedVoucher?.guideId === null && selectedVoucher.status) {
      try {
        setIsDeleting(true);
        const deletedData = await deleteDriverTransportVoucher(
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
    } else if (selectedVoucher?.driverId === null && selectedVoucher.status) {
      try {
        setIsDeleting(true);
        const deletedData = await deleteGuideTransportVoucher(
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
    if (selectedVoucher?.guideId === null && selectedVoucher.status) {
      try {
        setIsDeleting(true);
        const deletedData = await deleteDriverTransportVoucher(
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
    } else if (selectedVoucher?.driverId === null && selectedVoucher.status) {
      try {
        setIsDeleting(true);
        const deletedData = await deleteGuideTransportVoucher(
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
      phone:
        selectedVoucher?.driver?.contactNumber ??
        selectedVoucher?.guide?.primaryContactNumber,
      email:
        selectedVoucher?.driver?.primaryEmail ??
        selectedVoucher?.guide?.primaryEmail,
    };
  };

  if (bookingLoading) {
    return <LoadingLayout />;
  }

  return (
    //Shadcn tabs Component
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="flex w-full flex-row justify-center gap-3">
        <div>
          <Calendar />
        </div>
        <Tabs defaultValue="driverAndGuide" className="w-full">
          <TabsList className="w-[30%]">
            <TabsTrigger value="driverAndGuide" className="rounded-l-md">Drivers & Guides</TabsTrigger>
            <TabsTrigger value="otherTransport" className="rounded-r-md">Other Transports</TabsTrigger>
          </TabsList>
          <TabsContent value="driverAndGuide" className="w-full px-0">
              <div className="card w-full space-y-6">
                <div className="flex justify-between">
                  <div className="card-title">Voucher Information</div>
                  <Link href={`${pathname.replace("/tasks", "")}/edit?tab=transport`}>
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
                <div className="flex flex-row items-center justify-between">
                  <div className="text-sm font-normal">
                    {selectedVoucher
                      ? `${selectedVoucher.driver?.name ?? selectedVoucher.guide?.name} - Voucher`
                      : "Select a voucher from above table"}
                  </div>

                  {selectedVoucher && bookingData && (
                    <div className="flex flex-row gap-2">
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
                            bookingData={bookingData}
                          />
                        }
                        size="large"
                      />

                      <TourExpenseTrigger
                        bookingData={bookingData}
                      />
                    </div>
                  )}
                </div>

                <DataTable
                  columns={voucherColumns}
                  data={selectedVoucher ? [selectedVoucher] : []}
                  onRowClick={() => console.log("Row clicked")}
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
                          onCancel={() => console.log("Cancelled")}
                          dialogContent={ContactContent(
                            selectedVoucher?.driver?.primaryContactNumber ??
                            selectedVoucher?.guide?.primaryContactNumber ??
                            "N/A",
                            selectedVoucher?.driver?.primaryEmail ??
                            selectedVoucher?.guide?.primaryEmail ??
                            "N/A",
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
                          onDelete={handleInProgressVoucherDelete}
                          isOpen={isInProgressVoucherDelete}
                          setIsOpen={setIsInProgressVoucherDelete}
                          isDeleting={isDeleting}
                          description="You haven't confirmed with the driver yet. You can delete the
                voucher straight away"
                        />
                        <DeleteReasonPopup
                          itemName={`Voucher for ${selectedVoucher?.driver?.name}`}
                          onDelete={handleProceededVoucherDelete}
                          isOpen={isProceededVoucherDelete}
                          setIsOpen={setIsProceededVoucherDelete}
                          isDeleting={isDeleting}
                          description={`You have already proceeded with this driver/guide, and it's in the status of ${selectedVoucher.status} \n
                Are you sure you want to cancel this driver/guide? This will delete the driver from this booking`}
                        />

                        <CancellationReasonPopup
                          itemName={`Voucher for ${selectedVoucher?.driver?.name ?? selectedVoucher?.guide?.name}`}
                          cancellationReason={
                            selectedVoucher?.reasonToDelete ??
                            "No reason provided. This is cancelled before confirm."
                          }
                          isOpen={isVoucherDelete}
                          setIsOpen={setIsVoucherDelete}
                        />
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
          </TabsContent>
          <TabsContent value="otherTransport">
            <div>
              
            </div>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
};

export default TransportVouchersTab;

interface ProceedContentProps {
  voucherColumns: any;
  voucher: TransportVoucherData;
  setStatusChanged: React.Dispatch<React.SetStateAction<boolean>>;
  bookingData: BookingLineWithAllData;
}

const ProceedContent: React.FC<ProceedContentProps> = ({
  voucherColumns,
  voucher,
  setStatusChanged,
  bookingData
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
        <VoucherButton voucherComponent={
          <div>
            {voucher.driverId !== null && organization && user ? (
              <DriverTransportVoucherPDF voucher={voucher} bookingData={bookingData} organization={organization} user={user as UserResource} />
            ) : organization && user ? (
              <GuideTransportVoucherPDF voucher={voucher} bookingData={bookingData} organization={organization} user={user as UserResource} />
            ) : ''}
          </div>
        } />
      </div>
      <div ref={componentRef}>
        {voucher.driverId !== null && organization && user ? (
          <DriverTransportVoucherPDF voucher={voucher} bookingData={bookingData} organization={organization} user={user as UserResource} />
        ) : organization && user ? (
          <GuideTransportVoucherPDF voucher={voucher} bookingData={bookingData} organization={organization} user={user as UserResource} />
        ) : ''}
      </div>
      <div className="flex w-full flex-row justify-end gap-2"></div>
    </div>
  );
};
