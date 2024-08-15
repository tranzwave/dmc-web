"use client";
import { useEffect, useState } from "react";
import { Booking, columns } from "~/components/bookings/home/columns";
import { DataTable } from "~/components/bookings/home/dataTable";
import TitleBar from "~/components/common/titleBar";
import ContactBox from "~/components/ui/content-box";
import { StatsCard } from "~/components/ui/stats-card";
import { Activity, getActivityData, getData } from "~/lib/api";

const Page = ({ params }: { params: { id: string } }) => {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [data, setData] = useState<Booking[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchActivityDetails() {
      try {
        setLoading(true);
        const activities = await getActivityData();
        const selectedActivity = activities.find(
          (activity) => activity.id.toString() === params.id,
        );
        setActivity(selectedActivity ?? null);
      } catch (error) {
        console.error("Failed to fetch activity details:", error);
        setError("Failed to load activity details.");
      } finally {
        setLoading(false);
      }
    }

    fetchActivityDetails();
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

  if (!activity) {
    return <div>No activity found with the given ID.</div>;
  }

  return (
    <div className="flex flex-col gap-3 w-full justify-between">

      <TitleBar title={`Activity  ${params.id}`} link="toAddActivity" />
      <div className="mx-9 flex flex-row justify-between">
        <div className="w-[30%]">
          <div className="w-full">
            <ContactBox
              title={activity.general.activity}
              description="Egestas elit dui scelerisque ut eu purus aliquam vitae habitasse."
              location={activity.general.address.city}
              address={
                activity.general.address.streetName +
                ", " +
                activity.general.address.city
              }
              phone={activity.general.primaryContactNumber}
              email={activity.general.primaryEmail}
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
