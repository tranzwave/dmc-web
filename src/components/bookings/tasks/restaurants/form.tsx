"use client";
// RestaurantsForm.tsx
import React, { useEffect, useState } from "react"; // Adjust import based on your project structure
import { useToast } from "~/hooks/use-toast";
import { updateRestaurantVoucherAndLine } from "~/server/db/queries/booking";
import { getAllRestaurants } from "~/server/db/queries/booking/restaurantVouchers";
import { InsertRestaurantVoucherLine, SelectRestaurant } from "~/server/db/schemaTypes";
import { RestaurantVoucherData } from ".";
import { RestaurantData } from "../../addBooking/forms/restaurantsForm";
import RestaurantForm from "../../addBooking/forms/restaurantsForm/restaurantsForm";

interface RestaurantsFormProps {
  // selectedItem: SelectRestaurantVoucherLine | undefined; // Ensures it matches the expected type
  defaultValues:
  | (InsertRestaurantVoucherLine & {
      restaurant: SelectRestaurant;
    })
  | null
  | undefined; // Ensures it matches the expected type
  onSave: () => void; // Callback for when saving
  vendor : RestaurantVoucherData
  restaurant: SelectRestaurant[];

}


const RestaurantsVoucherForm: React.FC<RestaurantsFormProps> = ({
  defaultValues,
  onSave,
  vendor,
}) => {
  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState<RestaurantData[]>([]);
  const [error, setError] = useState<string | null>();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);


  const handleSubmit = async (
    data: InsertRestaurantVoucherLine,
    restaurant: SelectRestaurant,
  ) => {
    const voucherId = defaultValues?.restaurantVoucherId;
    const voucherLineId = defaultValues?.id;
  
    try {
      setIsUpdating(true);
      if (!voucherId || !voucherLineId) {
        alert("You can't amend this voucher");
      } else {
        if (restaurant.id !== defaultValues.restaurant.id) {
          toast({
            title: "Uh oh! You can't change the restaurant from this form",
            description:
              "Restaurants can't be changed in the voucher. Please cancel the voucher first!",
          });
          setIsUpdating(false);
          return;
        }
        const updatedVoucherLine = await updateRestaurantVoucherAndLine(
          voucherId, // Voucher ID
          voucherLineId, // Voucher Line ID
          { restaurantId: restaurant.id, status: "amended" },
          {
            adultsCount: data.adultsCount,
            kidsCount: data.kidsCount,
            date: data.date,
            mealType: data.mealType,
            remarks: data.remarks,
          }, // Voucher Line update data
        );
  
        console.log("Updated Voucher Line:", updatedVoucherLine);
        toast({
          title: "Success",
          description: "Voucher has been amended successfully",
        });
        setIsUpdating(false);
      }
    } catch (error) {
      console.error("Error during voucher line update:", error);
      toast({
        title: "Uh oh! You can't amend this restaurant voucher",
        description: "This voucher has not been updated!",
      });
      setIsUpdating(false);
    }
  };
  
  

  
  // Handle form submission
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // Perform form submission logic here
  //   onSave();
  // };

  // const getRestaurants = async () => {
  //   setLoading(true);

  //   try {
  //     const response = await getAllRestaurants();

  //     if (!response) {
  //       throw new Error(`Error: Couldn't get hotels`);
  //     }
  //     console.log("Fetched Restaurants:", response);

  //     setRestaurants(response);
  //     setLoading(false);
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       setError(error.message);
  //     } else {
  //       setError("An unknown error occurred");
  //     }
  //     console.error("Error:", error);
  //   }
  // };



  // useEffect(() => {
  //   console.log(selectedItem);
  //   if(selectedItem){
  //     getRestaurants()
  //   }
  // }, [selectedItem]);


  const getRestaurants = async () => {
    setLoading(true);
    try {
      const response = await getAllRestaurants();
      if (!response) {
        throw new Error(`Error: Couldn't get restaurants`);
      }
      setRestaurants(response);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    console.log("Selected Item updated:", defaultValues);
    if (defaultValues) {
      getRestaurants();
    }
  }, [defaultValues]);
  

  if(!defaultValues){
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
    // <RestaurantForm
    //   defaultValues={
    //     {
    //       adultsCount:selectedItem?.adultsCount ?? 0,
    //       date:selectedItem?.date ?? "",
    //       kidsCount:selectedItem?.kidsCount ?? 0,
    //       mealType:selectedItem?.mealType ?? "",
    //       restaurantVoucherId:selectedItem?.restaurantVoucherId ?? "",
    //       time:selectedItem?.time ?? "",
    //       remarks:selectedItem?.remarks ?? "",

    //     }
    //   }
    //   restaurants={restaurants}
    //   onAddRestaurant={() => {
    //     // console.log("cant add here")
    //     handleSubmit
    //   }}
    //   lockedVendorId={vendor.restaurant.id}
    // />

    <RestaurantForm
      defaultValues={defaultValues ?? null}
      restaurants={restaurants}
      amendment={true}
      isUpdating={isUpdating} 
      onAddRestaurant={handleSubmit}
    />

  );
};

export default RestaurantsVoucherForm;
