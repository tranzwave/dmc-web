"use client";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import TitleBar from "~/components/common/titleBar";
import ContactBox from "~/components/ui/content-box";
import { StatsCard } from "~/components/ui/stats-card";
import { getActivityVendorDataById } from "~/server/db/queries/activities";
import { SelectActivity, SelectActivityType, SelectActivityVoucher } from "~/server/db/schemaTypes";

export type FetchedActivityVendorData = Awaited<ReturnType<typeof getActivityVendorDataById>>;

export type Activity = SelectActivity & {
  activityType: SelectActivityType
}

const Page = ({ params }: { params: { id: string } }) => {

  const activityVoucherColumns: ColumnDef<SelectActivityVoucher>[] = [
    {
      header: "Activity",
      accessorFn: (row) => row.activityName,
    },
    {
      header: "Date",
      accessorFn: (row) => row.date,
    },
    {
      header: "Time",
      accessorFn: (row) => row.time,
    },
    {
      header: "Participant Count",
      accessorFn: (row) => row.participantsCount
    },
  
  ];

  const activityTypeColumns: ColumnDef<Activity>[] = [
    {
      header: "Activity Type",
      accessorFn: (row) => row.activityType.name,
    },
    {
      header: "Activity",
      accessorFn: (row) => row.name,
    },
    {
      header: "Capacity",
      accessorFn: (row) => row.capacity,
    }
  ];
  const [activityVendor, setActivityVendor] = useState<FetchedActivityVendorData | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    async function fetchVendorData() {
      try {
        setLoading(true);
        const result = await getActivityVendorDataById(params.id);
        setActivityVendor(result ?? null);
      } catch (error) {
        console.error("Failed to fetch activity data:", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    }

    fetchVendorData();
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // if (!activityVouchers) {
  //   return <div>No activity found with the given ID.</div>;
  // }
  if (!activityVendor) {
    return <div>No vendor found with the given ID.</div>;
  }
  return (
    <div className="flex flex-col gap-3 w-full justify-between">

      <TitleBar title={`Activity Vendor - ${activityVendor.name}`} link="toAddActivity" />
      <div className="mx-9 flex flex-row justify-between">
        <div className="w-[30%]">
          <div className="w-full">
            <ContactBox
              title={activityVendor.name }
              description="Egestas elit dui scelerisque ut eu purus aliquam vitae habitasse."
              location={activityVendor.city.name}
              address={
                activityVendor.streetName +
                ", " +
                activityVendor.city.name + ", " + activityVendor.province
              }
              phone={activityVendor.contactNumber}
              email={"No email"}
            />{" "}
          </div>
        </div>
        <div className="card w-[70%] space-y-6">
          <div>Current Booking</div>
          <DataTable columns={activityVoucherColumns} data={activityVendor.activityVoucher} />

          <div>Bookings</div>
          <div className="col-span-3 flex justify-between gap-6">
            <StatsCard label="Provided Activities" value={activityVendor.activity.length} />
            <StatsCard label="Bookings Completed" value={activityVendor.activityVoucher.filter(v => v.status == "confirmed").length} />
            <StatsCard label="Upcoming Bookings" value={activityVendor.activityVoucher.length} />
          </div>

          <div>Provided Activities</div>
          <DataTable columns={activityTypeColumns} data={activityVendor.activity} />
        </div>
      </div>
    </div>
  );
};
 export default Page;


