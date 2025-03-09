"use client";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import TitleBar from "~/components/common/titleBar";
import ContactBox from "~/components/ui/content-box";
import { StatsCard } from "~/components/ui/stats-card";
import { getRestaurantVendorById, getRestaurantVouchersForVendor } from "~/server/db/queries/restaurants";
import { SelectRestaurant, SelectRestaurantVoucher } from "~/server/db/schemaTypes";
import { RestaurantData } from "../page";
import LoadingLayout from "~/components/common/dashboardLoading";
import { formatDate } from "date-fns";

export type FetchedRestaurantVendorData = Awaited<ReturnType<typeof getRestaurantVendorById>>;

export type Restaurant = SelectRestaurant & {
  // activityType: SelectActivityType
}

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
        if(!result) {
          throw new Error("Couldn't find restaurant vendor");
        }
        setRestaurant(result);
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
    return <div>
      <LoadingLayout/>
    </div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // if (!activityVouchers) {
  //   return <div>No activity found with the given ID.</div>;
  // }
  if (!restaurant) {
    return <div></div>;
  }
  return (
    <div className="flex flex-col gap-3 w-full justify-between">

      <TitleBar title={`Restaurant - ${restaurant.name}`} link="toAddRestaurant" />
      <div className="mx-9 flex flex-row justify-between">
        <div className="w-[30%]">
          <div className="w-full">
            <ContactBox
              title={restaurant.name }
              description="This is the overview page of the selected restaurant."
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
          <div>Bookings</div>
          <DataTable columns={RestaurantVoucherColumns} data={data} />

          <div>Booking Stats</div>
          <div className="col-span-3 flex justify-between gap-6">
            <StatsCard label="Inprogress Vouchers" value={data.filter(v => v.status === "inprogress").length} />
            <StatsCard label="Confirmed Vouchers" value={data.filter(v => v.status === "vendorConfirmed").length} />
            <StatsCard label="Cancelled Vouchers" value={data.filter(v => v.status === "cancelled").length} />
          </div>

          {/* <div>Trip History</div>
          <DataTable columns={RestaurantVoucherColumns} data={data} /> */}
        </div>
      </div>
    </div>
  );
};

export default Page;


const RestaurantVoucherColumns: ColumnDef<SelectRestaurantVoucher>[] = [
  {
    header: "Booking ID",
    accessorFn: (row) => row.bookingLineId,
  },
  {
    header: "Created At",
    accessorFn: (row) => formatDate(row.createdAt?.toDateString() ?? "", "dd/MM/yyyy"),
  },
  { 
    header: "Status",
    accessorFn: (row) => row.status,
  }

];
