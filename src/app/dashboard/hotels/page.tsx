"use client";
import { useOrganization } from "@clerk/nextjs";
import { ColumnDef } from "@tanstack/react-table";
import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import LoadingLayout from "~/components/common/dashboardLoading";
import DataTableDropDown from "~/components/common/dataTableDropdown";
import TitleBar from "~/components/common/titleBar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { HotelDTO } from "~/lib/types/hotel";
import { getAllHotels } from "~/server/db/queries/hotel";

const HotelsHome = () => {
  const columns: ColumnDef<HotelDTO>[] = [
    {
      accessorKey: "name",
      header: "Hotel Name",
    },
    {
      accessorKey: "city.name",
      header: "City",
    },
    {
      accessorKey: "stars",
      header: "Star Category",
    },
    {
      accessorKey: "primaryContactNumber",
      header: "Contact Number",
    },
    {
      accessorKey: "primaryEmail",
      header: "Email",
    },
    {
      accessorKey: "id",
      header: "",
      cell: ({ getValue, row }) => {
        const hotel = row.original;

        return (
          <DataTableDropDown
            data={hotel}
            routeBase="/hotels"
            onViewPath={(data) => `/dashboard/hotels/${data.id}`}
            onEditPath={(data) => `/dashboard/hotels/${data.id}/edit`}
            onDeletePath={(data) => `/dashboard/hotels/${data.id}/delete`}
          />
        );
      },
    },
  ];
  const [data, setData] = useState<HotelDTO[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<HotelDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const {organization, isLoaded:isOrgLoaded} = useOrganization();

  const pathname = usePathname();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // const result = await getHotelData();
        const result = await getAllHotels(organization?.id ?? "");

        setData(result);
      } catch (error) {
        console.error("Failed to fetch hotel data:", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredData = data.filter((hotel) => {
    const searchTerm = searchQuery.toLowerCase();

    const matchesSearch = hotel.name
      .toString()
      .toLowerCase()
      .includes(searchTerm);

    return matchesSearch;
  });

  const handleRowClick = (hotel: HotelDTO) => {
    setSelectedHotel(hotel);
  };

  const handleCloseSidePanel = () => {
    setSelectedHotel(null);
  };

  if(!isOrgLoaded){
    return (
      <LoadingLayout/>
    )
  }

  if (loading) {
    return (
      <div>
        <div className="flex w-full flex-row justify-between gap-1">
          <TitleBar title="Hotels" link="toAddHotel" />
          <div>
            <Link href={`${pathname}/add`}>
              <Button variant="primaryGreen">Add Hotels</Button>
            </Link>
          </div>
        </div>
        <LoadingLayout />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="flex flex-col gap-3">
          <div className="flex w-full flex-row justify-between gap-1">
            <TitleBar title="Hotels" link="toAddHotel" />
            <Link href={`${pathname}/add`}>
              <Button variant="primaryGreen">Add Hotel</Button>
            </Link>
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
          <div className="flex flex-row justify-center gap-3">
            <div className="w-[90%]">
              <DataTable
                columns={columns}
                data={filteredData}
                onRowClick={handleRowClick}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelsHome;
