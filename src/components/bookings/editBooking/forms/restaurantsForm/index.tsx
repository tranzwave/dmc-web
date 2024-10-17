"use client";
import { useEffect, useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import { restaurantVoucherColumns, Restaurant } from "./columns";
import RestaurantForm from "./restaurantsForm";
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
import {
  RestaurantVoucher,
  useEditBooking,
} from "~/app/dashboard/bookings/[id]/edit/context";
import { LoaderCircle } from "lucide-react";
import { addRestaurantVoucherLinesToBooking } from "~/server/db/queries/booking";
import { usePathname } from "next/navigation";

export type RestaurantData = SelectRestaurant & {
  restaurantMeal: SelectMeal[];
};
const RestaurantsTab = () => {
  const [addedRestaurants, setAddedRestaurants] = useState<RestaurantVoucher[]>(
    [],
  );
  const { addRestaurantVoucher, bookingDetails, setActiveTab } =
    useEditBooking();
  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState<RestaurantData[]>([]);
  const [error, setError] = useState<string | null>();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [voucherIdToEdit, setVoucherIdToEdit] = useState<string>()

  const pathname = usePathname();
  const bookingLineId = pathname.split("/")[3];

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

    // onSaveClick();
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
    if (!bookingDetails.general.includes.restaurants) {
      setActiveTab("activities");
      return () => {
        console.log("Return");
      };
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

  const onSaveClick = async () => {
    console.log(bookingDetails.restaurants);
    const newVouchers = bookingDetails.restaurants.filter((v) =>
      v.voucherLines[0]?.id ? false : true,
    );

    if (newVouchers.length == 0) {
      toast({
        title: "Uh Oh!",
        description: "No new vouchers to add!",
      });

      return;
    }
    try {
      setSaving(true);
      console.log(newVouchers)
      const newResponse = await addRestaurantVoucherLinesToBooking(
        newVouchers,
        bookingLineId ?? "",
        bookingDetails.general.marketingManager,
      );

      if (!newResponse) {
        throw new Error(`Error: Couldn't add restaurant vouchers`);
      }
      console.log("Fetched Restaurants:", newResponse);

      setSaving(false);
      toast({
        title: "Success",
        description: "Restaurant Vouchers Added!",
      });
    } catch (error) {
      if (error instanceof Error) {
        // setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error("Error:", error);
      setSaving(false);
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
              defaultValues={null}
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
        <Button variant={"primaryGreen"} onClick={onSaveClick} disabled={saving}>
            {saving ? (<div className="flex flex-row gap-1"><div><LoaderCircle className="animate-spin" size={10}/></div>Saving</div>): ('Save')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantsTab;
