'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { columns, Hotel } from "~/components/bookings/addBooking/forms/hotelsForm/columns";
import { DataTable } from "~/components/bookings/home/dataTable";
import TitleBar from "~/components/common/titleBar";
import { Button } from "~/components/ui/button";
import { getHotelData, getTransportData } from "~/lib/api";

const HotelsHome = () => {
    const [data, setData] = useState<Hotel[]>([]);
    const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
    const [loading, setLoading] = useState<boolean>(true);  // Added loading state
    const [error, setError] = useState<string | null>(null); // Added error state

    const pathname = usePathname();

    // Fetch data on mount
    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true); // Set loading to true before starting fetch
                const result = await getHotelData(); // Fetch transport data
                setData(result);
            } catch (error) {
                console.error("Failed to fetch transport data:", error);
                setError("Failed to load data."); // Set error message
            } finally {
                setLoading(false); // Set loading to false after fetch is complete
            }
        }

        fetchData();
    }, []);

    const handleRowClick = (driver: Hotel) => {
        setSelectedHotel(driver);
    };

    const handleCloseSidePanel = () => {
        setSelectedHotel(null);
    };

    if (loading) {
        return <div>Loading...</div>;  // Render loading state
    }

    if (error) {
        return <div>Error: {error}</div>;  // Render error message if there's an error
    }

    return (
        <div className="flex">
            <div className="flex-1">
                <div className="flex flex-col gap-3">
                    <div className="flex flex-row gap-1 w-full justify-between">
                        <TitleBar title="Hotels" link="toAddBooking" />
                        <div>
                            <Link href={`${pathname}/add`}>
                                <Button variant="primaryGreen">Add Hotel</Button>
                            </Link>             
                        </div>
                    </div>
                    <div className='flex flex-row gap-3 justify-center'>
                        <div className='w-[90%]'>
                            <DataTable columns={columns} data={data} onRowClick={handleRowClick} />
                        </div>
                        {/* <div className='w-[40%]'>
                            <SidePanel booking={selectedBooking} onClose={handleCloseSidePanel} />
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HotelsHome;
