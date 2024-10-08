"use client";
import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ActivitiesTab from "~/components/bookings/editBooking/forms/activitiesForm";
import GeneralTab from "~/components/bookings/editBooking/forms/generalForm";
import HotelsTab from "~/components/bookings/editBooking/forms/hotelsForm";
import RestaurantsTab from "~/components/bookings/editBooking/forms/restaurantsForm";
import ShopsTab from "~/components/bookings/editBooking/forms/shopsForm";
import TransportTab from "~/components/bookings/editBooking/forms/transportForm";
import TitleBar from "~/components/common/titleBar";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import AddBookingSubmitTab from "~/components/bookings/editBooking/forms/submitForm";
import { EditBookingProvider, useEditBooking } from "./context";
import { getBookingLineWithAllData } from "~/server/db/queries/booking";
import { format } from 'date-fns';
import LoadingLayout from "~/components/common/dashboardLoading";
import { bookingAgent } from "~/server/db/schema";

const EditBooking = ({ id }: { id: string }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabToEdit = searchParams.get("tab")
  const {
    setGeneralDetails,
    addHotelVoucher,
    addHotelVouchers,
    addRestaurantVoucher,
    addRestaurantVouchers,
    addActivity,
    addActivityVouchers,
    addTransport,
    addTransportVouchers,
    addShop,
    addShopVouchers,
    activeTab,
    setActiveTab,
    bookingDetails,
    statusLabels,
    setStatusLabels,
    triggerRefetch
  } = useEditBooking();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isGeneralDetailsSet, setIsGeneralDetailsSet] = useState<boolean>(false);

  const fetchBookingLine = async ()=>{
    try {
        setLoading(true)
        const selectedBookingLine = await getBookingLineWithAllData(id)


        if(!selectedBookingLine){
        throw new Error("Couldn't find booking line");
        }

        console.log(selectedBookingLine)

        const {booking, hotelVouchers, restaurantVouchers, transportVouchers, activityVouchers, shopsVouchers, ...general} = selectedBookingLine;
        // console.log(booking, hotelVouchers,restaurantVouchers,transportVouchers,activityVouchers, shopsVouchers, general)
        console.log(selectedBookingLine)

        setGeneralDetails({
            clientName: booking.client.name,
            adultsCount:general.adultsCount,
            kidsCount:general.kidsCount,
            directCustomer:booking.directCustomer ?? false,
            primaryContactNumber: booking.client.primaryContactNumber ?? '',
            agent:booking.bookingAgent ? booking.bookingAgent.agent.id : '',
            country:booking.client.country,
            primaryEmail:booking.client.primaryEmail ?? '',
            startDate:format(new Date(general.startDate), 'yyyy-MM-dd'),
            endDate:format(new Date(general.endDate), 'yyyy-MM-dd'),
            includes:{
                activities:general.includes?.activities ?? false,
                hotels:general.includes?.hotels ?? false,
                restaurants:general.includes?.restaurants ?? false,
                shops:general.includes?.shops ?? false,
                transport:general.includes?.transport ?? false
            },
            marketingManager:booking.managerId,
            numberOfDays:7,
            tourType:booking.tourType
        })

        setStatusLabels({
          hotels:general.includes?.hotels ? "Mandatory" : "Locked",
          restaurants:general.includes?.restaurants ? "Mandatory" : "Locked",
          transport:general.includes?.transport ? "Mandatory" : "Locked",
          activities:general.includes?.activities ? "Mandatory" : "Locked",
          shops:general.includes?.shops ? "Mandatory" : "Locked"
        })

        if(hotelVouchers){
          const vouchers = hotelVouchers.map(v => {
            const {hotel, voucherLines, ...voucher } = v
            return {
              hotel:hotel,
              voucher:voucher,
              voucherLines:voucherLines
            }
          })
          console.log(hotelVouchers)
          addHotelVouchers(vouchers);
        }

        if(restaurantVouchers){
          const vouchers = restaurantVouchers.map(v => {
            const {restaurant, voucherLines, ...voucher} = v
            return {
              restaurant:restaurant,
              voucher:voucher,
              voucherLines:voucherLines
            }            
          })

          console.log(vouchers)
          addRestaurantVouchers(vouchers)
        }

        if(activityVouchers){
          const vouchers = activityVouchers.map(v => {
            const {activity, activityVendor, ...voucher} = v
            return {
              vendor:activityVendor,
              voucher:voucher,
            }            
          })

          console.log(vouchers)
          addActivityVouchers(vouchers)
        }

        if(transportVouchers){
          const vouchers = transportVouchers.map(v => {
            const {driver, ...voucher} = v
            return {
              driver:driver,
              voucher:voucher,
            }            
          })

          console.log(vouchers)
          addTransportVouchers(vouchers)
        }

        if(shopsVouchers){
          const vouchers = shopsVouchers.map(v => {
            const {shop, ...voucher} = v
            return {
              shop:shop,
              voucher:voucher,
            }            
          })

          console.log(vouchers)
          addShopVouchers(vouchers)
        }
        setLoading(false);
        setTimeout(() => {
            console.log("This message is logged after 3 seconds");
            setIsGeneralDetailsSet(true);
            console.log(bookingDetails.vouchers)
          }, 3000);
    } catch (error) {
        console.error("Failed to fetch driver details:", error);
      setError("Failed to load driver details.");
      setLoading(false);
    }
  }

  useEffect(() => {
    console.log("Add Booking Component");
    fetchBookingLine()
    setActiveTab(tabToEdit ?? "general")
  }, [id, triggerRefetch]);

  if(loading){
    return (
      <LoadingLayout/>
    )
  }

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="flex flex-col gap-3">
          <div className="flex w-full flex-row justify-between gap-1">
            <TitleBar title="Edit Booking" link="toeditBooking" />
            <div>
              <Link href={`${pathname}`}>
                <Button variant="link">Finish Later</Button>
              </Link>
            </div>
          </div>
          <div className="w-full">
            <Tabs
              defaultValue="general"
              className="w-full"
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
                  disabled={!bookingDetails.general.includes.hotels}
                  statusLabel={statusLabels.hotels}
                  isCompleted = {bookingDetails.vouchers.length > 0}
                  inProgress = {activeTab == "hotels"}
                >
                  Hotels
                </TabsTrigger>
                <TabsTrigger
                  value="restaurants"
                  onClick={() => setActiveTab("restaurants")}
                  disabled={!bookingDetails.general.includes.hotels}
                  statusLabel={statusLabels.restaurants}
                  isCompleted = {bookingDetails.restaurants.length > 0}
                  inProgress = {activeTab == "restaurants"}
                >
                  Restaurants
                </TabsTrigger>
                <TabsTrigger
                  value="activities"
                  onClick={() => setActiveTab("activities")}
                  disabled={!bookingDetails.general.includes.activities}
                  statusLabel={statusLabels.activities}
                  isCompleted = {bookingDetails.activities.length > 0}
                  inProgress = {activeTab == "activities"}
                >
                  Activities
                </TabsTrigger>
                <TabsTrigger
                  value="transport"
                  onClick={() => setActiveTab("transport")}
                  disabled={!bookingDetails.general.includes.transport}
                  statusLabel={statusLabels.transport}
                  isCompleted = {bookingDetails.transport.length > 0}
                  inProgress = {activeTab == "transport"}
                >
                  Transport
                </TabsTrigger>
                <TabsTrigger
                  value="shops"
                  onClick={() => setActiveTab("shops")}
                  disabled={!bookingDetails.general.includes.shops}
                  statusLabel={statusLabels.shops}
                  isCompleted = {bookingDetails.shops.length > 0}
                  inProgress = {activeTab == "shops"}
                >
                  Shops
                </TabsTrigger>
                <TabsTrigger
                  value="submit"
                  onClick={() => setActiveTab("submit")}
                  disabled={!bookingDetails.general.clientName}
                  isCompleted = {false}
                  inProgress = {activeTab == "submit"}
                >
                  Summary
                </TabsTrigger>
              </TabsList>
              <TabsContent value="general">
                {/* <GeneralTab onSetDetails={setGeneralDetails} /> */}
                {isGeneralDetailsSet ? <GeneralTab /> : <div>Loading General Details...</div>}
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
    const { id } = useParams();
  return (
    <EditBookingProvider>
      {id ? <EditBooking id={id as string} /> : <div>No booking ID provided.</div>}
    </EditBookingProvider>
  );
}
