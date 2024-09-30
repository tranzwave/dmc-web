"use client";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import TitleBar from "~/components/common/titleBar";
import ContactBox from "~/components/ui/content-box";
import { StatsCard } from "~/components/ui/stats-card";
import { HotelDTO } from "~/lib/types/hotel";
import { formatDate } from "~/lib/utils/index";
import { getHotelByIdQuery, getVoucherLinesByHotelId } from "~/server/db/queries/hotel";
import { SelectHotelVoucherLine } from "~/server/db/schemaTypes";



const Page = ({ params }: { params: { id: string } }) => {
  const [hotel, setHotel] = useState<HotelDTO | null>(null);
  const [vouchers, setVouchers] = useState<SelectHotelVoucherLine[]>([]);
  const [voucherCounts, setVoucherCounts] = useState({
    upcomingBookings : 0,
    fiveStarRatings: 0
  })
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHotelDetails() {
      try {
        setLoading(true);
        const selectedHotel = await getHotelByIdQuery(params.id);
        setHotel(selectedHotel ?? null);
        
      } catch (error) {
        console.error("Failed to fetch hotel details:", error);
        setError("Failed to load hotel details.");
      } finally {
        setLoading(false);
      }
    }

    fetchHotelDetails();
  }, [params.id]);

  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoading(true);
        const result = await getVoucherLinesByHotelId(params.id);
        setVouchers(result);
        const upcoming = result.filter(voucher => Date.parse(voucher.checkInDate) > Date.now()).length
        setVoucherCounts({
            upcomingBookings: upcoming,
            fiveStarRatings: 0
        });
      } catch (error) {
        console.error("Failed to fetch bookings data:", error);
        setError("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!hotel) {
    return <div>No hotel found with the given ID.</div>;
  }

  return (
    <div className="flex flex-col gap-3 w-full justify-between">
      <TitleBar title={`Hotel - ${hotel.name}`} link="toAddBooking" />
      <div className="mx-9 flex flex-row justify-between">
        <div className="w-[30%]">
          <div className="w-full">
            <ContactBox
              title={hotel.name}
              description="An elegant hotel offering the best amenities for a comfortable stay."
              location={hotel.city.name}
              address={`${hotel.streetName}, ${hotel.city.name}, ${hotel.province}`}
              phone={hotel.primaryContactNumber}
              email={hotel.primaryEmail}
            />
          </div>
        </div>
        <div className="card w-[70%] space-y-6">
          <div>Current Bookings</div>
          <DataTable columns={voucherLinesColumns} data={vouchers} />

          <div>Booking History</div>
          <div className="col-span-3 flex justify-between gap-6">
            <StatsCard label="5 Star ratings" value={voucherCounts.fiveStarRatings} />
            <StatsCard label="Total Bookings" value={vouchers.length.toString()} />
            <StatsCard label="Upcoming Bookings" value={voucherCounts.upcomingBookings} />
          </div>

          <div>Booking History</div>
          <DataTable columns={voucherLinesColumns} data={vouchers.filter(voucher => Date.parse(voucher.checkInDate) > Date.now())} />
        </div>
      </div>
    </div>
  );
};

export default Page;



const voucherLinesColumns: ColumnDef<SelectHotelVoucherLine>[] = [
    {
      header: "Start Date",
      accessorFn: (row) => formatDate(row.checkInDate.toString()),
    },
    {
      header: "End Date",
      accessorFn: (row) => formatDate(row.checkOutDate.toString())
    },
    {
      header: "Room Category",
      accessorFn: (row) => row.roomType,
  },
//   {
//     header: "Room Type",
//     accessorFn: (row) => row.,
// },
  {
    header: "Basis",
    accessorFn: (row) => row.basis,
},

    {
        header: "Rate",
        accessorFn: (row) => row.rate,
    },  
  ];
