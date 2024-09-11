"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookingDTO,
  columns
} from "~/components/bookings/home/columns";
import { DataTable } from "~/components/bookings/home/dataTable";
import SidePanel from "~/components/bookings/home/sidePanel";
import {
  getAllBookingLines
} from "~/server/db/queries/booking";
// import { BookingDTO } from '~/lib/types/booking';
import LoadingLayout from "~/components/common/dashboardLoading";
import TitleBar from "~/components/common/titleBar";
import { Button } from "~/components/ui/button";

export default function Bookings() {
  const [data, setData] = useState<BookingDTO[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingDTO | null>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const pathname = usePathname();

  const fetchBookingLines = async () => {
    setLoading(true);
    try {
      // const result = await getHotelData();
      const result = await getAllBookingLines();

      if (!result) {
        throw new Error("Couldn't find any bookings");
      }

      setData(result);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch hotel data:", error);
      setError("Failed to load data.");
      setLoading(false);
    }
  };
  // Fetch data on mount
  useEffect(() => {
    fetchBookingLines();
  }, []);

  const handleRowClick = (booking: BookingDTO) => {
    setSelectedBooking(booking);
  };

  const handleCloseSidePanel = () => {
    setSelectedBooking(null);
  };

  if (loading) {
    return (
      <div>
        <div className="flex w-full flex-row justify-between gap-1">
          <TitleBar title="Bookings" link="toAddBooking" />
          <div>
            <Link href={`${pathname}/add`}>
              <Button variant="primaryGreen">Add Booking</Button>
            </Link>
          </div>
        </div>
          <LoadingLayout />
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="flex flex-col gap-3">
          <div className="flex w-full flex-row justify-between gap-1">
            <TitleBar title="Bookings" link="toAddBooking" />
            <div>
              <Link href={`${pathname}/add`}>
                <Button variant="primaryGreen">Add Booking</Button>
              </Link>
            </div>
          </div>
          <div className="flex flex-row gap-3">
            <div className="w-[60%]">
              <DataTable
                columns={columns}
                data={data}
                onRowClick={handleRowClick}
              />
            </div>
            <div className="w-[40%]">
              <SidePanel
                booking={selectedBooking ? selectedBooking : null}
                onClose={handleCloseSidePanel}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
