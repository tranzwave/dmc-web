"use client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import LoadingLayout from "~/components/common/dashboardLoading";
import DataTableDropDown from "~/components/common/dataTableDropdown";
import TitleBar from "~/components/common/titleBar";
import { Button } from "~/components/ui/button";
import { getAllAgents } from "~/server/db/queries/agents";
import { SelectAgent } from "~/server/db/schemaTypes";

export type AgentVendorData = SelectAgent & NonNullable<unknown>

const AgentHome = () => {
  const agentVendorColumns: ColumnDef<AgentVendorData>[] = [
    {
      header: "Name",
      accessorFn: (row) => row.name,
    },
    {
      header: "Country",
      accessorFn: (row) => row.countryCode,
    },
    {
      header: "Agency",
      accessorFn: (row) => row.agency,
    },
    {
      header: "Contact Number",
      accessorFn: (row) => row.primaryContactNumber,
    },
    {
      header: "Primary Email",
      accessorFn: (row) => row.email,
    },
    // {
    //     header: "Trips Completed",
    //     accessorFn: row => row.tripsCompleted
    // },

    {
      accessorKey: "id",
      header: "",
      cell: ({ getValue, row }) => {
        const agent = row.original;

        return (
          <DataTableDropDown
            data={agent}
            routeBase="/agents/"
            onViewPath={(data) => `/dashboard/agents/${data.id}`}
            onEditPath={(data) => `/dashboard/agents/${data.id}/edit`}
            onDeletePath={(data) => `/dashboard/agents/${data.id}/delete`}
          />
        );
      },
    },
  ];
  const pathname = usePathname();

  const [data, setData] = useState<SelectAgent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const result = await getAllAgents();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch activity data:", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div>
        <div className="flex w-full flex-row justify-between gap-1">
          <TitleBar title="Agents" link="toAddHotel" />
          <div>
            <Link href={`${pathname}/add`}>
              <Button variant="primaryGreen">Add Agent</Button>
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
            <TitleBar title="Agents" link="toAddBooking" />
            <div>
              <Link href={`${pathname}/add`}>
                <Button variant="primaryGreen">Add Agent</Button>
              </Link>
            </div>
          </div>
          <div className="flex flex-row justify-center gap-3">
            <div className="w-[90%]">
              <DataTable columns={agentVendorColumns} data={data} />
            </div>
            - ;' '
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentHome;
