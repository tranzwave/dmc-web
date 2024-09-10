"use client";
import { useEffect, useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import { columns, Shop } from "./columns";
import ShopsForm from "./shopsForm";
import { SearchIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  ShopVoucher,
  useAddBooking,
} from "~/app/dashboard/bookings/add/context";
import { ShopsSearchParams } from "~/lib/api";
import { SelectCity, SelectShopType } from "~/server/db/schemaTypes";
import { getAllShopTypes } from "~/server/db/queries/shops";
import { getAllCities } from "~/server/db/queries/activities";
import { useToast } from "~/hooks/use-toast";
import { Calendar } from "~/components/ui/calendar";

const ShopsTab = () => {
  const { addShop, bookingDetails, setActiveTab } = useAddBooking();
  const [searchResults, setSearchResults] = useState<Shop[]>([]);
  const [searchDetails, setSearchDetails] = useState<Shop | null>(null);
  const [cities, setCities] = useState<SelectCity[]>([]);
  const [error, setError] = useState<string | null>();
  const [loading, setLoading] = useState(false);
  const [shopTypes, setShopTypes] = useState<SelectShopType[]>([]);
  const {toast} = useToast()

  const handleRowClick = (shop: ShopVoucher) => {
    if (searchDetails) {
      // setSearchDetails(shop)
      addShop(shop);
    }
  };

  const updateShopVouchers = (shop: ShopVoucher) => {
    addShop(shop);
  };

  // Function to search for drivers based on transport data
  const fetchShops = async (searchParams: ShopsSearchParams) => {
    // try {
    //     const results = await searchShopsData(searchParams);
    //     setSearchResults(results);
    // } catch (error) {
    //     console.error("Error searching for drivers:", error);
    // }
  };

  const fetchData = async () => {
    try {
      // Run both requests in parallel
      setLoading(true);
      //TODO: Dynamic country code
      const [shopTypeResponse, cityResponse] = await Promise.all([
        getAllShopTypes(),
        getAllCities("LK"),
      ]);

      // Check for errors in the responses
      if (!shopTypeResponse) {
        throw new Error("Error fetching agents");
      }

      if (!cityResponse) {
        throw new Error("Error fetching users");
      }

      console.log("Fetched Shop Types:", shopTypeResponse);
      console.log("Fetched Cities:", cityResponse);

      // Set states after successful fetch
      setShopTypes(shopTypeResponse);
      setCities(cityResponse);

      setLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error("Error fetching data:", error);
    }
  };

  const onNextClick = () => {
    console.log(bookingDetails)
    if (bookingDetails.shops.length > 0) {
      setActiveTab("submit");
    } else {
      toast({
        title: "Uh Oh!",
        description: "You must add shops to continue",
      });
    }
  };

  useEffect(() => {
    if(!bookingDetails.general.includes.shops){
      setActiveTab("submit")
      return ()=>{console.log("Return")};
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div className="mx-9 flex flex-row justify-center gap-2">
        <div className="w-[25%]">
          <div className="card w-[85%]">
          <Calendar
            mode="range"
            selected={{from: new Date(bookingDetails.general.startDate), to:new Date(bookingDetails.general.endDate)}}
            className="rounded-md"
          />
          </div>
        </div>
        <div className="card w-[70%] space-y-6">
          <div className="card-title">Shop Information</div>
          <ShopsForm
            onAddShop={updateShopVouchers}
            shopTypes={shopTypes}
            cities={cities}
          />
        </div>
      </div>
      <div className="w-full">
        <DataTable columns={columns} data={bookingDetails.shops} />
      </div>
      <div className="flex w-full justify-end">
        <Button variant={"primaryGreen"} onClick={onNextClick}>Next</Button>
      </div>
    </div>
  );
};

export default ShopsTab;
