"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import ActivitiesTab from "~/components/bookings/addBooking/forms/activitiesForm";
import GeneralTab from "~/components/bookings/addBooking/forms/generalForm";
import HotelsTab from "~/components/bookings/addBooking/forms/hotelsForm";
import RestaurantsTab from "~/components/bookings/addBooking/forms/restaurantsForm";
import ShopsTab from "~/components/bookings/addBooking/forms/shopsForm";
import TransportTab from "~/components/bookings/addBooking/forms/transportForm";
import TitleBar from "~/components/common/titleBar";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { AddBookingProvider, useAddBooking } from "./context";
import AddBookingSubmitTab from "~/components/bookings/addBooking/forms/submitForm";

const AddBooking = () => {
  const pathname = usePathname();
  const {
    setGeneralDetails,
    addHotelVoucher,
    addRestaurantVoucher: addRestaurant,
    addActivity,
    addTransport,
    addShop,
    activeTab,
    setActiveTab,
    bookingDetails,
    statusLabels,
  } = useAddBooking();

  useEffect(() => {
    console.log("Add Booking Component");
  }, []);

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="flex flex-col gap-3">
          <div className="flex w-full flex-row justify-between gap-1">
            <TitleBar title="Add Booking" link="toAddBooking" />
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
                  onClick={() => setActiveTab("general")}
                  isCompleted = {false}
                  inProgress = {activeTab == "general"}
                >
                  General
                </TabsTrigger>
                <TabsTrigger
                  value="hotels"
                  onClick={() => setActiveTab("hotels")}
                  disabled={bookingDetails.vouchers.length == 0}
                  statusLabel={statusLabels["hotels"]}
                  isCompleted = {bookingDetails.vouchers.length > 0}
                  inProgress = {activeTab == "hotels"}
                >
                  Hotels
                </TabsTrigger>
                <TabsTrigger
                  value="restaurants"
                  onClick={() => setActiveTab("restaurants")}
                  disabled={bookingDetails.restaurants.length == 0}
                  statusLabel={statusLabels["restaurants"]}
                  isCompleted = {bookingDetails.restaurants.length > 0}
                  inProgress = {activeTab == "restaurants"}
                >
                  Restaurants
                </TabsTrigger>
                <TabsTrigger
                  value="activities"
                  onClick={() => setActiveTab("activities")}
                  disabled={bookingDetails.activities.length == 0}
                  statusLabel={statusLabels["activities"]}
                  isCompleted = {bookingDetails.activities.length > 0}
                  inProgress = {activeTab == "activities"}
                >
                  Activities
                </TabsTrigger>
                <TabsTrigger
                  value="transport"
                  onClick={() => setActiveTab("transport")}
                  disabled={bookingDetails.transport.length == 0}
                  statusLabel={statusLabels["transport"]}
                  isCompleted = {bookingDetails.transport.length > 0}
                  inProgress = {activeTab == "transport"}
                >
                  Transport
                </TabsTrigger>
                <TabsTrigger
                  value="shops"
                  onClick={() => setActiveTab("shops")}
                  disabled={bookingDetails.shops.length == 0}
                  statusLabel={statusLabels["shops"]}
                  isCompleted = {bookingDetails.shops.length > 0}
                  inProgress = {activeTab == "shops"}
                >
                  Shops
                </TabsTrigger>
                <TabsTrigger
                  value="submit"
                  onClick={() => setActiveTab("submit")}
                  isCompleted = {false}
                  inProgress = {activeTab == "submit"}
                >
                  Submit
                </TabsTrigger>
              </TabsList>
              <TabsContent value="general">
                {/* <GeneralTab onSetDetails={setGeneralDetails} /> */}
                <GeneralTab />
              </TabsContent>
              <TabsContent value="hotels">
                {/* <HotelsTab onAddHotel={addHotel} /> */}
                <HotelsTab />
              </TabsContent>
              <TabsContent value="restaurants">
                {/* <RestaurantsTab onAddRestaurant={addRestaurant} /> */}
                <RestaurantsTab />
              </TabsContent>
              <TabsContent value="activities">
                {/* <ActivitiesTab onAddActivity={addActivity} /> */}
                <ActivitiesTab />
              </TabsContent>
              <TabsContent value="transport">
                {/* <TransportTab onAddTransport={addTransport} /> */}
                <TransportTab />
              </TabsContent>
              <TabsContent value="shops">
                {/* <ShopsTab onAddShop={addShop} /> */}
                <ShopsTab />
              </TabsContent>
              <TabsContent value="submit">
                <AddBookingSubmitTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function WrappedAddBooking() {
  return (
    <AddBookingProvider>
      <AddBooking />
    </AddBookingProvider>
  );
}
