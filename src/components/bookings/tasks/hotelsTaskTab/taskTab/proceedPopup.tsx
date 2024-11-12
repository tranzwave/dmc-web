import { AccessorFnColumnDef, ColumnDef } from "@tanstack/react-table";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import HotelVoucherPDF from "../voucherTemplate";
import html2pdf from "html2pdf.js";
import { HotelVoucherData } from "..";
import { useRouter } from "next/navigation";
import { SelectHotelVoucherLine } from "~/server/db/schemaTypes";
  
interface ProceedContentProps {
  voucherColumns: ColumnDef<SelectHotelVoucherLine>[];
  selectedVoucher: HotelVoucherData;
  onVoucherLineRowClick: any;
  updateVoucherLine: any;
  updateVoucherStatus: any;
  rate: string;
  setRate: React.Dispatch<SetStateAction<string>>;
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
  const router = useRouter();
  const componentRef = useRef<HTMLDivElement>(null);
  
  const [ratesConfirmedBy, setRatesConfirmedBy] = useState(selectedVoucher?.ratesConfirmedBy ?? "");
  const [ratesConfirmedTo, setRatesConfirmedTo] = useState(selectedVoucher?.ratesConfirmedTo ?? "");
  const [availabilityConfirmedBy, setAvailabilityConfirmedBy] = useState(selectedVoucher?.availabilityConfirmedBy ?? "");
  const [availabilityConfirmedTo, setAvailabilityConfirmedTo] = useState(selectedVoucher?.availabilityConfirmedTo ?? "");

  const VoucherLineColumnsWithRate = [...voucherColumns, CreateRateColumn(rate, setRate)];

  const downloadPDF = () => {
    const filename = `${selectedVoucher.voucherLines[0]?.id}-Voucher.pdf`;
    const tempContainer = document.createElement("div");
    
    const componentElement = componentRef.current?.cloneNode(true);
    if (componentElement) tempContainer.appendChild(componentElement);

    tempContainer.style.width = "210mm";
    tempContainer.style.padding = "10mm";
    tempContainer.style.backgroundColor = "white";

    document.body.appendChild(tempContainer);
    const options = {
      filename,
      jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
      margin: [0, 0],
    };

    html2pdf().set(options).from(tempContainer).save().then(() => {
      document.body.removeChild(tempContainer);
    });
  };

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
    if (selectedVoucher?.status !== "inprogress") {
      alert("You've already sent the voucher to the vendor.");
      downloadPDF();
      return;
    }

    try {
      downloadPDF();
      selectedVoucher.status = "sentToVendor";
      setStatusChanged(true);
      await updateVoucherStatus(selectedVoucher);
      alert("Voucher status updated successfully");
    } catch (error) {
      console.error("Failed to update voucher status:", error);
    }
  };

  return (
    <div className="mb-9 space-y-6">
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

      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="w-full justify-end">
            <div className="text-sm font-normal text-neutral-900">Preview Voucher</div>
          </AccordionTrigger>
          <AccordionContent className="space-y-2">
            <div className="flex flex-row justify-end">
              <Button variant="primaryGreen" onClick={handleSendVoucher}>Download Voucher</Button>
            </div>
            <div ref={componentRef}>
              <HotelVoucherPDF voucher={selectedVoucher} />
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

const CreateRateColumn = <T extends object>(
  initialRate: string,
  setRate: React.Dispatch<SetStateAction<string>>,
): ColumnDef<T> => ({
  accessorKey: "rate",
  header: "Rate - USD",
  cell: ({ getValue, row, column }) => {
    const RateInput = () => {
      const [rate, setLocalRate] = useState<string>(initialRate);

      useEffect(() => {
        setLocalRate(initialRate);
      }, [initialRate]);

      const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setLocalRate(inputValue);
        // setRate(inputValue);
        (row.original as Record<string, any>)[column.id] = inputValue;
      };

      return (
        <Input
          type="number"
          value={rate}
          onChange={handleRateChange}
          onBlur={()=> setRate(rate)}
          className="rounded border border-gray-300 p-1"
          style={{ width: "80px" }}
          placeholder="0.00"
        />
      );
    };

    return <RateInput />;
  },
});

export default ProceedContent;
