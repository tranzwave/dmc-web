"use client";

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
import { getAllShops } from "~/server/db/queries/shops";
import { SelectCity, SelectShop } from "~/server/db/schemaTypes";

export type ShopData = SelectShop & {
  city: SelectCity;
};
const ShopHome = () => {
  const shopColumns: ColumnDef<ShopData>[] = [
    {
      header: "Shop Name",
      accessorFn: (row) => row.name,
    },
    {
      header: "Contact Number",
      accessorFn: (row) => row.contactNumber,
    },
    {
      header: "Street Name",
      accessorFn: (row) => row.streetName,
    },
    {
      header: "Province",
      accessorFn: (row) => row.province,
    },
    {
      header: "City",
      accessorFn: (row) => row.city.name,
    },
    {
      accessorKey: "id",
      header: "",
      cell: ({ getValue, row }) => {
        const shop = row.original;

        return (
          <DataTableDropDown
            data={shop}
            routeBase="/shops/"
            onViewPath={(data) => `/dashboard/shops/${data.id}`}
            onEditPath={(data) => `/dashboard/shops/${data.id}/edit`}
            onDeletePath={(data) => `/dashboard/shops/${data.id}/delete`}
          />
        );
      },
    },
  ];

  const pathname = usePathname();

  const [data, setData] = useState<ShopData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const result = await getAllShops();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch shop data:", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredData = data.filter((shop) => {
    const searchTerm = searchQuery.toLowerCase();

    const matchesSearch = shop.name
      .toString()
      .toLowerCase()
      .includes(searchTerm);

    return matchesSearch;
  });

  if (loading) {
    return (
      <div>
        <div className="flex w-full flex-row justify-between gap-1">
          <TitleBar title="Shops" link="toAddShop" />
          <div>
            <Link href={`${pathname}/add`}>
              <Button variant="primaryGreen">Add Shop</Button>
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
            <TitleBar title="Shops" link="toAddBooking" />
            <div>
              <Link href={`${pathname}/add`}>
                <Button variant="primaryGreen">Add Shop</Button>
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
          <div className="flex flex-row justify-center gap-3">
            <div className="w-[90%]">
              <DataTable columns={shopColumns} data={filteredData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopHome;
