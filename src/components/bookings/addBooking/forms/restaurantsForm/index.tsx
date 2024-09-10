"use client";
import { useEffect, useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import { restaurantVoucherColumns, Restaurant } from "./columns";
import RestaurantForm from "./restaurantsForm";
import {
  RestaurantVoucher,
  useAddBooking,
} from "~/app/dashboard/bookings/add/context";
import {
  InsertRestaurantVoucher,
  InsertRestaurantVoucherLine,
  SelectMeal,
  SelectRestaurant,
} from "~/server/db/schemaTypes";
import { getAllRestaurants } from "~/server/db/queries/booking/restaurantVouchers";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { Calendar } from "~/components/ui/calendar";

export type RestaurantData = SelectRestaurant & {
  restaurantMeal: SelectMeal[];
};
const RestaurantsTab = () => {
  const [addedRestaurants, setAddedRestaurants] = useState<RestaurantVoucher[]>(
    [],
  );
  const { addRestaurantVoucher, bookingDetails, setActiveTab } =
    useAddBooking();
  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState<RestaurantData[]>([]);
  const [error, setError] = useState<string | null>();
  const { toast } = useToast();

  const updateRestaurants = (
    data: InsertRestaurantVoucherLine,
    restaurant: RestaurantData,
  ) => {
    // setAddedRestaurants((prev) => [...prev, restaurant]);
    // addRestaurant(restaurant)
    console.log(data);

    const voucher: InsertRestaurantVoucher = {
      restaurantId: restaurant.id,
      bookingLineId: "",
      coordinatorId: bookingDetails.general.marketingManager,
    };

    const restaurantVoucher: RestaurantVoucher = {
      restaurant: restaurant,
      voucher: voucher,
      voucherLines: [data],
    };

    addRestaurantVoucher(restaurantVoucher);
  };

  const getRestaurants = async () => {
    setLoading(true);

    try {
      const response = await getAllRestaurants();

      if (!response) {
        throw new Error(`Error: Couldn't get hotels`);
      }
      console.log("Fetched Restaurants:", response);

      setRestaurants(response);
      setLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if(!bookingDetails.general.includes.restaurants){
      setActiveTab("activities")
      return ()=>{console.log("Return")};
    }
    getRestaurants();
  }, []);

  const onNextClick = () => {
    console.log(bookingDetails);
    if (bookingDetails.restaurants.length > 0) {
      setActiveTab("activities");
    } else {
      toast({
        title: "Uh Oh!",
        description: "You must add restaurants to continue",
      });
    }
  };

  if (loading) {
    return <div>Loading</div>;
  }
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="flex w-full flex-row justify-center gap-3">
      <Calendar
              mode="range"
              selected={{
                from: new Date(bookingDetails.general.startDate),
                to: new Date(bookingDetails.general.endDate),
              }}
              className="rounded-md"
            />
        <div className="card w-full space-y-6">
          <div className="card-title">Restaurants Information</div>
          {restaurants && (
            <RestaurantForm
              onAddRestaurant={updateRestaurants}
              restaurants={restaurants}
            />
          )}
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-3">
        <div className="w-full">
          <DataTable
            columns={restaurantVoucherColumns}
            data={bookingDetails.restaurants}
          />
        </div>
        <div className="flex w-full justify-end">
          <Button variant={"primaryGreen"} onClick={onNextClick}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantsTab;
