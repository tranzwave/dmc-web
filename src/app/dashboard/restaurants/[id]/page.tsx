"use client";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import TitleBar from "~/components/common/titleBar";
import ContactBox from "~/components/ui/content-box";
import { StatsCard } from "~/components/ui/stats-card";
import { getRestaurantVendorById, getRestaurantVouchersForVendor } from "~/server/db/queries/restaurants";
import { SelectRestaurantVoucher } from "~/server/db/schemaTypes";
import { RestaurantData } from "../page";

const Page = ({ params }: { params: { id: string } }) => {
  const [restaurant, setRestaurant] = useState<RestaurantData | null>(null);
  const [data, setData] = useState<SelectRestaurantVoucher[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    async function fetchRestaurantVoucherDetails() {
      try {
        setLoading(true);
        const vouchers = await getRestaurantVouchersForVendor(params.id);
        setData(vouchers)
      } catch (error) {
        console.error("Failed to fetch activity details:", error);
        setError("Failed to load activity details.");
      } finally {
        setLoading(false);
      }
    }

    fetchRestaurantVoucherDetails();
  }, [params.id]);

  useEffect(() => {
    async function fetchVendorData() {
      try {
        setLoading(true);
        const result = await getRestaurantVendorById(params.id);
        setRestaurant(result ?? null);
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
  if (!restaurant) {
    return <div>No vendor found with the given ID.</div>;
  }
  return (
    <div className="flex flex-col gap-3 w-full justify-between">

      <TitleBar title={`Restaurant - ${restaurant.name}`} link="toAddRestaurant" />
      <div className="mx-9 flex flex-row justify-between">
        <div className="w-[30%]">
          <div className="w-full">
            <ContactBox
              title={restaurant.name }
              description="Egestas elit dui scelerisque ut eu purus aliquam vitae habitasse."
              location={restaurant.city.name}
              address={
                restaurant.streetName +
                ", " +
                restaurant.city.name + ", " + restaurant.province
              }
              phone={restaurant.contactNumber}
              email={"No email"}
            />{" "}
          </div>
        </div>
        <div className="card w-[70%] space-y-6">
          <div>Current Booking</div>
          <DataTable columns={RestaurantVoucherColumns} data={data} />

          <div>Booking History</div>
          <div className="col-span-3 flex justify-between gap-6">
            <StatsCard label="5 Star ratings" value="10" />
            <StatsCard label="Bookings Completed" value="20" />
            <StatsCard label="Upcoming Bookings" value="5" />
          </div>

          <div>Trip History</div>
          <DataTable columns={RestaurantVoucherColumns} data={data} />
        </div>
      </div>
    </div>
  );
};

export default Page;


export const RestaurantVoucherColumns: ColumnDef<SelectRestaurantVoucher>[] = [
  {
    header: "Restaurant",
    accessorFn: (row) => row.status,
  }

];
