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
  deleteOtherTransportVoucher,
  updateTransportVoucherStatus,
} from "~/server/db/queries/booking/transportVouchers";
import { TransportVoucherData } from "..";
import DriverTransportVoucherPDF from "../driverVoucherTemplate";
import GuideTransportVoucherPDF from "../guideVoucherTemplate";
import { BookingLineWithAllData } from "~/lib/types/booking";
import LoadingLayout from "~/components/common/dashboardLoading";
import { useOrganization, useUser } from "@clerk/nextjs";
import { UserResource } from "@clerk/types";
import VoucherButton from "../../hotelsTaskTab/taskTab/VoucherButton";
import TourExpenseTrigger from "../tourExpenseSheetTemplate/tourExpenseTrigger";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import OtherTransportTab from "~/components/bookings/editBooking/forms/transportForm/otherTransportTab";
import TransportTaskTabContent from "./commonContent";
import { TransportVoucher } from "~/app/dashboard/bookings/[id]/edit/context";

interface TasksTabProps {
  bookingLineId: string;
  bookingData: BookingLineWithAllData;
  voucherColumns: ColumnDef<TransportVoucher>[];
  selectedVoucherColumns: ColumnDef<TransportVoucher>[];
  vouchers: TransportVoucher[];
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
  bookingData,
  voucherColumns,
  selectedVoucherColumns,
  vouchers,
  updateVoucherLine,
  setStatusChanged,
  statusChanged,
}: TasksTabProps) => {
  const [selectedVoucher, setSelectedVoucher] =
    useState<TransportVoucher | null>(null);
  const [rate, setRate] = useState<string | number>(0);

  const [isInProgressVoucherDelete, setIsInProgressVoucherDelete] =
    useState(false);
  const [isProceededVoucherDelete, setIsProceededVoucherDelete] =
    useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isVoucherDelete, setIsVoucherDelete] = useState(false);

  const [bookingLoading, setBookingLoading] = useState(false)
  // const [bookingData, setBookingData] = useState<BookingLineWithAllData | null>(null);



  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  const onVoucherRowClick = (row: TransportVoucher) => {
    if (row.voucher.status === "cancelled") {
      setSelectedVoucher(null);
      return;
    }
    setSelectedVoucher(row);
  };

  const handleConfirm = async () => {
    if (selectedVoucher) {
      if (selectedVoucher.voucher.status === "vendorConfirmed") {
        toast({
          title: "Uh Oh!",
          description: "You have already confirmed",
        });
        return;
      }

      try {
        setIsConfirming(true);
        const updateResult = await updateTransportVoucherStatus(
          selectedVoucher.voucher.id ?? "",
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
      if (selectedVoucher.voucher.status) {
        if (selectedVoucher.voucher.status === "inprogress") {
          setIsInProgressVoucherDelete(true);
        }
        if (selectedVoucher.voucher.status === "vendorConfirmed") {
          setIsProceededVoucherDelete(true);
        }
        if (selectedVoucher.voucher.status === "cancelled") {
          setIsVoucherDelete(true);
        }
      }
    }
  };

  const handleInProgressVoucherDelete = async () => {
    if (selectedVoucher) {
      try {
        setIsDeleting(true);
        let deletedData = null
        if (selectedVoucher.driver) {
          deletedData = await deleteDriverTransportVoucher(
            selectedVoucher?.voucher.id ?? "",
            "",
          );
        } else if (selectedVoucher.guide) {
          deletedData = await deleteGuideTransportVoucher(
            selectedVoucher?.voucher.id ?? "",
            "",
          );
        } else if (selectedVoucher.otherTransport) {
          deletedData = await deleteOtherTransportVoucher(
            selectedVoucher?.voucher.id ?? "",
            "",
          );
        }
        if (!deletedData) {
          throw new Error("Couldn't delete voucher");
        }
        toast({
          title: "Success",
          description: `Successfully cancelled the voucher! Pleas refresh!`,
        });

        window.location.reload();

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
    else {
      toast({
        title: "Uh Oh",
        description: `Please select a valid voucher`,
      });
      setIsDeleting(false);
    }
  };

  const handleProceededVoucherDelete = async (reason: string) => {
    if (selectedVoucher && selectedVoucher.voucher.id) {
      console.log("Deleting voucher:", selectedVoucher);
      try {
        setIsDeleting(true);
        let deletedData = null
        if (selectedVoucher.driver) {
          deletedData = await deleteDriverTransportVoucher(
            selectedVoucher?.voucher.id ?? "",
            reason,
          );
        } else if (selectedVoucher.guide) {
          deletedData = await deleteGuideTransportVoucher(
            selectedVoucher?.voucher.id ?? "",
            reason,
          );
        } else if (selectedVoucher.otherTransport) {
          deletedData = await deleteOtherTransportVoucher(
            selectedVoucher?.voucher.id ?? "",
            reason,
          );
        }
        if (!deletedData) {
          throw new Error("Couldn't delete voucher");
        }
        toast({
          title: "Success",
          description: `Successfully cancelled the voucher! Pleas refresh!`,
        });

        window.location.reload();
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
    else {
      toast({
        title: "Uh Oh",
        description: `Please select a valid voucher`,
      });
      setIsDeleting(false);
    }
  };

  const contactButton = (
    <Button variant={"outline"} className="border-primary-green">
      Contact
    </Button>
  );

  useEffect(() => {
    setSelectedVoucher(vouchers ? vouchers[0] ?? null : null);
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
            <TransportTaskTabContent
              pathname={pathname}
              vouchers={vouchers}
              voucherColumns={voucherColumns}
              onVoucherRowClick={onVoucherRowClick}
              selectedVoucher={selectedVoucher}
              isInProgressVoucherDelete={isInProgressVoucherDelete}
              setIsInProgressVoucherDelete={setIsInProgressVoucherDelete}
              isProceededVoucherDelete={isProceededVoucherDelete}
              setIsProceededVoucherDelete={setIsProceededVoucherDelete}
              isDeleting={isDeleting}
              isConfirming={isConfirming}
              isVoucherDelete={isVoucherDelete}
              setIsVoucherDelete={setIsVoucherDelete}
              handleConfirm={handleConfirm}
              renderCancelContent={renderCancelContent}
              handleInProgressVoucherDelete={handleInProgressVoucherDelete}
              handleProceededVoucherDelete={handleProceededVoucherDelete}
              contactButton={contactButton}
              bookingData={bookingData}
              setStatusChanged={setStatusChanged}
              key={selectedVoucher?.voucher.id}
              activeTab="driverAndGuide"
            />
          </TabsContent>
          <TabsContent value="otherTransport" className="w-full px-0">
            <TransportTaskTabContent
              pathname={pathname}
              vouchers={vouchers}
              voucherColumns={voucherColumns}
              onVoucherRowClick={onVoucherRowClick}
              selectedVoucher={selectedVoucher}
              isInProgressVoucherDelete={isInProgressVoucherDelete}
              setIsInProgressVoucherDelete={setIsInProgressVoucherDelete}
              isProceededVoucherDelete={isProceededVoucherDelete}
              setIsProceededVoucherDelete={setIsProceededVoucherDelete}
              isDeleting={isDeleting}
              isConfirming={isConfirming}
              isVoucherDelete={isVoucherDelete}
              setIsVoucherDelete={setIsVoucherDelete}
              handleConfirm={handleConfirm}
              renderCancelContent={renderCancelContent}
              handleInProgressVoucherDelete={handleInProgressVoucherDelete}
              handleProceededVoucherDelete={handleProceededVoucherDelete}
              contactButton={contactButton}
              bookingData={bookingData}
              setStatusChanged={setStatusChanged}
              key={selectedVoucher?.voucher.id}
              activeTab="otherTransport"
            />
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
};

export default TransportVouchersTab;

interface ProceedContentProps {
  voucherColumns: any;
  voucher: TransportVoucher;
  setStatusChanged: React.Dispatch<React.SetStateAction<boolean>>;
  bookingData: BookingLineWithAllData;
  type?: string
}

export const ProceedContent: React.FC<ProceedContentProps> = ({
  voucherColumns,
  voucher,
  setStatusChanged,
  bookingData,
  type
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
        {type === "driver" && (
          <VoucherButton voucherComponent={
            <div>
              {voucher.driver && organization && user ? (
                <DriverTransportVoucherPDF voucher={voucher} bookingData={bookingData} organization={organization} user={user as UserResource} />
              ) : null}
            </div>
          } />
        )}
        {type === "guide" && (
          <VoucherButton voucherComponent={
            <div>
              {(voucher.guide ?? (voucher.driver && voucher.driver.type === "Chauffeur")) && organization && user ? (
                <GuideTransportVoucherPDF voucher={voucher} bookingData={bookingData} organization={organization} user={user as UserResource} />
              ) : null}
            </div>
          } />
        )}

      </div>
      <div ref={componentRef}>
        {type === "driver" && organization && user && (
          <div>
            {
            voucher.driver && organization && user ? (
              <DriverTransportVoucherPDF voucher={voucher} bookingData={bookingData} organization={organization} user={user as UserResource} />
            ) : null
          }
          </div>
        )}
        {type === "guide" && organization && user && (
          <div>
            {
            (voucher.guide ?? (voucher.driver && voucher.driver.type === "Chauffer")) && organization && user ? (
              <GuideTransportVoucherPDF voucher={voucher} bookingData={bookingData} organization={organization} user={user as UserResource} />
            ) : null
          }
          </div>
        )}
        {/* {voucher.driver?.id !== null && organization && user ? (
          <DriverTransportVoucherPDF voucher={voucher} bookingData={bookingData} organization={organization} user={user as UserResource} />
        ) : organization && user ? (
          <GuideTransportVoucherPDF voucher={voucher} bookingData={bookingData} organization={organization} user={user as UserResource} />
        ) : ''} */}
      </div>
      <div className="flex w-full flex-row justify-end gap-2"></div>
    </div>
  );
};
