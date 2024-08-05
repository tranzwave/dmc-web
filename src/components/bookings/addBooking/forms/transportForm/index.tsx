'use client'
import { useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import { columns, Transport } from "./columns";
import TransportForm from "./transportsForm";
import { SearchIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Driver, driverColumns, VehicleType } from "~/lib/types/driver/type";
import { DriverSearchParams, searchDriverData } from "~/lib/api";
import { useAddBooking } from "~/app/dashboard/bookings/add/context";

const TransportTab = () => {
    const { addTransport, bookingDetails } = useAddBooking();
    const [searchResults, setSearchResults] = useState<Driver[]>([]);
    const [searchDetails, setSearchDetails] = useState<Transport | null>(null);

    const handleRowClick = (driver: Driver) => {
        if (searchDetails) {
            const transportToAdd = {
                transport: searchDetails,
                driver
            };
            addTransport(transportToAdd);
        }
    };

    const updateSearchData = (transport: Transport) => {
        setSearchDetails(transport);
        const searchParams: DriverSearchParams = {
            vehicleType: transport.vehicle,
            languages: [transport.languages],
            type: transport.type
        };
        searchDrivers(searchParams);
    };

    // Function to search for drivers based on transport data
    const searchDrivers = async (searchParams: DriverSearchParams) => {
        try {
            const results = await searchDriverData(searchParams);
            setSearchResults(results);
        } catch (error) {
            console.error("Error searching for drivers:", error);
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <div className='flex flex-row gap-2 justify-center mx-9'>
                <div className='w-[25%]'>
                    <div className='card'>
                        Calendar
                    </div>
                    <div className='card'>
                        Profile
                    </div>
                </div>
                <div className='card w-[70%] space-y-6'>
                    <div className='card-title'>Transport Information</div>
                    <TransportForm onSearchTransport={updateSearchData} />
                    <div className='w-full space-y-2'>
                        <div className="flex flex-row justify-between items-center">
                            <div>
                                {searchDetails?.type} - {searchDetails?.vehicle}
                            </div>
                            <div className="flex flex-row gap-2 items-center rounded-lg border px-4 py-2">
                                <SearchIcon size={18} color="#697077"/>
                                <div className="font-sans font-light text-[#697077] text-sm">
                                    Search for a name here
                                </div>
                            </div>
                        </div>
                        <DataTable columns={driverColumns} data={searchResults} onRowClick={handleRowClick}/>
                    </div>
                    <div className='w-full'>
                        <DataTable columns={columns} data={bookingDetails.transport} />
                    </div>
                    <div className="w-full flex justify-end">
                        <Button variant={"primaryGreen"}>Next</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TransportTab;
