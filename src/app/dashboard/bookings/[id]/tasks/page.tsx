"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import TitleBar from "~/components/common/titleBar";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { BookingSchema } from "~/lib/api"; // Adjust the import path as necessary
import { BookingDetails } from "../../add/context";
import {
  getBookingById,
  getBookingLineById,
  getBookingLineWithAllData,
} from "~/server/db/queries/booking";
import { SelectBookingLine } from "~/server/db/schemaTypes";
import HotelsTasksTab from "~/components/bookings/tasks/hotelsTaskTab";
import RestaurantsTasksTab from "~/components/bookings/tasks/restaurants";
import ActivitiesTasksTab from "~/components/bookings/tasks/activities";
import ShopsTasksTab from "~/components/bookings/tasks/shops";
import TransportTasksTab from "~/components/bookings/tasks/transport";
import { BookingLineWithAllData } from "~/lib/types/booking";
// import HotelsTasksTab from "~/components/bookings/tasks/hotels";

const Page = ({ params }: { params: { id: string } }) => {
  const pathname = usePathname();
  const [booking, setBooking] = useState<SelectBookingLine>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingLine, setBookingLine] = useState<BookingLineWithAllData>()

  // Fetch the booking details when the component mounts
  const fetchBooking = async () => {
    setLoading(true)
    try {
      const booking = await getBookingLineById(params.id);
      const bookingLineData = await getBookingLineWithAllData(params.id)
      console.log(bookingLineData)
      if (!booking || !bookingLineData) {
        setError("Booking not found");
      }
      setBooking(booking);
      setBookingLine(bookingLineData)
      setLoading(false)
    } catch (error) {
      console.error(error);
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!booking) {
    return <div>No booking details available</div>;
  }

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="flex flex-col gap-3">
          <div className="flex w-full flex-row justify-between gap-1">
            <TitleBar title={`${booking.id} - Tasks`} link="toAddBooking" />
            <div>
              <Link href={`${pathname}`}>
                <Button variant="link">Finish Later</Button>
              </Link>
            </div>
          </div>
          <div className="w-full">
            <Tabs defaultValue="hotels" className="w-full border">
              <TabsList className="flex w-full justify-evenly">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="hotels">Hotels</TabsTrigger>
                <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
                <TabsTrigger value="transport">Transport</TabsTrigger>
                <TabsTrigger value="shops">Shops</TabsTrigger>
              </TabsList>
              <TabsContent value="general">
                {/* <GeneralTab onSetDetails={setGeneralDetails} /> */}
                General Task View
              </TabsContent>
              <TabsContent value="hotels">
                {/* <HotelsTab onAddHotel={addHotel} /> */}
                <HotelsTasksTab bookingLineId={params.id} />
                {/* <HotelsTasksTab bookingLineId={params.id}/> */}
              </TabsContent>
              <TabsContent value="restaurants">
                {/* <RestaurantsTab onAddRestaurant={addRestaurant} /> */}
                <RestaurantsTasksTab bookingLineId={params.id}/>
              </TabsContent>
              <TabsContent value="activities">
                {/* <ActivitiesTab onAddActivity={addActivity} /> */}
                <ActivitiesTasksTab bookingLineId={params.id}/>
              </TabsContent>
              <TabsContent value="transport">
                {/* <TransportTab onAddTransport={addTransport} /> */}
                <TransportTasksTab bookingLineId={params.id}/>
              </TabsContent>
              <TabsContent value="shops">
                <ShopsTasksTab bookingLineId={params.id}/>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
