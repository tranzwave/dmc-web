"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import LoadingLayout from "~/components/common/dashboardLoading";
import TitleBar from "~/components/common/titleBar";
import { Button } from "~/components/ui/button";
import {
  driverColumns,
  DriverDTO,
} from "~/lib/types/driver/type";
import { guideColumns, GuideDTO } from "~/lib/types/guide/type";
import { getAllDrivers, getAllGuides } from "~/server/db/queries/transport";

const TransportHome = () => {
  const pathname = usePathname();

  const [data, setData] = useState<DriverDTO[]>([]);
  const [guideData, setGuideData] = useState<GuideDTO[]>([]);
  // const [selectedTransport, setSelectedTransport] = useState<Driver | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Added loading state
  const [error, setError] = useState<string | null>(null); // Added error state

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const result = await getAllDrivers();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch transport data:", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchGuideData() {
      try {
        setLoading(true);
        const result = await getAllGuides();
        setGuideData(result);
      } catch (error) {
        console.error("Failed to fetch transport data:", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    }

    fetchGuideData();
  }, []);

  console.log(data);
  console.log(guideData);
  if (loading) {
    return (
      <div>
        <div className="flex w-full flex-row justify-between gap-1">
          <TitleBar title="Transport" link="toAddTransport" />
          <div>
            <Link href={`${pathname}/add`}>
              <Button variant="primaryGreen">Add Driver</Button>
            </Link>
          </div>
        </div>
        <LoadingLayout />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>; // Render error message if there's an error
  }

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="flex flex-col gap-3">
          <div className="flex w-full flex-row justify-between gap-1">
            <TitleBar title="Transport" link="toAddTransport" />
            <div className="flex gap-2">
              <Link href={`${pathname}/guide/add`}>
                <Button variant="primaryGreen">Add Guide</Button>
              </Link>
              <Link href={`${pathname}/add`}>
                <Button variant="primaryGreen">Add Driver / Chauffeur</Button>
              </Link>
            </div>
          </div>
          <div className="flex flex-row justify-center gap-3 mb-4">
            <div className="w-[90%]">
              <div>Driver and Chauffeur</div>
              <DataTable columns={driverColumns} data={data} />
            </div>
          </div>
          <div className="flex flex-row justify-center gap-3 mb-4">
            <div className="w-[90%]">
              <div>Guide</div>
              <DataTable columns={guideColumns} data={guideData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportHome;
