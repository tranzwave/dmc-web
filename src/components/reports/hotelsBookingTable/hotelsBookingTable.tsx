import { useEffect, useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import { getHotelBookingStats } from "~/server/db/queries/reports";
import { columns } from "./columns";

export type HotelsBooking = {
  hotelName: string;
  bookingCount: number;
  lastBookingDate: string | null;
};

const HotelsBookingTable = () => {
  const [data, setData] = useState<HotelsBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result: HotelsBooking[] = await getHotelBookingStats();
        setData(result); // Set the fetched data
      } catch (error) {
        console.error("Failed to fetch hotel booking stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <DataTable columns={columns} data={data} />
        
      )}
    </div>
  );
};

export default HotelsBookingTable;
