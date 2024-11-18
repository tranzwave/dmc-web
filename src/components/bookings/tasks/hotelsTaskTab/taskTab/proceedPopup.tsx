import { AccessorFnColumnDef, ColumnDef } from "@tanstack/react-table";
import { SetStateAction, useEffect, useRef, useState } from "react";
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
import { useUser } from "@clerk/nextjs";
import { useOrganization } from "~/app/dashboard/context";
import RestaurantVoucherDownloadablePDF from "../../restaurants/voucherTemplate/downloadableRestaurantVoucher";

interface ProceedContentProps {
  voucherColumns: ColumnDef<SelectHotelVoucherLine>[] | ColumnDef<SelectRestaurantVoucherLine>[];
  selectedVoucher: HotelVoucherData | RestaurantVoucherData;
  onVoucherLineRowClick: any;
  updateVoucherLine: any;
  updateVoucherStatus: any;
  rate: string;
  setRate: React.Dispatch<SetStateAction<string>>;
  setStatusChanged: React.Dispatch<React.SetStateAction<boolean>>;
  type: string
  bookingName:string
  viewCancellationVoucher?: boolean
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
  type,
  viewCancellationVoucher,
  bookingName
}) => {
  // pdfMake.vfs = (pdfFonts as any).vfs || pdfFonts.pdfMake?.vfs;
  const router = useRouter();
  const componentRef = useRef<HTMLDivElement>(null);

  const [ratesConfirmedBy, setRatesConfirmedBy] = useState(selectedVoucher?.ratesConfirmedBy ?? "");
  const [ratesConfirmedTo, setRatesConfirmedTo] = useState(selectedVoucher?.ratesConfirmedTo ?? "");
  const [availabilityConfirmedBy, setAvailabilityConfirmedBy] = useState(selectedVoucher?.availabilityConfirmedBy ?? "");
  const [availabilityConfirmedTo, setAvailabilityConfirmedTo] = useState(selectedVoucher?.availabilityConfirmedTo ?? "");

  const VoucherLineColumnsWithRate = [...voucherColumns, CreateRateColumn(rate, setRate)];

  const organization = useOrganization();
  const { isLoaded, user } = useUser();

  // const downloadPDF = () => {
  //   const filename = `${selectedVoucher.voucherLines[0]?.id}-Voucher.pdf`;
  //   const tempContainer = document.createElement("div");

  //   const componentElement = componentRef.current?.cloneNode(true);
  //   if (componentElement) tempContainer.appendChild(componentElement);

  //   tempContainer.style.width = "210mm";
  //   tempContainer.style.padding = "10mm";
  //   tempContainer.style.backgroundColor = "white";

  //   document.body.appendChild(tempContainer);
  //   const options = {
  //     filename,
  //     jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
  //     margin: [0, 0],
  //   };

  //   html2pdf().set(options).from(tempContainer).save().then(() => {
  //     document.body.removeChild(tempContainer);
  //   });
  // };

  const downloadPDF = () => {
    const voucherElement = document.getElementById("voucher-content"); // Target the voucher content
    if (!voucherElement) {
      console.log("no component")
      return
    };

    const html = voucherElement.innerHTML;
    const pdfContent = htmlToPdfmake(html);

    // Define the PDF document
    const documentDefinition = {
      content: pdfContent,
      pageSize: "A4",
      pageMargins: [40, 60, 40, 60], // left, top, right, bottom
    };

    // Generate and download the PDF
    pdfMake.createPdf(documentDefinition).download("voucher.pdf");
  }

  const areAllFieldsFilled = () =>
    [ratesConfirmedBy, ratesConfirmedTo, availabilityConfirmedBy, availabilityConfirmedTo].every((field) => field.trim() !== "");

  const handleSubmit = async () => {
    if (!areAllFieldsFilled()) {
      alert("Please fill all the required fields.");
      return;
    }

    try {
      await updateVoucherLine(selectedVoucher?.voucherLines ?? [selectedVoucher], {
        availabilityConfirmedBy,
        availabilityConfirmedTo,
        ratesConfirmedBy,
        ratesConfirmedTo,
      });
      alert("Voucher line updated successfully!");
    } catch (error) {
      console.error("Failed to update voucher line:", error);
      alert("An error occurred while updating the voucher line.");
    }
  };

  const handleSendVoucher = async () => {
    if (selectedVoucher?.status === "sentToVendor") {
      alert("You've already downloaded the voucher.");
    } else {
      try {
        selectedVoucher.status = "sentToVendor";
        setStatusChanged(true);
        await updateVoucherStatus(selectedVoucher);
        alert("Voucher status updated successfully");
      } catch (error) {
        console.error("Failed to update voucher status:", error);
      }
    }


  };


  if (!isLoaded || !organization) {
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
            <DataTable
              columns={VoucherLineColumnsWithRate as ColumnDef<object, unknown>[]}
              data={selectedVoucher ? (selectedVoucher.voucherLines ?? [selectedVoucher]) : []}
            />

            <div className="grid grid-cols-4 gap-2">
              <InputFields label="Availability confirmed by" value={availabilityConfirmedBy} onChange={setAvailabilityConfirmedBy} />
              <InputFields label="Availability confirmed to" value={availabilityConfirmedTo} onChange={setAvailabilityConfirmedTo} />
              <InputFields label="Rates confirmed by" value={ratesConfirmedBy} onChange={setRatesConfirmedBy} />
              <InputFields label="Rates confirmed to" value={ratesConfirmedTo} onChange={setRatesConfirmedTo} />
            </div>
          </div>

          <div className="flex w-full flex-row justify-end gap-2">
            <Button variant="primaryGreen" onClick={handleSubmit}>Save Voucher Rates</Button>
          </div>
        </>
      )}
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="w-full justify-end">
            <div className="text-sm font-normal text-neutral-900">Preview Voucher</div>
          </AccordionTrigger>
          <AccordionContent className="space-y-2">
            <div className="flex flex-row justify-end" onClick={handleSendVoucher}>
              {type === 'hotel' && (
                <PDFDownloadLink
                  document={<HotelVoucherDownloadablePDF voucher={selectedVoucher as HotelVoucherData} organization={orgData} user={user} />}
                  fileName={`${selectedVoucher.voucherLines[0]?.id}-${(selectedVoucher as HotelVoucherData).hotel.name}-Voucher.pdf`}
                  style={{
                    textDecoration: "none",
                    padding: "10px 20px",
                    backgroundColor: "#287F71",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Download Voucher as PDF
                </PDFDownloadLink>
              )}

              {type === 'restaurant' && (
                <PDFDownloadLink
                  document={<RestaurantVoucherDownloadablePDF voucher={selectedVoucher as RestaurantVoucherData} organization={orgData} user={user} />}
                  fileName={`${selectedVoucher.voucherLines[0]?.id}-${(selectedVoucher as RestaurantVoucherData).restaurant.name}-Voucher.pdf`}
                  style={{
                    textDecoration: "none",
                    padding: "10px 20px",
                    backgroundColor: "#287F71",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Download Voucher as PDF
                </PDFDownloadLink>
              )}

            </div>
            <div ref={componentRef} id="voucher-content">
              {type === 'hotel' && (
                <>
                  {viewCancellationVoucher ? (<div>
                    <div>
                      <HotelVoucherView voucher={selectedVoucher as HotelVoucherData} cancellation={true} bookingName={bookingName}/>
                    </div>
                  </div>) : (<div>
                    <div>
                      <HotelVoucherView voucher={selectedVoucher as HotelVoucherData} bookingName={bookingName}/>
                    </div>
                  </div>)}

                </>

              )}
              {type === 'restaurant' && (
                <>
                  {viewCancellationVoucher ? (<div>
                    <div>
                      <RestaurantVoucherView voucher={selectedVoucher as RestaurantVoucherData} cancellation={true} bookingName = {bookingName}/>
                    </div>
                  </div>) : (<div>
                    <div>
                      <RestaurantVoucherView voucher={selectedVoucher as RestaurantVoucherData} bookingName={bookingName}/>
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
