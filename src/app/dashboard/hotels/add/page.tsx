'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import TitleBar from '~/components/common/titleBar';
import HotelGeneralTab from '~/components/hotels/addHotel/forms/generalForm';
import { Button } from '~/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { AddHotelProvider } from './context';
import RoomsTab from '~/components/hotels/addHotel/forms/roomsForm';
import StaffTab from '~/components/hotels/addHotel/forms/staffForm';
import AddHotelSubmitView from '~/components/hotels/addHotel/forms/submitForm';

const AddHotel = () => {
  const pathname = usePathname();

  useEffect(() => {
    console.log('Add Booking Component');
  }, []);

  const handleAddHotel = async () => {

    // try {
    //     const response = await fetch('/api/hotels', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             hotelName: 'Test Hotel',
    //             stars: 5,
    //             primaryEmail: 'info@hotel.com',
    //             primaryContactNumber: '123456789',
    //             streetName: 'Main St',
    //             city: 'City Name',
    //             province: 'Province',
    //             hasRestaurant: true,
    //             restaurants: [{ restaurantName: 'Restaurant 1', mealType: 'Breakfast', startTime: '07:00', endTime: '10:00' }],
    //         }),
    //     });

    //     if (!response.ok) {
    //         const text = await response.text();
    //         console.error('Server Error:', text);
    //         setError('Failed to add hotel.');
    //         return;
    //     }

    //     const data = await response.json();
    //     console.log('Hotel added successfully:', data.hotel);
    //     // Optionally refresh data
    //     // await fetchData();
    // } catch (error) {
    //     console.error('Error adding hotel:', error);
    //     setError('An unexpected error occurred.');
    // }
};

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="flex flex-col gap-3">
          <div className="flex flex-row gap-1 w-full justify-between">
            <TitleBar title="Add Hotel" link="toAddBooking" />
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
                <TabsTrigger value="rooms">Rooms</TabsTrigger>
                <TabsTrigger value="staff">Staff</TabsTrigger>
                <TabsTrigger value="submit">Submit</TabsTrigger>
              </TabsList>
              <TabsContent value="general">
                <HotelGeneralTab/>
              </TabsContent>
              <TabsContent value="rooms">
                <RoomsTab/>
              </TabsContent>
              <TabsContent value="staff">
                <StaffTab/>
              </TabsContent>
              <TabsContent value="submit">
                <AddHotelSubmitView/>
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
    <AddHotelProvider>
      <AddHotel/>
    </AddHotelProvider>
  );
}
