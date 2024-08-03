"use client"

import { useEffect, useState } from 'react';
import TitleBar from "~/components/common/titleBar";
import { Button } from "~/components/ui/button";
import { Booking, columns } from "~/components/bookings/home/columns";
import { getData } from "~/lib/api";
import { DataTable } from "~/components/bookings/home/dataTable";
import SidePanel from "~/components/bookings/home/sidePanel";
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Bookings() {
  const [data, setData] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const pathname = usePathname()

  // Fetch data on mount
  useEffect(() => {
    async function fetchData() {
      const result = await getData();
      setData(result);
    }

    fetchData();
  }, []);

  const handleRowClick = (booking: Booking) => {
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
