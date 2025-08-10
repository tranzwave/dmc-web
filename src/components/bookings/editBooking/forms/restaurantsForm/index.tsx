"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  RestaurantVoucher,
  useEditBooking,
} from "~/app/dashboard/bookings/[id]/edit/context";
import { DataTableWithActions } from "~/components/common/dataTableWithActions";
import DeletePopup from "~/components/common/deletePopup";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { useToast } from "~/hooks/use-toast";
import { addRestaurantVoucherLinesToBooking, deleteRestaurantVoucherLine } from "~/server/db/queries/booking";
import { getAllRestaurants } from "~/server/db/queries/booking/restaurantVouchers";
import {
  InsertRestaurantVoucher,
  InsertRestaurantVoucherLine,
  SelectMeal,
  SelectRestaurant,
} from "~/server/db/schemaTypes";
import { restaurantVoucherColumns } from "./columns";
import RestaurantForm from "./restaurantsForm";
import { useOrganization } from "@clerk/nextjs";

export type RestaurantData = SelectRestaurant & {
  restaurantMeal: SelectMeal[];
};
const RestaurantsTab = () => {
  const [addedRestaurants, setAddedRestaurants] = useState<RestaurantVoucher[]>(
    [],
  );
  const { addRestaurantVoucher, bookingDetails, setActiveTab, editRestaurantVoucher, deleteRestaurantVoucher, updateTriggerRefetch } =
    useEditBooking();
  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState<RestaurantData[]>([]);
  const [error, setError] = useState<string | null>();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [voucherIdToEdit, setVoucherIdToEdit] = useState<string>()

  const [indexToEdit, setIndexToEdit] = useState<number>();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isExistingVoucherDelete, setIsExistingVoucherDelete] = useState(false);
  const [isUnsavedVoucherDelete, setIsUnsavedVoucherDelete] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<RestaurantVoucher>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [triggerRefetch, setTriggerRefetch] = useState(false);
  const [voucherToEdit, setVoucherToEdit] = useState<RestaurantVoucher | null>()
  const [defaultValues, setDefaultValues] = useState<
  | (InsertRestaurantVoucherLine & {
      restaurant: SelectRestaurant;
    })
  | null
>();

  const pathname = usePathname();
  const bookingLineId = pathname.split("/")[3];
  const router = useRouter()
  const {organization, isLoaded} = useOrganization();

  const updateRestaurants = async(
    data: InsertRestaurantVoucherLine,
    restaurant: RestaurantData,
  ) => {
    if(voucherToEdit !== null){
      handleExistingVoucherDelete()
      setVoucherToEdit(null)
    }
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

    try {
      setSaving(true)
      const newResponse = await addRestaurantVoucherLinesToBooking(
        [restaurantVoucher],
        bookingLineId ?? "",
        bookingDetails.general.marketingManager,
        bookingDetails.restaurants.length + 1
      )

      if(!newResponse){
        throw new Error(`Couldn't add restaurant voucher`)
      }
      toast({
        title: "Success",
        description: "Restaurant Vouchers Added!",
      });
      setSaving(false);
        updateTriggerRefetch();
    } catch (error) {
      if (error instanceof Error) {
      } else {
        setError("An unknown error occurred");
      }
      console.error("Error:", error);
      setSaving(false);
    }

    // onSaveClick();
  };
  const onEdit = (data: RestaurantVoucher) => {
    if(data.voucher.status !== "inprogress"){
      toast({
        title: "Uh Oh!",
        description: "You've already proceeded with this voucher. Please go to send vouchers and amend!",
      });
      return
    }
    setSelectedVoucher(data)
    const index = bookingDetails.restaurants.findIndex((v) => v == data);
    setIndexToEdit(index);
    if (!data.voucherLines[0]) {
      return;
    }
    setDefaultValues({ ...data.voucherLines[0], restaurant: data.restaurant });

  };

  const getRestaurants = async () => {
    setLoading(true);

    try {

      if(!organization){
        throw new Error("Organization not found")
      }
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
    // if (!bookingDetails.general.includes.restaurants) {
    //   setActiveTab("activities");
    //   return () => {
    //     console.log("Return");
    //   };
    // }
    getRestaurants();
  }, [router]);

  const onDelete = async (data: RestaurantVoucher) => {
    setSelectedVoucher(data);
    if (data.voucher.status) {
      setIsExistingVoucherDelete(true);
      return;
    }
    setIsUnsavedVoucherDelete(true);
    setIsDeleteOpen(true);
  };

  const handleExistingVoucherDelete = async () => {
    if (selectedVoucher && selectedVoucher.voucher.status) {
      if (selectedVoucher.voucher.status != "inprogress") {
        toast({
          title: "Uh Oh",
          description: `You cant delete this voucher. It's already ${selectedVoucher.voucher.status}!. Please go to proceed vouchers and send the cancellation voucher first`,
        });
        return;
      }
      try {
        setIsDeleting(true);
        const deletedData = await deleteRestaurantVoucherLine(
          selectedVoucher?.voucherLines[0]?.id ?? "",
        );
        if (!deletedData) {
          throw new Error("Couldn't delete voucher");
        }

        deleteVoucherLineFromLocalContext();
        setIsDeleting(false);
        toast({
          title: "Success",
          description: `Successfully deleted the voucher`,
        });
        
        
      } catch (error) {
        toast({
          title: "Uh Oh",
          description: `Couldn't delete this voucher`,
        });
        setIsDeleting(false);
      }
      return;
    }
  };

  const deleteVoucherLineFromLocalContext = () => {
    setIsDeleting(true);
    const index = bookingDetails.restaurants.findIndex(
      (v) => v == selectedVoucher,
    );
    deleteRestaurantVoucher(index, selectedVoucher?.voucherLines[0]?.id ?? "");
    // deleteHotelVoucher(index, selectedVoucher?.voucherLines[0]?.id ?? "");
    
    setIsDeleting(false);
  };

  if (loading || !isLoaded) {
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
              defaultValues={defaultValues}
              lockedVendorId={selectedVoucher?.restaurant.id ?? ""}
            />
          )}
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-3">
        <div className="w-full">
          {/* <DataTable
            columns={restaurantVoucherColumns}
            data={bookingDetails.restaurants}
          /> */}
          <DataTableWithActions
          columns={restaurantVoucherColumns}
          data={bookingDetails.restaurants}
          onEdit={onEdit}
          onDelete={onDelete}
          onRowClick={() => {
            console.log("row");
          }}
          />
        </div>
        <div className="flex w-full justify-end">
        <Link href={`${pathname.split("edit")[0]}/tasks?tab=restaurants`}>
            <Button variant={"primaryGreen"}>Send Vouchers</Button>
          </Link>
        </div>
      </div>
      <DeletePopup
        itemName={`Voucher for ${selectedVoucher?.restaurant.name}`}
        onDelete={deleteVoucherLineFromLocalContext}
        isOpen={isUnsavedVoucherDelete}
        setIsOpen={setIsUnsavedVoucherDelete}
        isDeleting={isDeleting}
      />

      <DeletePopup
        itemName={`Voucher for ${selectedVoucher?.restaurant.name}`}
        onDelete={handleExistingVoucherDelete}
        isOpen={isExistingVoucherDelete}
        setIsOpen={setIsExistingVoucherDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default RestaurantsTab;
