import { useEffect, useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import { getDriverBookingStats } from "~/server/db/queries/reports";
import { columns } from "./columns";
import { useOrganization } from "@clerk/nextjs";

export type DriverBooking = {
  driverName: string;
  numberOfBookings: number;
  numberOfUpcomingTrips: number;
  numberOfOngoingTrips: number;
};

const TransportHistoryTable = () => {
  const [data, setData] = useState<DriverBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const {organization, isLoaded} = useOrganization();

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded || !organization) {
        return;
      }
      try {
        setLoading(true);
        const result: DriverBooking[] = await getDriverBookingStats(organization.id);
        setData(result);
      } catch (error) {
        console.error("Failed to fetch driver booking stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [organization]);

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
