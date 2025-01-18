import React, { useRef } from 'react';
import { useReactToPrint, UseReactToPrintOptions } from 'react-to-print';
import html2pdf from "html2pdf.js";

// Define the TypeScript interface for the voucher details
interface VoucherProps {
  clientName: string;
  bookingId: string;
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfDays: number;
  roomType: string;
}

const Voucher: React.FC<VoucherProps> = ({
  clientName,
  bookingId,
  hotelName,
  checkInDate,
  checkOutDate,
  numberOfDays,
  roomType,
}) => {
  // Reference to the printable component
  const componentRef = useRef<HTMLDivElement>(null);

  // Fix: Specify the options type explicitly if the error persists
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  } as UseReactToPrintOptions); // Explicitly define the type here

  const downloadPDF = () => {
    const element = componentRef.current;
    const options = {
      filename: "booking_summary.pdf",
      jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(options).from(element).save();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-3/4 bg-white shadow-lg p-10 rounded-lg">
        {/* The Voucher content to be printed */}
        <div ref={componentRef} className="text-left">
          <h1 className="text-3xl font-bold mb-4 text-center">Hotel Booking Voucher</h1>

          <div className="border-b border-gray-200 pb-4 mb-4">
            <h2 className="text-xl font-semibold">Booking Details</h2>
            <p className="mt-2">
              <span className="font-bold">Booking ID:</span> {bookingId}
            </p>
            <p>
              <span className="font-bold">Client Name:</span> {clientName}
            </p>
            <p>
              <span className="font-bold">Hotel Name:</span> {hotelName}
            </p>
          </div>

          <div className="border-b border-gray-200 pb-4 mb-4">
            <h2 className="text-xl font-semibold">Stay Information</h2>
            <p>
              <span className="font-bold">Check-In Date:</span> {checkInDate}
            </p>
            <p>
              <span className="font-bold">Check-Out Date:</span> {checkOutDate}
            </p>
            <p>
              <span className="font-bold">Number of Days:</span> {numberOfDays}
            </p>
            <p>
              <span className="font-bold">Room Type:</span> {roomType}
            </p>
          </div>

          <div className="text-center mt-6">
            <h3 className="text-lg font-semibold mb-2">Enjoy your stay at {hotelName}!</h3>
          </div>
        </div>

        {/* Button to download the voucher as PDF */}
        <div className="mt-8 text-center">
          <button
            onClick={downloadPDF}
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600"
          >
            Download Voucher as PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Voucher;
