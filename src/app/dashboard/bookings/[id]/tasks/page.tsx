'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import TitleBar from '~/components/common/titleBar';
import { Button } from '~/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { BookingSchema, getBookingById } from '~/lib/api'; // Adjust the import path as necessary
import { BookingDetails } from '../../add/context';
import HotelsTasksTab from '~/components/bookings/tasks/hotels';

const Page = ({ params }: { params: { id: string } }) => {
    const pathname = usePathname();
    const [booking, setBooking] = useState<BookingSchema | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch the booking details when the component mounts
        const fetchBooking = async () => {
            try {
                const booking = await getBookingById(params.id);
                if (booking) {
                    setBooking(booking);
                } else {
                    setError('Booking not found');
                }
            } catch (error) {
                setError('An error occurred while fetching the booking');
            } finally {
                
                setLoading(false);
            }
        };

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
                    <div className="flex flex-row gap-1 w-full justify-between">
                        <TitleBar title={`${booking.id} - Tasks`} link="toAddBooking" />
                        <div>
                            <Link href={`${pathname}`}>
                                <Button variant="link">Finish Later</Button>
                            </Link>
                        </div>
                    </div>
                    <div className='w-full'>
                        <Tabs defaultValue="hotels" className="w-full border">
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
                                General Task View
                            </TabsContent>
                            <TabsContent value="hotels">
                                {/* <HotelsTab onAddHotel={addHotel} /> */}
                                <HotelsTasksTab vouchers={booking.vouchers}/>
                            </TabsContent>
                            <TabsContent value="restaurants">
                                {/* <RestaurantsTab onAddRestaurant={addRestaurant} /> */}
                                Restaurants Tasks
                            </TabsContent>
                            <TabsContent value="activities">
                                {/* <ActivitiesTab onAddActivity={addActivity} /> */}
                                Activities Tasks
                            </TabsContent>
                            <TabsContent value="transport">
                                {/* <TransportTab onAddTransport={addTransport} /> */}
                                Transport Tasks
                            </TabsContent>
                            <TabsContent value="shops">
                                Shops Tasks
                            </TabsContent>
                            <TabsContent value="submit">
                                Submit Tasks
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;
