"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import TitleBar from "~/components/common/titleBar";
import GeneralTab from "~/components/restaurants/addRestaurant/forms/generalForm";
import MealsOfferedTab from "~/components/restaurants/addRestaurant/forms/mealsOfferedForm";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { getRestaurantVendorById } from "~/server/db/queries/restaurants";
import { AddRestaurantProvider, useAddRestaurant } from "../../add/context";
// import { FetchedRestaurantVendorData } from "../page";
import EditRestaurantSubmitForm from "~/components/restaurants/addRestaurant/forms/submitForm/editRestaurantSubmit";
import { FetchedRestaurantVendorData } from "../page";

// export type FetchedRestaurantVendorData = Awaited<ReturnType<typeof getRestaurantVendorById>>;

// // export type RestaurantData = SelectRestaurant & {
// //   // activityType: SelectActivityType
// // }

// export type RestaurantData = SelectRestaurant & {
//   // activityType: SelectActivityType
//   // city:SelectCity;
//   // meals: (SelectMeal & {
//   // })[];
// }



const EditRestaurant = ({ id }: { id: string }) => {
  const pathname = usePathname();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { restaurantDetails, activeTab, setActiveTab, setGeneralDetails, addMeals } = useAddRestaurant();
  const [restaurantVendor, setRestaurantVendor] = useState<FetchedRestaurantVendorData>();
  const [isGeneralDetailsSet, setIsGeneralDetailsSet] = useState<boolean>(false); // State to control rendering

  const fetchRestaurantVendor = async () => {
    try {
      setLoading(true);
      const selectedRestaurantVendor = await getRestaurantVendorById(id);
      if (!selectedRestaurantVendor) {
        throw new Error("Couldn't find restaurant vendor");
      }

      const { city, restaurantMeal, ...general } = selectedRestaurantVendor;
      setRestaurantVendor(selectedRestaurantVendor);

      setGeneralDetails({
        cityId: general.cityId,
        contactNumber: general.contactNumber,
        name: general.name,
        province: general.province,
        streetName: general.streetName,
        tenantId: general.tenantId,
        city: city,
      });

      restaurantMeal.forEach((m) => {
        addMeals({
          mealType:m.mealType,
          startTime:m.startTime,
          endTime:m.endTime,
          id:m.id,
          restaurantId:m.restaurantId
        });
      });

      setIsGeneralDetailsSet(true); // Mark as ready to render GeneralTab

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch driver details:", error);
      setError("Failed to load driver details.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Add Activity Component");
    fetchRestaurantVendor();
  }, [id]);

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="flex flex-col gap-3">
          <div className="flex w-full flex-row justify-between gap-1">
            <TitleBar title={`Edit Activity Vendor - ${restaurantVendor?.name ?? ""}`} link="toAddActivity" />
            <div>
              <Link href={`${pathname}`}>
                <Button variant="link">Finish Later</Button>
              </Link>
            </div>
          </div>
          <div className="w-full">
            <Tabs defaultValue="general" className="w-full border" value={activeTab}>
              <TabsList className="flex w-full justify-evenly">
                <TabsTrigger
                  value="general"
                  isCompleted={false}
                  onClick={() => setActiveTab("general")}
                  inProgress={activeTab == "general"}
                >
                  General
                </TabsTrigger>
                <TabsTrigger
                  value="mealsOffered"
                  statusLabel="Mandatory"
                  isCompleted={restaurantDetails.mealsOffered.length > 0}
                  inProgress={activeTab == "mealsOffered"}
                  disabled={!restaurantDetails.general.streetName}
                >
                  Meals Offered
                </TabsTrigger>
                <TabsTrigger
                  value="submit"
                  isCompleted={false}
                  disabled={restaurantDetails.mealsOffered.length == 0}
                >
                  Submit
                </TabsTrigger>
              </TabsList>
              <TabsContent value="general">
                {/* Conditionally render GeneralTab based on isGeneralDetailsSet */}
                {isGeneralDetailsSet ? <GeneralTab /> : <div>Loading General Details...</div>}
              </TabsContent>
              <TabsContent value="mealsOffered">
                <MealsOfferedTab />
              </TabsContent>
              <TabsContent value="submit">
                <EditRestaurantSubmitForm id={id} originalDriverData={restaurantVendor ?? null} />
                {/* <SubmitForm/> */}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function WrappedEditRestaurant() {
  const { id } = useParams();
  return (
    <AddRestaurantProvider>
      {id ? <EditRestaurant id={id as string} /> : <div>No activity ID provided.</div>}
    </AddRestaurantProvider>
  );
}
