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
                        <TitleBar title="Hotels" link="toAddHotel" />
                        <Link href={`${pathname}/add`}>
                            <Button variant="primaryGreen">Add Hotel</Button>
                        </Link>  
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
