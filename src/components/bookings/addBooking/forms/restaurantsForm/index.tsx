'use client'
import { useState } from "react"
import { DataTable } from "~/components/bookings/home/dataTable"
import { columns, Restaurant } from "./columns"
import RestaurantForm from "./restaurantsForm"
import { useAddBooking } from "~/app/dashboard/bookings/add/context"

const RestaurantsTab = () => {
    const [addedRestaurants, setAddedRestaurants] = useState<Restaurant[]>([])
    const { addRestaurant,bookingDetails } = useAddBooking();

    const updateRestaurants = (restaurant: Restaurant) => {
        setAddedRestaurants((prev) => [...prev, restaurant]);
        addRestaurant(restaurant)
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
                    <RestaurantForm onAddRestaurant={updateRestaurants} />
                </div>
            </div>
            <div className='flex flex-row gap-2 justify-center mx-9'>
                <div className='w-full'>
                    <DataTable columns={columns} data={bookingDetails.restaurants} />
                </div>
            </div>
        </div>
    );
}

export default RestaurantsTab;
