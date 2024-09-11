"use client";
// RestaurantsForm.tsx
import React, { useEffect, useState } from "react"; // Adjust import based on your project structure
import { RestaurantVoucherData } from ".";
import RestaurantForm from "../../addBooking/forms/restaurantsForm/restaurantsForm";
import { SelectRestaurant, SelectRestaurantVoucherLine } from "~/server/db/schemaTypes";
import { getAllRestaurants } from "~/server/db/queries/booking/restaurantVouchers";
import { RestaurantData } from "../../addBooking/forms/restaurantsForm";

interface RestaurantsFormProps {
  selectedItem: SelectRestaurantVoucherLine | undefined; // Ensures it matches the expected type
  onSave: () => void; // Callback for when saving
  vendor : RestaurantVoucherData
}

const RestaurantsVoucherForm: React.FC<RestaurantsFormProps> = ({
  selectedItem,
  onSave,
  vendor
}) => {
  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState<RestaurantData[]>([]);
  const [error, setError] = useState<string | null>();

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Perform form submission logic here
    onSave();
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
    console.log(selectedItem);
    if(selectedItem){
      getRestaurants()
    }
  }, [selectedItem]);

  if(!selectedItem){
    return (
      <div>Select a voucher line</div>
    )
  }

  if(loading){
    return (
      <div>Fetching Restaurants</div>
    )
  }

  return (
    <RestaurantForm
      defaultValues={
        {
          adultsCount:selectedItem?.adultsCount ?? 0,
          date:selectedItem?.date ?? "",
          kidsCount:selectedItem?.kidsCount ?? 0,
          mealType:selectedItem?.mealType ?? "",
          restaurantVoucherId:selectedItem?.restaurantVoucherId ?? "",
          time:selectedItem?.time ?? "",
          remarks:selectedItem?.remarks ?? "",

        }
      }
      restaurants={restaurants}
      onAddRestaurant={() => {console.log("cant add here")}}
      lockedVendorId={vendor.restaurant.id}
    />
  );
};

export default RestaurantsVoucherForm;
