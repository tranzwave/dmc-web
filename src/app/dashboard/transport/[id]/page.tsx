"use client";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import TitleBar from "~/components/common/titleBar";
import ContactBox from "~/components/ui/content-box";
import { StatsCard } from "~/components/ui/stats-card";
import { DriverDTO } from "~/lib/types/driver/type";
import { formatDate } from "~/lib/utils/index";
import {
  getDriverByIdQuery,
  getTransportVouchersForDriver,
} from "~/server/db/queries/transport";
import { SelectTransportVoucher } from "~/server/db/schemaTypes";

const Page = ({ params }: { params: { id: string } }) => {
  const [driver, setDriver] = useState<DriverDTO | null>(null);
  const [data, setData] = useState<SelectTransportVoucher[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentStarttDate, setCurrentStartDate] = useState<string | null>(null);
  const [currentEndDate, setCurrentEndDate] = useState<string | null>(null);

  const parseDate = (dateString: string) => new Date(dateString);

  const filteredCurrentData = data.filter((transport) => {
    const currentStartDate = transport.startDate;
    const currentEndDate = transport.endDate;

    const matchesCurrentStartDate = currentStarttDate ? currentStartDate >= currentStarttDate : true;
    const matchesCurrentEndDate = currentEndDate ? currentEndDate <= currentEndDate : true;

    return matchesCurrentStartDate && matchesCurrentEndDate;
  });

  useEffect(() => {
    async function fetchDriverDetails() {
      try {
        setLoading(true);
        const selectedDriver = await getDriverByIdQuery(params.id);
        setDriver(selectedDriver ?? null);
      } catch (error) {
        console.error("Failed to fetch driver details:", error);
        setError("Failed to load driver details.");
      } finally {
        setLoading(false);
      }
    }

    fetchDriverDetails();
  }, [params.id]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const result = await getTransportVouchersForDriver(params.id);
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!driver) {
    return <div>No driver found with the given ID.</div>;
  }
  const driverVoucherColumns: ColumnDef<SelectTransportVoucher>[] = [
    {
      accessorKey: "startDate",
      header: "Start Date",
      accessorFn: (row) => formatDate(row.startDate.toString()),
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      accessorFn: (row) => formatDate(row.endDate.toString()),
    },
    {
      header: "Vehicle Type",
      accessorFn: (row) => row.vehicleType,
    },
    {
      header: "Remarks",
      accessorFn: (row) => row.remarks,
    },
    {
      header: "Rate",
      accessorFn: (row) => row.rate,
    },
  ];

  return (
    <div className="flex w-full flex-col justify-between gap-3">
      <TitleBar title={`Driver - ${driver.name}`} link="toAddTransport" />
      <div className="mx-9 flex flex-row justify-between">
        <div className="w-[30%]">
          <div className="w-full">
            <ContactBox
              title={driver.name}
              description="Egestas elit dui scelerisque ut eu purus aliquam vitae habitasse."
              location={driver.city.name}
              address={driver.streetName + ", " + driver.city.name}
              phone={driver.primaryContactNumber}
              email={driver.primaryEmail}
            />{" "}
          </div>
        </div>
        <div className="card w-[70%] space-y-6">
          <div>Current Booking</div>
          <div className="flex gap-5">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <label htmlFor="start-date" className="mb-1 block">
                Start Date
              </label>
              <input
                type="date"
                value={currentStarttDate ?? ""}
                onChange={(e) => setCurrentStartDate(e.target.value)}
                className="rounded-md border p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-500">
              <label htmlFor="start-date" className="mb-1 block">
                End Date
              </label>
              <input
                type="date"
                value={currentEndDate ?? ""}
                onChange={(e) => setCurrentEndDate(e.target.value)}
                className="rounded-md border p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>
          <DataTable columns={driverVoucherColumns} data={filteredCurrentData} />

          <div>Booking History</div>
          <div className="col-span-3 flex justify-between gap-6">
            <StatsCard label="Fee Per KM (LKR)" value={driver.feePerKM ?? 0} />
            <StatsCard label="Bookings Completed" value={data.length} />
            <StatsCard label="Upcoming Bookings" value={data.length} />
          </div>

          <div>Trip History</div>

          <div className="flex gap-5">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <label htmlFor="start-date" className="mb-1 block">
                Start Date
              </label>
              <input
                type="date"
                value={currentStarttDate ?? ""}
                onChange={(e) => setCurrentStartDate(e.target.value)}
                className="rounded-md border p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-500">
              <label htmlFor="start-date" className="mb-1 block">
                End Date
              </label>
              <input
                type="date"
                value={currentEndDate ?? ""}
                onChange={(e) => setCurrentEndDate(e.target.value)}
                className="rounded-md border p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>
          
          <DataTable columns={driverVoucherColumns} data={filteredCurrentData} />
        </div>
      </div>
    </div>
  );
};

export default Page;
