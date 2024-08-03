"use client";

import { useEffect } from 'react';
import TitleBar from "~/components/common/titleBar";
import { Button } from "~/components/ui/button";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import HotelsForm from '~/components/bookings/addBooking/forms/hotelsForm';
import GeneralForm from '~/components/bookings/addBooking/forms/generalForm';
import { DataTable } from '~/components/bookings/home/dataTable';
import { columns } from '~/components/bookings/addBooking/forms/hotelsForm/columns';
import AddBookingHotel from '~/components/bookings/addBooking/forms/hotelsForm/index';


const SubmitForm = () => (
  <div>
    <p>Review all the details and submit your booking.</p>
    <Button variant="primaryGreen">Submit</Button>
  </div>
);

export default function AddBooking() {
  const pathname = usePathname();

  useEffect(() => {
    console.log("Add Booking Component");
  }, []);

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="flex flex-col gap-3">
          <div className="flex flex-row gap-1 w-full justify-between">
            <TitleBar title="Add Booking" link="toAddBooking" />
            <div>
              <Link href={`${pathname}`}>
                <Button variant="link">Finish Later</Button>
              </Link>
            </div>
          </div>
          <div className='w-full'>
            <Tabs defaultValue="general" className="w-full border">
              <TabsList className='flex justify-evenly w-full'>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="hotels">Hotels</TabsTrigger>
                <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
                <TabsTrigger value="transport">Transport</TabsTrigger>
                <TabsTrigger value="shops">Shops</TabsTrigger>
                <TabsTrigger value="submit">Submit</TabsTrigger>
              </TabsList>
              <TabsContent value="general" className='flex flex-row gap-2 justify-center mx-9'>
                <div className='w-[25%]'>
                    <div className='card'>
                        Calendar
                    </div>
                </div>
                <div className='card w-[70%] space-y-6'>
                    <div className='card-title'>General Information</div>
                    <GeneralForm />
                </div>
              </TabsContent>
              <TabsContent value="hotels" className='flex flex-col gap-2'>
                <AddBookingHotel/>
              </TabsContent>
              <TabsContent value="restaurants">RestaurantsForm</TabsContent>
              <TabsContent value="activities">ActivitiesForm</TabsContent>
              <TabsContent value="transport">TransportForm</TabsContent>
              <TabsContent value="shops">ShopsForm</TabsContent>
              <TabsContent value="submit"><SubmitForm /></TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
