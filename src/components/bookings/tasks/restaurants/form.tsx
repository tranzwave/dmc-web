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
import { EditBookingProvider } from "~/app/dashboard/bookings/[id]/edit/context";
import { Input } from "~/components/ui/input";

interface RestaurantsFormProps {
  // selectedItem: SelectRestaurantVoucherLine | undefined; // Ensures it matches the expected type
  defaultValues:
  | (InsertRestaurantVoucherLine & {
    restaurant: SelectRestaurant;
  })
  | null
  | undefined; // Ensures it matches the expected type
  onSave: () => void; // Callback for when saving
  vendor: RestaurantVoucherData
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
  const [reasonToAmend, setReasonToAmend] = useState('')


  const handleSubmit = async (
    data: InsertRestaurantVoucherLine,
    restaurant: SelectRestaurant,
  ) => {
    const voucherId = defaultValues?.restaurantVoucherId;
    const voucherLineId = defaultValues?.id;

    if (reasonToAmend == '') {
      toast({
        title: "Uh oh! You can't amend the voucher without a reason",
        description:
          "Please add a reason for your amendment!",
      });

      return
    }

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
          { restaurantId: restaurant.id, status: "amended", reasonToAmend: reasonToAmend },
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
        window.location.reload();
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


  if (!defaultValues) {
    return (
      <div>Select a voucher line</div>
    )
  }

  if (loading) {
    return (
      <div>Fetching Restaurants</div>
    )
  }

  return (

    <EditBookingProvider>
      <div className="flex flex-col gap-2">
        <div className="text-xs font-medium text-neutral-600">
          Note that you can't change the selected restaurant from this amendment
          process. To change the restaurant, you have to cancel the voucher and
          create a new voucher from the add voucher page
        </div>
        <div className="flex flex-col gap-2 my-3">
          <div className="text-base font-normal">Please add a reason for this amendment</div>
          <Input placeholder={'Add a reason to amend'} type="text" className="h-16" onChange={(e) => setReasonToAmend(e.target.value)} />
        </div>
        <RestaurantForm
          defaultValues={defaultValues ?? null}
          restaurants={restaurants}
          amendment={true}
          isUpdating={isUpdating}
          onAddRestaurant={handleSubmit}
          lockedVendorId={defaultValues.restaurant.id}
        />
      </div>
    </EditBookingProvider>



  );
};

export default RestaurantsVoucherForm;
