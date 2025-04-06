"use client";
import { useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import Image from "next/image";
import { useOrganization } from "~/app/dashboard/context";
import LoadingLayout from "~/components/common/dashboardLoading";
import VoucherHeader from "~/components/common/voucher/VoucherHeader";
import { calculateNights, formatDate } from "~/lib/utils/index";
import { OrganizationResource, UserResource } from "@clerk/types";
import { BookingDTO } from "../../columns";
import { useEffect, useState } from "react";
import { BankDetails } from "~/lib/types/payment";
import { Country } from "country-state-city";

type TourInvoiceDocumentProps = {
  organization: OrganizationResource;
  user: UserResource;
  bookingData:BookingDTO;
};

const TourInvoicePDF = ({ organization, user, bookingData }: TourInvoiceDocumentProps) => {

  console.log(bookingData.tourPacket)

  const invoiceTotal = bookingData.tourInvoice?.entries.reduce((acc, curr) => acc + curr.total, 0) ?? 0;
  const depositPayment = Number(bookingData.tourInvoice?.invoiceDetails.depositPayment ?? 0);
  const bankCharges = Number(bookingData.tourInvoice?.invoiceDetails.bankCharges ?? 0);
  const country = Country.getCountryByCode(bookingData.booking.client.country)?.name ?? bookingData.booking.client.country;
  const agent = bookingData.booking.bookingAgent?.agent ?? {
    name: "",
    email: "",
    agency: "",
    countryCode: "",
    primaryContactNumber: "",
    address: "",
  };

  const [bankDetails, setBankDetails] = useState<BankDetails | null>(organization.publicMetadata.bankDetails as BankDetails);

  useEffect(() => {
    console.log("refetching tour invoice");
  }
  , [bookingData]);

  return (
    <div className="flex flex-col justify-center">
      <VoucherHeader organization={organization}/>
      <div className="p-4 px-7">
        <div className="card-title w-full text-center text-[18px] font-bold" style={{
          fontSize: "18px",
        }}>
          Proforma Invoice
        </div>

        <div className="flex w-full flex-row justify-between">
          <div className="text-[13px]">
            {/* <div>Booking Name: {vouchers[0]?.client?.name ?? "N/A"}</div> */}
            {/* <div>Tour ID: {bookingData.id ?? "N/A"}</div> */}
            <div>Booking Name: {bookingData.booking.client.name}</div>
            <div>Country : {country}</div>
            {!bookingData.booking.directCustomer ? (
              <div className="mt-2">
                <div>Agent: {agent.name}</div>
                <div>Agency: {agent.agency}</div>
                <div>Agency Country: {Country.getCountryByCode(agent.countryCode)?.name ?? "N/A"}</div>
                <div>Agency Email: {agent.email}</div>
                <div>Agency Phone: {agent.primaryContactNumber}</div>
                <div>Agency Address: {agent.address}</div>
              </div>
            ): (
              <div>
                <div>Email: {bookingData.booking.client.primaryEmail}</div>
                <div>Phone: {bookingData.booking.client.primaryContactNumber}</div>
              </div>
            )}
          </div>
          <div className="text-[13px]">
            <div>Arrival: {bookingData.startDate.toDateString()}</div>
            <div>Departure: {bookingData.endDate.toDateString()}</div>
            <div>Invoice Date: {new Date().toLocaleDateString(
                "en-GB",
                {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                }
            )}</div>
            <div>Invoice No: {bookingData.id}-INV</div>
            <div>Destination: {String(organization.publicMetadata?.country ?? '')}</div>
            <div>No. of Days: {calculateNights(bookingData.startDate, bookingData.endDate)}</div>
            <div>No. of travellers: {`${bookingData.adultsCount} Adults | ${bookingData.kidsCount} Kids`}</div>
          </div>
        </div>
        <div className="font-semibold mt-2">Payment Information</div>
        <div className="flex flex-row justify-between">
            <div>
                <div>Date of Due: {bookingData.tourInvoice?.invoiceDetails.dueDate}</div>
                <div>Deposit Payment: {depositPayment}</div>
                <div>Currency: {bookingData.tourInvoice?.invoiceDetails.currency ?? ""}</div>
            </div>
            <div>
                <div>Invoice Total: {`${bookingData.tourInvoice?.invoiceDetails.currency} ${invoiceTotal.toFixed(2)}`} </div>
                <div>Bank Charges: {`${bookingData.tourInvoice?.invoiceDetails.currency} ${bankCharges}`}</div>
                <div>Total Amount Due: {`${bookingData.tourInvoice?.invoiceDetails.currency} ${((invoiceTotal + bankCharges) - depositPayment).toFixed(2)}`} </div>
            </div>
        </div>
        <div className="mt-4 text-[13px]">
          <table className="min-w-full rounded-md border bg-white">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left font-semibold">Service</th>
                <th className="px-4 py-2 text-left font-semibold">Description</th>
                <th className="px-4 py-2 text-left font-semibold">Amount</th>
                <th className="px-4 py-2 text-left font-semibold">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {bookingData.tourInvoice?.entries.map((d,index) => {
                return (
                  <tr className="border-b hover:bg-gray-50" key={index}>
                    <td className="px-4 py-2">{d.service}</td>
                    <td className="px-4 py-2">{d.description ?? "N/A"}</td>
                    <td className="px-4 py-2">{`${bookingData.tourInvoice?.invoiceDetails.currency} ${d.unitPrice} x ${d.quantity}`}</td>
                    <td className="px-4 py-2">{`${bookingData.tourInvoice?.invoiceDetails.currency} ${d.total}`}</td>
                  </tr>
                );
              })}
              <tr className="border-b">
                <td className="px-4 py-2"></td>
                <td colSpan={2} className="px-4 py-2 text-right font-semibold">Total</td>
                <td className="px-4 py-2 font-semibold">{`${bookingData.tourInvoice?.invoiceDetails.currency} ${invoiceTotal.toFixed(2)}`}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2"></td>
                <td colSpan={2} className="px-4 py-2 text-right font-semibold">Deposit Paid</td>
                <td className="px-4 py-2 font-semibold">{`${bookingData.tourInvoice?.invoiceDetails.currency} ${depositPayment}`}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2"></td>
                <td colSpan={2} className="px-4 py-2 text-right font-semibold">Bank Charges</td>
                <td className="px-4 py-2 font-semibold">{`${bookingData.tourInvoice?.invoiceDetails.currency} ${bankCharges}`}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2"></td>
                <td colSpan={2} className="px-4 py-2 text-right font-bold">Total Amount Due</td>
                <td className="px-4 py-2 font-semibold">{`${bookingData.tourInvoice?.invoiceDetails.currency} ${((invoiceTotal - (depositPayment)) + (bankCharges))}`}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex flex-row justify-between">
            <div>
                <div>Method of Payment: {bookingData.tourInvoice?.invoiceDetails.methodOfPayment}</div>
                <div>Credit Period: {bookingData.tourInvoice?.invoiceDetails.creditPeriod}</div>
            </div>
            <div>
                <div>Issued For: {bookingData.tourInvoice?.invoiceDetails.issuedFor}</div>
                <div>Issued By: {bookingData.tourInvoice?.invoiceDetails.issuedBy}</div>
            </div>
        </div>

        {/* Bank details */}
        <div className="mt-4">
          <div className="text-[13px]">Account Name: {bankDetails?.accountName}</div>
          <div className="text-[13px]">Account Number: {bankDetails?.accountNumber}</div>
          <div className="text-[13px]">Bank Name: {bankDetails?.bankName}</div>
          <div className="text-[13px]">Branch Address: {bankDetails?.branchAddress}</div>
          <div className="text-[13px]">Swift Code: {bankDetails?.SWIFTCode}</div>
        </div>

        <div className="mt-10 text-[13px]">
          <div>Printed Date : {format(Date.now(), "dd/MM/yyyy")}</div>
          <div>Prepared By : {user?.fullName ?? ""}</div>
          <div>Contact Number : {(user?.publicMetadata as any)?.info?.contact ?? ""}</div>
          {/* <div className="text-[12px] text-center text-gray-700">This is a computer generated Voucher & does not require a signature</div> */}
        </div>
      </div>
      {/* <div className="h-8 w-full bg-primary-green"></div> */}
    </div>
  );
};

export default TourInvoicePDF;
