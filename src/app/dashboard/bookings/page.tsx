"use client";

import { useOrganization } from "@clerk/nextjs";
import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useEffect, useState } from "react";
import { BookingDTO, columns } from "~/components/bookings/home/columns";
import { DataTable } from "~/components/bookings/home/dataTable";
import SidePanel from "~/components/bookings/home/sidePanel";
import LoadingLayout from "~/components/common/dashboardLoading";
import Pagination from "~/components/common/pagination";
import TitleBar from "~/components/common/titleBar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { getAllBookingLines } from "~/server/db/queries/booking";

export default function Bookings() {
  const [data, setData] = useState<BookingDTO[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingDTO | null>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { organization, isLoaded } = useOrganization();

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const pathname = usePathname();

  const fetchBookingLines = async () => {
    setLoading(true);
    try {
      const result = await getAllBookingLines(organization?.id ?? "");

      if (!result) {
        throw new Error("Couldn't find any bookings");
      }

      setData(result);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch booking data:", error);
      setError("Failed to load data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingLines();
  }, []);

  const handleRowClick = (booking: BookingDTO) => {
    setSelectedBooking(booking);
  };

  const handleCloseSidePanel = () => {
    setSelectedBooking(null);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const parseDate = (dateString: string) => new Date(dateString);

  const filteredData = data.filter((booking) => {
    const searchTerm = searchQuery.toLowerCase();
    const bookingStartDate = booking.startDate;
    const bookingEndDate = booking.endDate;

    const matchesSearch =
      booking.booking.client.id.toString().includes(searchTerm) ||
      booking.booking.client.name.toLowerCase().includes(searchTerm);

    const matchesStartDate = startDate
      ? bookingStartDate >= parseDate(startDate)
      : true;
    const matchesEndDate = endDate
      ? bookingEndDate <= parseDate(endDate)
      : true;

    return matchesSearch && matchesStartDate && matchesEndDate;
  });

  // const filteredData = data.filter((booking) => {
  //   const searchTerm = searchQuery.toLowerCase();
  //   return (
  //     booking.booking.client.id.toString().includes(searchTerm) ||
  //     booking.booking.client.name.toLowerCase().includes(searchTerm)
  //   );
  // });

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + rowsPerPage,
  );
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  if (loading || !isLoaded) {
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

          <div className="mb-4 flex flex-row gap-3">
            <div className="w-[60%]">
              <div className="flex gap-5">
                <div className="relative w-[40%]">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-4 w-4 text-gray-500" />{" "}
                  </div>
                  <Input
                    className="pl-10"
                    placeholder="Search by Booking Id or Client Name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-5">
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <label htmlFor="start-date" className="mb-1 block">
                      Start Date
                    </label>
                    <input
                    title="startDateFilter"
                      type="date"
                      value={startDate ?? ""}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="rounded-md border p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <label htmlFor="start-date" className="mb-1 block">
                      End Date
                    </label>
                    <input
                    title="endDateFilter"
                      type="date"
                      value={endDate ?? ""}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="rounded-md border p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <DataTable
                  columns={columns}
                  data={paginatedData}
                  onRowClick={handleRowClick}
                />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
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
