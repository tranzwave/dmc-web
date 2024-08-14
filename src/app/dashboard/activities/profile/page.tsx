"use client"; // Add this line to make the component a Client Component

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import TitleBar from "~/components/common/titleBar";
import { StatsCard } from "~/components/ui/stats-card";
import { getActivityData } from "~/lib/api";
import { Activity, activityColumns } from "~/lib/types/activity/type";

const Page = ({ selectedActivity }: { selectedActivity: Activity }) => {
      const searchParams = useSearchParams();

  const [data, setData] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const result = await getActivityData();
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

  return (
    <div>
      <TitleBar title="Activity" link="toAddActivity" />
      <div className="mx-9 flex flex-row justify-between">
        <div className="w-[35%]">
          <div className="card w-full">Profile</div>
        <p><strong>Activity:</strong> {selectedActivity.general.activity}</p>

        </div>
        <div className="card w-[60%] space-y-6">
          <div>Current Booking</div>
          <DataTable columns={activityColumns} data={data} />

          <div>Booking History</div>
          <div className="col-span-3 flex justify-between gap-6">
            <StatsCard label="5 Star ratings" value="10" />
            <StatsCard label="Bookings Completed" value="20" />
            <StatsCard label="Up Coming Bookings" value="5" />
          </div>

          <div>Trip History</div>
          <DataTable columns={activityColumns} data={data} />
        </div>
      </div>
    </div>
  );
};

export default Page;
