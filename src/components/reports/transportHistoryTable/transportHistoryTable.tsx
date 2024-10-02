import { useEffect, useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import { getDriverBookingStats } from "~/server/db/queries/reports";
import { columns } from "./columns";

export type DriverBooking = {
  driverName: string;
  numberOfBookings: number;
  numberOfUpcomingTrips: number;
  numberOfOngoingTrips: number;
};

const TransportHistoryTable = () => {
  const [data, setData] = useState<DriverBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result: DriverBooking[] = await getDriverBookingStats();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch driver booking stats:", error);
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

export default TransportHistoryTable;
