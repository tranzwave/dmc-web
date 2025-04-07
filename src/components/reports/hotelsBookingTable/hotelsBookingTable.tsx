"use client"
import { useEffect, useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import { getHotelBookingStats } from "~/server/db/queries/reports";
import { columns } from "./columns";
import { useOrganization } from "@clerk/nextjs";

export type HotelsBooking = {
  hotelName: string;
  bookingCount: number;
  lastBookingDate: string | null;
};

const HotelsBookingTable = () => {
  const [data, setData] = useState<HotelsBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const { organization, isLoaded } = useOrganization();

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded || !organization) {
        return;
      }
      try {
        setLoading(true);
        const result: HotelsBooking[] = await getHotelBookingStats(organization.id);
        setData(result); // Set the fetched data
      } catch (error) {
        console.error("Failed to fetch hotel booking stats:", error);
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

export default HotelsBookingTable;
