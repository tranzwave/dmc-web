import { ColumnDef } from "@tanstack/react-table";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import HotelVoucherPDF from "../voucherTemplate";
import html2pdf from "html2pdf.js";
import { HotelVoucherData } from "..";
import { useRouter } from "next/navigation";
  
  interface ProceedContentProps {
    voucherColumns: any;
    selectedVoucher: HotelVoucherData;
    onVoucherLineRowClick: any;
    updateVoucherLine: any;
    updateVoucherStatus: any;
    rate: number | string;
    setRate: React.Dispatch<SetStateAction<number | string>>;
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
    const rateColumn = CreateRateColumn<typeof voucherColumns>(rate, setRate);
    const VoucherLineColumnsWithRate = [...voucherColumns, rateColumn];
    const router = useRouter()
  
    const [ratesConfirmedBy, setRatesConfirmedBy] = useState(
      selectedVoucher?.ratesConfirmedBy ?? "",
    );
    const [ratesConfirmedTo, setRatesConfirmedTo] = useState(
      selectedVoucher?.ratesConfirmedTo ?? "",
    );
    const [availabilityConfirmedBy, setAvailabilityConfirmedBy] = useState(
      selectedVoucher?.availabilityConfirmedBy ?? "",
    );
    const [availabilityConfirmedTo, setAvailabilityConfirmedTo] = useState(
      selectedVoucher?.availabilityConfirmedTo ?? "",
    );
  
    const componentRef = useRef<HTMLDivElement>(null);
  
    const downloadPDF = () => {
      const filename = `${selectedVoucher.voucherLines[0]?.id}-Voucher.pdf`
      // Create a temporary container to hold the entire PDF content
      const tempContainer = document.createElement("div");
    
      // Create the header section
      const headerElement = document.createElement("div");
      headerElement.innerHTML = ``;
    
      // Clone the componentRef element and add it as the main content
      const componentElement = componentRef.current?.cloneNode(true);
    
      // Create an additional section (optional, modify as needed)
      const additionalElement = document.createElement("div");
      additionalElement.innerHTML = `
        <div style="padding: 20px; background-color: #f0f0f0;">
        </div>
      `;
    
      // Create the footer section
      const footerElement = document.createElement("div");
      footerElement.innerHTML = ``;
    
      // Append header, main content, and footer to the temporary container
      tempContainer.appendChild(headerElement); // Add the header
      if (componentElement) {
        tempContainer.appendChild(componentElement); // Add the main content if available
      }
      tempContainer.appendChild(additionalElement); // Optional section
      tempContainer.appendChild(footerElement); // Add the footer
    
      // Apply some basic styling to the container for better formatting
      tempContainer.style.width = "210mm"; // Set width to A4 size (portrait)
      tempContainer.style.padding = "10mm"; // Padding for the container
      tempContainer.style.backgroundColor = "white"; // Set background to white
    
      // Append the temporary container to the body (invisible)
      document.body.appendChild(tempContainer);
    
      // Generate the PDF from the temporary container
      const options = {
        filename: filename,
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
        margin: [0, 0], // Remove default margins
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
    
  
    const areAllFieldsFilled = () => {
      return (
        ratesConfirmedBy.trim() !== "" &&
        ratesConfirmedTo.trim() !== "" &&
        availabilityConfirmedBy.trim() !== "" &&
        availabilityConfirmedTo.trim() !== ""
      );
    };
  
    const handleSubmit = async () => {
      if (!areAllFieldsFilled()) {
        alert("Please fill all the required fields.");
        return;
      }
  
      // Logic to check if all rates are filled
      const areAllRatesFilled = selectedVoucher?.voucherLines?.every(
        (line: any) => {
          // alert(line.rate)
          return !Number.isNaN(line.rate);
        },
      );
  
      if (!areAllRatesFilled) {
        alert("Please ensure all rates are filled.");
        return;
      }
  
      // alert(availabilityConfirmedBy)
  
      try {
        console.log({
          availabilityConfirmedBy: availabilityConfirmedBy,
          availabilityConfirmedTo: availabilityConfirmedTo,
          ratesConfirmedBy: ratesConfirmedBy,
          ratesConfirmedTo: ratesConfirmedTo,
        });
        await updateVoucherLine(
          selectedVoucher?.voucherLines ?? [selectedVoucher],
          {
            availabilityConfirmedBy: availabilityConfirmedBy,
            availabilityConfirmedTo: availabilityConfirmedTo,
            ratesConfirmedBy: ratesConfirmedBy,
            ratesConfirmedTo: ratesConfirmedTo,
          },
        );
        alert("Voucher line updated successfully!");

      } catch (error) {
        console.error("Failed to update voucher line:", error);
        alert("An error occurred while updating the voucher line.");
      } finally {
      }
    };
  
    const handleSendVoucher = async () => {
      if (selectedVoucher?.status !== "inprogress") {
        alert("You've already downloaded sent the voucher to vendor");
        downloadPDF();
        return;
      }
  
      try {
        downloadPDF();
        if (selectedVoucher?.status) {
          selectedVoucher.status = "sentToVendor";
        }
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
            columns={VoucherLineColumnsWithRate}
            data={
              selectedVoucher
                ? (selectedVoucher.voucherLines ?? [selectedVoucher])
                : []
            }
          />
  
          <div className="grid grid-cols-4 gap-2">
            <div>
              <div className="text-[13px] text-neutral-900">
                Availability confirmed by
              </div>
              <Input
                placeholder="Availability Confirmed By"
                value={availabilityConfirmedBy}
                onChange={(e) => setAvailabilityConfirmedBy(e.target.value)}
              />
            </div>
  
            <div>
              <div className="text-[13px] text-neutral-900">
                Availability confirmed to
              </div>
              <Input
                placeholder="Availability Confirmed To"
                value={availabilityConfirmedTo}
                onChange={(e) => setAvailabilityConfirmedTo(e.target.value)}
              />
            </div>
  
            <div>
              <div className="text-[13px] text-neutral-900">
                Rates confirmed by
              </div>
  
              <Input
                placeholder="Rates Confirmed By"
                value={ratesConfirmedBy}
                onChange={(e) => setRatesConfirmedBy(e.target.value)}
              />
            </div>
  
            <div>
              <div className="text-[13px] text-neutral-900">
                Rates confirmed to
              </div>
              <Input
                placeholder="Rates Confirmed To"
                value={ratesConfirmedTo}
                onChange={(e) => setRatesConfirmedTo(e.target.value)}
              />
            </div>
          </div>
        </div>
  
        <div className="flex w-full flex-row justify-end gap-2">
          <Button variant="primaryGreen" onClick={handleSubmit}>
            Save Voucher Rates
          </Button>
        </div>
  
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="w-full justify-end">
              <div className="text-sm font-normal text-neutral-900">
                Preview Voucher
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-2">
              <div className="flex flex-row justify-end">
                <Button variant="primaryGreen" onClick={handleSendVoucher}>
                  Download Voucher
                </Button>
              </div>
              <div ref={componentRef}>
                <HotelVoucherPDF voucher={selectedVoucher} />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
  
        <div></div>
      </div>
    );
  };

  const CreateRateColumn = <T extends object>(
    initialRate: number | string,
    setRate: React.Dispatch<SetStateAction<number | string>>,
  ): ColumnDef<T> => ({
    accessorKey: "rate",
    header: "Rate - USD",
    cell: ({ getValue, row, column }) => {
      // Create a separate component to handle state and rendering
      const RateInput = () => {
        const [rate, setLocalRate] = useState<number | string>(initialRate);
        const inputRef = useRef<HTMLInputElement | null>(null);
  
        useEffect(() => {
          setLocalRate(initialRate);
        }, [initialRate]);
  
        const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const inputValue = e.target.value;
  
          // Allow empty input or valid decimal/float values
          if (inputValue === "" || /^(\d+(\.\d{0,2})?)?$/.test(inputValue)) {
            setLocalRate(inputValue); // Set local rate directly to the input value
            const newRate = inputValue === "" ? "" : parseFloat(inputValue);
  
            // Update the rate state with the new rate
            setRate(newRate);
  
            // Update the row data with the new rate value
            (row.original as Record<string, any>)[column.id] = newRate;
          }
        };
  
        // Focus the input element when it's mounted
        useEffect(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, []);
  
        return (
          <Input
            // ref={inputRef} // Attach the ref to the input
            type="number" // You can keep this as "number" if you want to restrict to number inputs
            value={rate}
            onChange={handleRateChange}
            className="rounded border border-gray-300 p-1"
            style={{ width: "80px" }}
            placeholder="0.00" // Optional placeholder for clarity
          />
        );
      };
  
      // Render the RateInput component inside the cell
      return <RateInput />;
    },
  });

  export default ProceedContent;