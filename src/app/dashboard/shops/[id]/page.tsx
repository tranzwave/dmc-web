"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import TitleBar from "~/components/common/titleBar";
import ContactBox from "~/components/ui/content-box";
import { StatsCard } from "~/components/ui/stats-card";
import { getShopDataById } from "~/server/db/queries/shops";
import { SelectShopShopType, SelectShopType, SelectShopVoucher } from "~/server/db/schemaTypes";

export type FetchedShopData = Awaited<ReturnType<typeof getShopDataById>>;


export type ShopType = SelectShopShopType & {
    shopType: SelectShopType
}

const Shop = ({ params }: { params: { id: string } }) => {

    const shopVoucherColumns: ColumnDef<SelectShopVoucher>[] = [
        {
          header: "Shop Type",
          accessorFn: row => row.shopType
        },
        {
          header: "Date",
          accessorFn: row => row.date
        },
        {
            header: "Time",
            accessorFn: row => row.time
        },
        {
            header: "Participant Count",
            accessorFn: row => row.participantsCount
        }
      ];

      const shopTypeColumns: ColumnDef<ShopType>[] = [
        {
          header: "Shop Type",
          accessorFn: (row) => row.shopType.name,
        },
      ];

  const [shopVendor, setShopVendor] = useState<FetchedShopData | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    async function fetchShopData() {
      try {
        setLoading(true);
        const result = await getShopDataById(params.id);
        setShopVendor(result ?? null);
      } catch (error) {
        console.error("Failed to fetch shop data:", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    }
    fetchShopData();
  }, [params.id]);

  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!shopVendor) {
    return <div>No shop found with the given ID.</div>;
  }

  return (
    <div className="flex flex-col gap-3 w-full justify-between">

      <TitleBar title={`Shop - ${shopVendor.name}`} link="toAddActivity" />
      <div className="mx-9 flex flex-row justify-between">
        <div className="w-[30%]">
          <div className="w-full">
            <ContactBox
              title={shopVendor.name }
              description="Egestas elit dui scelerisque ut eu purus aliquam vitae habitasse."
              location={shopVendor.city.name}
              address={
                shopVendor.streetName +
                ", " +
                shopVendor.city.name + ", " + shopVendor.province
              }
              phone={shopVendor.contactNumber}
              email={"No email"}
            />{" "}
          </div>
        </div>
        <div className="card w-[70%] space-y-6">
          <div>Current Booking</div>
          <DataTable columns={shopVoucherColumns} data={shopVendor.shopVouchers} />

          <div>Bookings</div>
          <div className="col-span-3 flex justify-between gap-6">
            <StatsCard label="Provided Activities" value={shopVendor.shopTypes.length} />
            <StatsCard label="Bookings Completed" value={shopVendor.shopVouchers.filter(v => v.status == "confirmed").length} />
            <StatsCard label="Upcoming Bookings" value={shopVendor.shopVouchers.length} />
          </div>

          <div>Provided Activities</div>
          <DataTable columns={shopTypeColumns} data={shopVendor.shopTypes} />
        </div>
      </div>
    </div>  
    );
}

export default Shop