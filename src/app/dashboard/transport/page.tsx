"use client";
import { useOrganization } from "@clerk/nextjs";
import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import LoadingLayout from "~/components/common/dashboardLoading";
import TitleBar from "~/components/common/titleBar";
import { otherTransportColumns, OtherTransportWithCity } from "~/components/transports/addTransport/forms/generalForm/other-transport/columns";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  driverColumns,
  DriverDTO,
} from "~/lib/types/driver/type";
import { guideColumns, GuideDTO } from "~/lib/types/guide/type";
import { getAllDrivers, getAllGuides, getAllOtherTransports } from "~/server/db/queries/transport";
import { SelectCity, SelectOtherTransport } from "~/server/db/schemaTypes";

const TransportHome = () => {
  const pathname = usePathname();

  const [data, setData] = useState<DriverDTO[]>([]);
  const [guideData, setGuideData] = useState<GuideDTO[]>([]);
  const [otherTransportData, setOtherTransportData] = useState<OtherTransportWithCity[]>([]);
  const [cityData, setCityData] = useState<(SelectOtherTransport & SelectCity)[]>([]);
  // const [selectedTransport, setSelectedTransport] = useState<Driver | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Added loading state
  const [error, setError] = useState<string | null>(null); // Added error state
  const [searchQuery, setSearchQuery] = useState("");
  const {organization, isLoaded} = useOrganization();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") ?? "driver");

  useEffect(() => {
    async function fetchData() {
      try {

        setLoading(true);
        if(!organization) return;
        const result = await getAllDrivers(organization.id);
        setData(result);
      } catch (error) {
        console.error("Failed to fetch transport data:", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [organization]);

  useEffect(() => {
    async function fetchGuideData() {
      try {
        setLoading(true);
        if(!organization) return;
        const result = await getAllGuides(organization.id);
        setGuideData(result);
      } catch (error) {
        console.error("Failed to fetch transport data:", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    }

    fetchGuideData();
  }, [organization]);

  //Fetch other transport data
  useEffect(() => {
    async function fetchOtherTransportData() {
      try {
        setLoading(true);
        if(!organization) return;
        const result = await getAllOtherTransports(organization.id);
        setOtherTransportData(result);
      } catch (error) {
        console.error("Failed to fetch transport data:", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    }

    fetchOtherTransportData();
  }, [organization]);

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

  //filtered other transport data
  const filteredOtherTransportData = otherTransportData.filter((otherTransport) => {
    const searchTerm = searchQuery.toLowerCase();

    const matchesSearch = otherTransport.name
      .toString()
      .toLowerCase()
      .includes(searchTerm);

    return matchesSearch;
  });

  console.log(data);
  console.log(guideData);
  if (loading || !isLoaded) {
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
              <Link href={`${pathname}/other-transport/add`}>
                <Button variant="primaryGreen">Add Other</Button>
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
          <div className="w-full flex items-center justify-center">
              <Tabs defaultValue={activeTab} className="w-full justify-center">
              <TabsList>
                <TabsTrigger value="driver">Driver and Chauffeur</TabsTrigger>
                <TabsTrigger value="guide">Guide</TabsTrigger>
                <TabsTrigger value="other">Other Transport</TabsTrigger>
              </TabsList>

              <TabsContent value="driver" className="flex justify-center">
                <div className="w-[90%]">
                <DataTable columns={driverColumns} data={filteredData} />
                </div>
              </TabsContent>
              <TabsContent value="guide" className="flex justify-center">
                <div className="w-[90%]">
                <DataTable columns={guideColumns} data={filteredGuideData} />
                </div>
              </TabsContent>
              <TabsContent value="other" className="flex justify-center">
                <div className="w-[90%]">
                <DataTable columns={otherTransportColumns} data={filteredOtherTransportData} />
                </div>
              </TabsContent>
              </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportHome;
