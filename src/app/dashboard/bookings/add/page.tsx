'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import ActivitiesTab from '~/components/bookings/addBooking/forms/activitiesForm';
import GeneralTab from '~/components/bookings/addBooking/forms/generalForm';
import HotelsTab from '~/components/bookings/addBooking/forms/hotelsForm';
import RestaurantsTab from '~/components/bookings/addBooking/forms/restaurantsForm';
import ShopsTab from '~/components/bookings/addBooking/forms/shopsForm';
import TransportTab from '~/components/bookings/addBooking/forms/transportForm';
import TitleBar from '~/components/common/titleBar';
import { Button } from '~/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { AddBookingProvider, useAddBooking } from './context';
import AddBookingSubmitTab from '~/components/bookings/addBooking/forms/submitForm';

const AddBooking = () => {
  const pathname = usePathname();
  const { setGeneralDetails, addHotelVoucher, addRestaurant, addActivity, addTransport, addShop } = useAddBooking();

  useEffect(() => {
    console.log('Add Booking Component');
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
              <TabsContent value="general">
                {/* <GeneralTab onSetDetails={setGeneralDetails} /> */}
                <GeneralTab/>
              </TabsContent>
              <TabsContent value="hotels">
                {/* <HotelsTab onAddHotel={addHotel} /> */}
                <HotelsTab/>
              </TabsContent>
              <TabsContent value="restaurants">
                {/* <RestaurantsTab onAddRestaurant={addRestaurant} /> */}
                <RestaurantsTab/>
              </TabsContent>
              <TabsContent value="activities">
                {/* <ActivitiesTab onAddActivity={addActivity} /> */}
                <ActivitiesTab/>
              </TabsContent>
              <TabsContent value="transport">
                {/* <TransportTab onAddTransport={addTransport} /> */}
                <TransportTab/>
              </TabsContent>
              <TabsContent value="shops">
                {/* <ShopsTab onAddShop={addShop} /> */}
                <ShopsTab/>
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
