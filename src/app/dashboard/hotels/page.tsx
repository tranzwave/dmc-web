'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { columns, Hotel } from "~/components/bookings/addBooking/forms/hotelsForm/columns";
import { DataTable } from "~/components/bookings/home/dataTable";
import TitleBar from "~/components/common/titleBar";
import { Button } from "~/components/ui/button";
import { getHotelData } from "~/lib/api";// Assuming this type is defined

const HotelsHome = () => {
    const [data, setData] = useState<Hotel[]>([]);
    const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
    const [loading, setLoading] = useState<boolean>(true);  
    const [error, setError] = useState<string | null>(null);

    const pathname = usePathname();

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const result = await getHotelData();
                setData(result);
            } catch (error) {
                console.error("Failed to fetch hotel data:", error);
                setError("Failed to load data.");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const handleRowClick = (hotel: Hotel) => {
        setSelectedHotel(hotel);
    };

    const handleAddHotel = async () => {
        try {
            const response = await fetch('/api/hotels', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    hotelName: 'Test Hotel',
                    stars: 5,
                    primaryEmail: 'info@hotel.com',
                    primaryContactNumber: '123456789',
                    streetName: 'Main St',
                    city: 'City Name',
                    province: 'Province',
                    hasRestaurant: true,
                    restaurants: [{ restaurantName: 'Restaurant 1', mealType: 'Breakfast', startTime: '07:00', endTime: '10:00' }],
                }),
            });

            if (!response.ok) {
                const text = await response.text();
                console.error('Server Error:', text);
                setError('Failed to add hotel.');
                return;
            }

            const data = await response.json();
            console.log('Hotel added successfully:', data.hotel);
            // Optionally refresh data
            // await fetchData();
        } catch (error) {
            console.error('Error adding hotel:', error);
            setError('An unexpected error occurred.');
        }
    };

    const handleCloseSidePanel = () => {
        setSelectedHotel(null);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="flex">
            <div className="flex-1">
                <div className="flex flex-col gap-3">
                    <div className="flex flex-row gap-1 w-full justify-between">
                        <TitleBar title="Hotels" link="toAddBooking" />
                        <div>
                            <Button variant="primaryGreen" onClick={handleAddHotel}>Add Hotel</Button>
                        </div>
                    </div>
                    <div className='flex flex-row gap-3 justify-center'>
                        <div className='w-[90%]'>
                            <DataTable columns={columns} data={data} onRowClick={handleRowClick} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HotelsHome;
