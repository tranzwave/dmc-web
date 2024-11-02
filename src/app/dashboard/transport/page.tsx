"use client";
import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import LoadingLayout from "~/components/common/dashboardLoading";
import TitleBar from "~/components/common/titleBar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
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
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredData = data.filter((driver) => {
    const searchTerm = searchQuery.toLowerCase();

    const matchesSearch = driver.name
      .toString()
      .toLowerCase()
      .includes(searchTerm);

    return matchesSearch;
  });

  const filteredGuideData = guideData.filter((guide) => {
    const searchTerm = searchQuery.toLowerCase();

    const matchesSearch = guide.name
      .toString()
      .toLowerCase()
      .includes(searchTerm);

    return matchesSearch;
  });

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
          <div className="relative w-[40%]">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-500" />{" "}
            </div>
            <Input
              className="pl-10"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-row justify-center gap-3 mb-4">
            <div className="w-[90%]">
              <div>Driver and Chauffeur</div>
              <DataTable columns={driverColumns} data={filteredData} />
            </div>
          </div>
          <div className="flex flex-row justify-center gap-3 mb-4">
            <div className="w-[90%]">
              <div>Guide</div>
              <DataTable columns={guideColumns} data={filteredGuideData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportHome;
