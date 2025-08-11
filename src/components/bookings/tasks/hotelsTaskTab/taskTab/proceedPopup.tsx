import { AccessorFnColumnDef, ColumnDef } from "@tanstack/react-table";
import { SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import HotelVoucherView from "../voucherTemplate/viewableHotelVoucher";
import html2pdf from "html2pdf.js";
import { HotelVoucherData } from "..";
import { useRouter } from "next/navigation";
import { SelectHotelVoucherLine, SelectRestaurantVoucherLine } from "~/server/db/schemaTypes";
import CreateRateColumn from "~/components/common/tasksTab/rateColumn";
import { RestaurantVoucherData } from "../../restaurants";
import RestaurantVoucherView from "../../restaurants/voucherTemplate/viewableRestaurantVoucher";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from 'pdfmake/build/pdfmake';
import { PDFDownloadLink } from "@react-pdf/renderer";
import HotelVoucherDownloadablePDF from "../voucherTemplate/downloadableHotelVoucher";
import LoadingLayout from "~/components/common/dashboardLoading";
import { useOrganization, useUser } from "@clerk/nextjs";
import RestaurantVoucherDownloadablePDF from "../../restaurants/voucherTemplate/downloadableRestaurantVoucher";
import VoucherButton from "./VoucherButton";
import { UserResource } from "@clerk/types";
import { set } from "date-fns";
import { toast } from "~/hooks/use-toast";

interface ProceedContentProps {
  voucherColumns: ColumnDef<SelectHotelVoucherLine>[] | ColumnDef<SelectRestaurantVoucherLine>[];
  selectedVoucher: HotelVoucherData | RestaurantVoucherData;
  onVoucherLineRowClick: any;
  updateVoucherLine: (
    ratesMap: Map<string, string>,
    voucherId: string,
    confirmationDetails?: {
      availabilityConfirmedBy: string;
      availabilityConfirmedTo: string;
      ratesConfirmedBy: string;
      ratesConfirmedTo: string;
      specialNote: string;
      billingInstructions: string;
    },
  ) => Promise<void>;
  updateVoucherStatus: any;
  rate: string;
  setRate: React.Dispatch<SetStateAction<string>>;
  setStatusChanged: React.Dispatch<React.SetStateAction<boolean>>;
  type: string
  bookingName: string
  currency: string
  viewCancellationVoucher?: boolean
  onVoucherUpdate?: (updatedVoucher: HotelVoucherData | RestaurantVoucherData) => void
}

const ProceedContent: React.FC<ProceedContentProps> = ({
  voucherColumns,
  selectedVoucher: voucher,
  onVoucherLineRowClick,
  updateVoucherLine,
  updateVoucherStatus,
  rate,
  setRate,
  setStatusChanged,
  type,
  viewCancellationVoucher,
  currency,
  bookingName,
  onVoucherUpdate
}) => {
  // pdfMake.vfs = (pdfFonts as any).vfs || pdfFonts.pdfMake?.vfs;
  const router = useRouter();
  const componentRef = useRef<HTMLDivElement>(null);

  const [selectedVoucher, setSelectedVoucher] = useState<HotelVoucherData | RestaurantVoucherData>(voucher);

  const [ratesConfirmedBy, setRatesConfirmedBy] = useState(selectedVoucher?.ratesConfirmedBy ?? "");
  const [ratesConfirmedTo, setRatesConfirmedTo] = useState(selectedVoucher?.ratesConfirmedTo ?? "");
  const [availabilityConfirmedBy, setAvailabilityConfirmedBy] = useState(selectedVoucher?.availabilityConfirmedBy ?? "");
  const [availabilityConfirmedTo, setAvailabilityConfirmedTo] = useState(selectedVoucher?.availabilityConfirmedTo ?? "");
  const [specialNote, setSpecialNote] = useState(selectedVoucher?.specialNote ?? "")
  const [billingInstructions, setBillingInstructions] = useState(selectedVoucher?.billingInstructions ?? "")
  const [voucherTitle, setVoucherTitle] = useState("");
  const [ratesMap, setRatesMap] = useState<Map<string, string>>(new Map(
    selectedVoucher.voucherLines.map((voucherLine) => [
      voucherLine.id, 
      voucherLine.rate ?? "0",
    ])
  ));
  const [isRateUpdating, setIsRateUpdating] = useState(false);

  const handleRateChange = (id: string, rate: string) => {
    setRatesMap((prev) => {
      const newMap = new Map(prev);
      newMap.set(id, rate);
      return newMap;
    });
  };

  const updatedVoucherLines = selectedVoucher.voucherLines.map((voucherLine) => ({
    ...voucherLine,
    rate: ratesMap.get(voucherLine.id) ?? voucherLine.rate, // Get the latest rate
  }));
  
  

  const VoucherLineColumnsWithRate = [...voucherColumns, CreateRateColumn({ handleRateChange: handleRateChange, currency })]

  const { organization, isLoaded: isOrgLoaded } = useOrganization();
  const { isLoaded, user } = useUser();

  const areAllFieldsFilled = () =>
    [ratesConfirmedBy, ratesConfirmedTo, availabilityConfirmedBy, availabilityConfirmedTo].every((field) => field.trim() !== "");

  const handleSubmit = async () => {
    if (!areAllFieldsFilled()) {
      toast({
        title: "Validation Error",
        description: "Please fill all the required fields.",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsRateUpdating(true);
      console.log({ rates: ratesMap, confirmedBy: availabilityConfirmedBy, confirmedTo: availabilityConfirmedTo })
      await updateVoucherLine(ratesMap, selectedVoucher.id, {
        availabilityConfirmedBy,
        availabilityConfirmedTo,
        ratesConfirmedBy,
        ratesConfirmedTo,
        specialNote,
        billingInstructions
      });



      const updatedVoucherLines = selectedVoucher.voucherLines.map((voucherLine) => ({
        ...voucherLine,
        rate: ratesMap.get(voucherLine.id) ?? voucherLine.rate, // Get the latest rate
      }));

      const updatedVoucher = {
        ...selectedVoucher,
        ratesConfirmedBy,
        ratesConfirmedTo,
        availabilityConfirmedBy,
        availabilityConfirmedTo,
        specialNote,
        billingInstructions,
        voucherLines: updatedVoucherLines as any
      };

      setSelectedVoucher(updatedVoucher);
      
      // Notify parent component about the update
      if (onVoucherUpdate) {
        onVoucherUpdate(updatedVoucher);
      }
      
      setIsRateUpdating(false);

      toast({
        title: "Voucher rates updated successfully",
        description: "The voucher rates have been updated successfully.",
      })

    } catch (error) {
      console.error("Failed to update voucher line:", error);
      toast({
        title: "Failed to update voucher rates",
        description: "An error occurred while updating the voucher rates.",
      })
      setIsRateUpdating(false);
    }
  };

  const handleSendVoucher = async () => {
    if (selectedVoucher?.status === "sentToVendor") {
      toast({
        title: "Voucher already sent",
        description: "The voucher has already been sent to the vendor.",
      })
    } else if (selectedVoucher?.status === "cancelled") {
      toast({
        title: "Voucher already cancelled",
        description: "The voucher has been cancelled.",
      })
    } else if (selectedVoucher?.status === "inprogress" || selectedVoucher?.status === "amended") {
      try {
        selectedVoucher.status = "sentToVendor";
        setStatusChanged(true);
        await updateVoucherStatus(selectedVoucher);
        toast({
          title: "Voucher status updated",
          description: "The voucher status has been updated successfully as sentToVendor.",
        })
      } catch (error) {
        console.error("Failed to update voucher status:", error);
        toast({
          title: "Failed to update voucher status",
          description: "An error occurred while updating the voucher status.",
        })
      }
    }
  };

  useEffect(() => {
    console.log("rerendered here")
    console.log(selectedVoucher)
    //if selected voucher is in typeof HotelVoucherData then set the voucher title to the hotel name
    if (selectedVoucher && type === 'hotel') {
      const titleCombined = `${(selectedVoucher as HotelVoucherData).hotel.name}-${bookingName}-${selectedVoucher.id}`
      setVoucherTitle(titleCombined)
    } else if (selectedVoucher && type === 'restaurant') {
      const titleCombined = `${(selectedVoucher as RestaurantVoucherData).restaurant.name}-${bookingName}-${selectedVoucher.id}`
      setVoucherTitle(titleCombined)
    }
  }, [])


  if (!isLoaded || !organization || !user || !isOrgLoaded) {
    return <LoadingLayout />;
  }

  const orgData = {
    name: organization.name ?? "Unknown",
    address: organization.publicMetadata.address as string ?? "Address",
    contactNumber: organization.publicMetadata.contactNumber as string ?? "Number",
    website: organization.publicMetadata.website as string ?? "Website"
  }

  return (
    <div className="mb-9 space-y-6">
      {!viewCancellationVoucher && (
        <>
          <div className="flex flex-col gap-4 p-4">
            {/* <DataTable
              columns={VoucherLineColumnsWithRate as ColumnDef<object, unknown>[]}
              data={selectedVoucher ? (selectedVoucher.voucherLines ?? [selectedVoucher]) : []}
            /> */}
              <DataTable
                columns={VoucherLineColumnsWithRate as ColumnDef<object, unknown>[]}
                data={updatedVoucherLines}
              />

            <div className="grid grid-cols-4 gap-2">
              <InputFields label="Availability confirmed by" value={availabilityConfirmedBy} onChange={setAvailabilityConfirmedBy} />
              <InputFields label="Availability confirmed to" value={availabilityConfirmedTo} onChange={setAvailabilityConfirmedTo} />
              <InputFields label="Rates confirmed by" value={ratesConfirmedBy} onChange={setRatesConfirmedBy} />
              <InputFields label="Rates confirmed to" value={ratesConfirmedTo} onChange={setRatesConfirmedTo} />
            </div>
            <InputFields label="Other Instructions" value={specialNote} onChange={setSpecialNote} />
            <InputFields label="Billing Instructions" value={billingInstructions} onChange={setBillingInstructions} />
          </div>

          <div className="flex w-full flex-row justify-end gap-2">
            <Button variant="primaryGreen" onClick={handleSubmit}>Save Voucher Rates</Button>
          </div>
        </>
      )}
      <div className="text-[10px] text-gray-500 my-0">
        You can change the currency by clicking on the "Currency Settings" button in the top right corner of the page.
      </div>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="w-full justify-end">
            <div className="text-sm font-normal text-neutral-900">Preview Voucher</div>
          </AccordionTrigger>
          <AccordionContent className="space-y-2">
            <div className="flex flex-row justify-end" onClick={handleSendVoucher}>
              {type === 'hotel' && user && (
                <VoucherButton voucherComponent={
                  <div>
                    <HotelVoucherView voucher={selectedVoucher as HotelVoucherData} bookingName={bookingName} organization={organization} user={user as UserResource} currency={currency}/>
                  </div>
                } title={voucherTitle} />
              )}

              {type === 'restaurant' && (
                <VoucherButton voucherComponent={
                  <div>
                    <RestaurantVoucherView voucher={selectedVoucher as RestaurantVoucherData} bookingName={bookingName} organization={organization} user={user as UserResource} currency={currency} />
                  </div>
                } title={voucherTitle} />
              )}

            </div>
            <div ref={componentRef} id="voucher-content">
              {type === 'hotel' && (
                <>
                  {viewCancellationVoucher ? (<div>
                    <div>
                      <HotelVoucherView voucher={selectedVoucher as HotelVoucherData} cancellation={true} bookingName={bookingName} organization={organization} user={user as UserResource} currency={currency} />

                    </div>
                  </div>) : (<div>
                    <div>
                      <HotelVoucherView voucher={selectedVoucher as HotelVoucherData} cancellation={false} bookingName={bookingName} organization={organization} user={user as UserResource} currency={currency} />

                    </div>
                  </div>)}

                </>

              )}
              {type === 'restaurant' && (
                <>
                  {viewCancellationVoucher ? (<div>
                    <div>
                      <RestaurantVoucherView voucher={selectedVoucher as RestaurantVoucherData} cancellation={true} bookingName={bookingName} organization={organization} user={user as UserResource} currency={currency} />
                    </div>
                  </div>) : (<div>
                    <div>
                      <RestaurantVoucherView voucher={selectedVoucher as RestaurantVoucherData} bookingName={bookingName} organization={organization} user={user as UserResource} currency={currency} />
                    </div>
                  </div>)}

                </>

              )}

            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

const InputFields = ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) => (
  <div>
    <div className="text-[13px] text-neutral-900">{label}</div>
    <Input placeholder={label} value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);

export default ProceedContent;
