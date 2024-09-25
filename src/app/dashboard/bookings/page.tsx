"use client"; 

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BookingDTO, columns } from "~/components/bookings/home/columns";
import { DataTable } from "~/components/bookings/home/dataTable";
import SidePanel from "~/components/bookings/home/sidePanel";
import LoadingLayout from "~/components/common/dashboardLoading";
import Pagination from "~/components/common/pagination"; // Import the new pagination component
import TitleBar from "~/components/common/titleBar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { getAllBookingLines } from "~/server/db/queries/booking";

export default function Bookings() {
  const [data, setData] = useState<BookingDTO[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingDTO | null>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [searchQuery, setSearchQuery] = useState(""); // Add a state for search

  const pathname = usePathname();

  const fetchBookingLines = async () => {
    setLoading(true);
    try {
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

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

    const filteredData = data.filter((booking) => {
      const searchTerm = searchQuery.toLowerCase();
      return (
        booking.booking.client.id.toString().includes(searchTerm) ||
        booking.booking.client.name.toLowerCase().includes(searchTerm)
      );
    });

  // Calculate the paginated data
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

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

    

          <div className="flex flex-row gap-3 mb-4">
            <div className="w-[60%]">
            <Input
              placeholder="Search by ID or Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Update search state on input change
            />
            <div className="mt-2">
              <DataTable
                columns={columns}
                data={paginatedData} // Use the paginated data
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
