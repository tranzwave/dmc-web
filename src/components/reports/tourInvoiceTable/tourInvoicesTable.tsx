"use client";
import { useEffect, useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import { getHotelBookingStats } from "~/server/db/queries/reports";
import { columns } from "./columns";
import { BookingDTO } from "~/components/bookings/home/columns";
import { OrganizationResource, UserResource } from "@clerk/types";
import { ClerkUserPublicMetadata } from "~/lib/types/payment";
import { getAllBookingLines } from "~/server/db/queries/booking";

interface TourInvoicesTableProps {
  organization: OrganizationResource;
  userMetadata: ClerkUserPublicMetadata;
  isSuperAdmin: boolean;
}

const TourInvoicesTable = ({organization, userMetadata, isSuperAdmin}: TourInvoicesTableProps) => {
  const [data, setData] = useState<BookingDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // const result: HotelsBooking[] = await getHotelBookingStats();
        const result = await getAllBookingLines(organization.id, userMetadata.teams.map((team) => team.teamId), isSuperAdmin);

        setData(result);
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

export default TourInvoicesTable;
