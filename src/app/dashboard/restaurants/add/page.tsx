"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import TitleBar from "~/components/common/titleBar";
import GeneralTab from "~/components/restaurants/addRestaurant/forms/generalForm";
import MealsOfferedTab from "~/components/restaurants/addRestaurant/forms/mealsOfferedForm";
import SubmitForm from "~/components/restaurants/addRestaurant/forms/submitForm";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { AddRestaurantProvider, useAddRestaurant } from "./context";

const AddRestaurant = () => {
  const pathname = usePathname();
  const { restaurantDetails, activeTab, setActiveTab } = useAddRestaurant();

  useEffect(() => {
    console.log("Add Restaurant Component");
  }, []);

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="flex flex-col gap-3">
          <div className="flex w-full flex-row justify-between gap-1">
            <TitleBar title="Add Restaurant" link="toAddRestaurant" />
            <div>
              <Link href={`${pathname}`}>
                <Button variant="link">Finish Later</Button>
              </Link>
            </div>
          </div>
          <div className="w-full">
            <Tabs
              defaultValue="general"
              className="w-full border"
              value={activeTab}
            >
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
                <GeneralTab />
              </TabsContent>
              <TabsContent value="mealsOffered">
                <MealsOfferedTab />
              </TabsContent>
              <TabsContent value="submit">
                {/* <EditRestaurantSubmitForm id={id} originalDriverData={restaurantVendor ?? null} /> */}
                <SubmitForm />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function WrappedAddActivity() {
  return (
    <AddRestaurantProvider>
      <AddRestaurant />
    </AddRestaurantProvider>
  );
}
