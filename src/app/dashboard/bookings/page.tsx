"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Booking, columns } from "~/components/bookings/home/columns";
import { DataTable } from "~/components/bookings/home/dataTable";
import SidePanel from "~/components/bookings/home/sidePanel";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { getAllBookings } from '~/server/db/queries/booking';
import { BookingDTO } from '~/lib/types/booking';

export default function Bookings() {
  const [data, setData] = useState<BookingDTO[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingDTO | null>(null);
  const [loading,setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null);

  const pathname = usePathname()

  // Fetch data on mount
  useEffect(() => {
    async function fetchData() {
        setLoading(true);
        try {
            // const result = await getHotelData();
            const result = await getAllBookings();

            setData(result);
        } catch (error) {
            console.error("Failed to fetch hotel data:", error);
            setError("Failed to load data.");
        } finally {
            setLoading(false);
        }
    }

    fetchData();
}, []);

  const handleRowClick = (booking: BookingDTO) => {
    setSelectedBooking(booking);
  };

  const handleCloseSidePanel = () => {
    setSelectedBooking(null);
  };

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="flex flex-col gap-3">
          <div className="flex flex-row gap-1 w-full justify-between">
            <TitleBar title="Bookings" link="toAddBooking" />
            <div>
                <Link href={`${pathname}/add`}>
                    <Button variant="primaryGreen">Add Booking</Button>
                </Link>             
            </div>
          </div>
          <div className='flex flex-row gap-3'>
            <div className='w-[60%]'>
                <DataTable columns={columns} data={data} onRowClick={handleRowClick} />
            </div>
            <div className='w-[40%]'>
                <SidePanel booking={selectedBooking} onClose={handleCloseSidePanel} />
            </div>
            
            
          </div>
        </div>
      </div>
      
    </div>
  );
}
