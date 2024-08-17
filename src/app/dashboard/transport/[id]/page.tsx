"use client";
import { useEffect, useState } from "react";
import { Booking, columns } from "~/components/bookings/home/columns";
import { DataTable } from "~/components/bookings/home/dataTable";
import TitleBar from "~/components/common/titleBar";
import ContactBox from "~/components/ui/content-box";
import { StatsCard } from "~/components/ui/stats-card";
import { Driver, getData, getTransportData } from "~/lib/api";

const Page = ({ params }: { params: { id: string } }) => {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [data, setData] = useState<Booking[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDriverDetails() {
      try {
        setLoading(true);
        const drivers = await getTransportData();
        const selectedDriver = drivers.find(
          (driver) => driver.id.toString() === params.id,
        );
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
        const result = await getData();
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

  return (
    <div className="flex flex-col gap-3 w-full justify-between">

      <TitleBar title={`Driver  ${params.id}`} link="toAddActivity" />
      <div className="mx-9 flex flex-row justify-between">
        <div className="w-[30%]">
          <div className="w-full">
            <ContactBox
              title={driver.general.name}
              description="Egestas elit dui scelerisque ut eu purus aliquam vitae habitasse."
              location={driver.general.address.city}
              address={
                driver.general.address.streetName +
                ", " +
                driver.general.address.city
              }
              phone={driver.general.primaryContactNumber}
              email={driver.general.primaryEmail}
            />{" "}
          </div>
        </div>
        <div className="card w-[70%] space-y-6">
          <div>Current Booking</div>
          <DataTable columns={columns} data={data} />

          <div>Booking History</div>
          <div className="col-span-3 flex justify-between gap-6">
            <StatsCard label="5 Star ratings" value="10" />
            <StatsCard label="Bookings Completed" value="20" />
            <StatsCard label="Upcoming Bookings" value="5" />
          </div>

          <div>Trip History</div>
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </div>
  );
};

export default Page;
