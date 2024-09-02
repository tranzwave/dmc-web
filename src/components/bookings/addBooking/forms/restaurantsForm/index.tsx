'use client'
import { useEffect, useState } from "react"
import { DataTable } from "~/components/bookings/home/dataTable"
import { restaurantVoucherColumns, Restaurant } from "./columns"
import RestaurantForm from "./restaurantsForm"
import { RestaurantVoucher, useAddBooking } from "~/app/dashboard/bookings/add/context"
import { InsertRestaurantVoucher, InsertRestaurantVoucherLine, SelectMeal, SelectRestaurant } from "~/server/db/schemaTypes"
import { getAllRestaurants } from "~/server/db/queries/booking/restaurantVouchers"

export type RestaurantData = SelectRestaurant & {
    restaurantMeal: SelectMeal[]
}
const RestaurantsTab = () => {
    const [addedRestaurants, setAddedRestaurants] = useState<RestaurantVoucher[]>([])
    const { addRestaurantVoucher,bookingDetails } = useAddBooking();
    const [loading, setLoading] = useState(false);
    const [restaurants, setRestaurants] = useState<RestaurantData[]>([]);
    const [error, setError] = useState<string | null>();

    const updateRestaurants = (data: InsertRestaurantVoucherLine, restaurant:RestaurantData) => {
        // setAddedRestaurants((prev) => [...prev, restaurant]);
        // addRestaurant(restaurant)
        console.log(data)

        const voucher:InsertRestaurantVoucher = {
            restaurantId: restaurant.id,
            bookingLineId:"",
            coordinatorId:bookingDetails.general.marketingManager
        }

        const restaurantVoucher: RestaurantVoucher = {
            restaurant: restaurant,
            voucher: voucher,
            voucherLines: [data]
        }

        addRestaurantVoucher(restaurantVoucher)
    }

    const getRestaurants = async()=>{
        setLoading(true);

    try {

      const response = await getAllRestaurants();

      if (!response) {
        throw new Error(`Error: Couldn't get hotels`);
      }
      console.log("Fetched Restaurants:", response);

      setRestaurants(response);
      setLoading(false)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error("Error:", error);
    }
    }

    useEffect(() => {
        getRestaurants();
      }, []);

      if (loading) {
        return <div>Loading</div>;
      }
    return (
        <div className="flex flex-col gap-3">
            <div className='flex flex-row gap-2 justify-center mx-9'>
                <div className='w-[25%]'>
                    <div className='card'>
                        Calendar
                    </div>
                </div>
                <div className='card w-[70%] space-y-6'>
                    <div className='card-title'>Restaurants Information</div>
                    {restaurants && (
                        <RestaurantForm onAddRestaurant={updateRestaurants} restaurants = {restaurants} />
                    )}
                </div>
            </div>
            <div className='flex flex-row gap-2 justify-center mx-9'>
                <div className='w-full'>
                    <DataTable columns={restaurantVoucherColumns} data={bookingDetails.restaurants} />
                </div>
            </div>
        </div>
    );
}

export default RestaurantsTab;
