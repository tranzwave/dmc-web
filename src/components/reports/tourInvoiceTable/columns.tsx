"use client";

import { ColumnDef } from "@tanstack/react-table";
import { BookingDTO } from "~/components/bookings/home/columns";
import TourInvoiceModalTrigger from "~/components/bookings/home/sidePanel/proformaInvoice/tourInvoiceModalTrigger";

export const columns: ColumnDef<BookingDTO, unknown>[] = [
  {
    header: "Booking ID",
    accessorFn: (row) => row.id,
  },
  {
    accessorKey: "Booking Name",
    accessorFn: (row) => row.booking.client.name,
  },
  //A cell with tourInvoiceModalTrigger
  {
    header: "Tour Invoice",
    id: "tour-invoice",
    cell: ({ row }) => (
      <div className="flex items-center">
        <TourInvoiceModalTrigger bookingData={row.original} />
      </div>
    ),
  }
];
