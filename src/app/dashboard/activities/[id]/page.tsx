"use client";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Booking, columns } from "~/components/bookings/home/columns";
import { DataTable } from "~/components/bookings/home/dataTable";
import TitleBar from "~/components/common/titleBar";
import ContactBox from "~/components/ui/content-box";
import { StatsCard } from "~/components/ui/stats-card";
import { Activity, getActivityData, getData } from "~/lib/api";
import { getActivityVendorById, getActivityVouchersForVendor, getAllActivityVendors } from "~/server/db/queries/activities";
import { SelectActivityVoucher } from "~/server/db/schemaTypes";
import { ActivityVendorData } from "../page";

const Page = ({ params }: { params: { id: string } }) => {
  const [activityVendor, setActivityVendor] = useState<ActivityVendorData | null>(null);
  const [data, setData] = useState<SelectActivityVoucher[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    async function fetchActivityVoucherDetails() {
      try {
        setLoading(true);
        const vouchers = await getActivityVouchersForVendor(params.id);
        setData(vouchers)
      } catch (error) {
        console.error("Failed to fetch activity details:", error);
        setError("Failed to load activity details.");
      } finally {
        setLoading(false);
      }
    }

    fetchActivityVoucherDetails();
  }, [params.id]);

  useEffect(() => {
    async function fetchVendorData() {
      try {
        setLoading(true);
        const result = await getActivityVendorById(params.id);
        setActivityVendor(result ?? null);
      } catch (error) {
        console.error("Failed to fetch activity data:", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    }

    fetchVendorData();
  }, []);

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
          <DataTable columns={activityVoucherColumns} data={data} />

          <div>Booking History</div>
          <div className="col-span-3 flex justify-between gap-6">
            <StatsCard label="5 Star ratings" value="10" />
            <StatsCard label="Bookings Completed" value="20" />
            <StatsCard label="Upcoming Bookings" value="5" />
          </div>

          <div>Trip History</div>
          <DataTable columns={activityVoucherColumns} data={data} />
        </div>
      </div>
    </div>
  );
};

export default Page;


export const activityVoucherColumns: ColumnDef<SelectActivityVoucher>[] = [
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
