'use client'
import { useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import { Button } from "~/components/ui/button";
import { columns, Hotel } from "../../addBooking/forms/hotelsForm/columns";
import { Calendar } from "~/components/ui/calendar";

// Define props type for the HotelsTasksTab component
interface HotelsTasksTabProps {
    hotels: Hotel[];
}

const HotelsTasksTab: React.FC<HotelsTasksTabProps> = ({ hotels }) => {

    return (
        <div className="flex flex-col gap-3 justify-center items-center">
            <div className='w-full flex flex-row gap-2 justify-center'>
                <div className='w-[25%]'>
                    <div className='card'>
                        <Calendar/>
                    </div>
                </div>
                <div className='card w-[70%] space-y-6'>
                    <div className='card-title'>Hotel Information</div>
                    <DataTable columns={columns} data={hotels}/>
                    {/* <HotelsForm onAddHotel={updateHotels} /> */}
                    <DataTable columns={columns} data={hotels}/>
                    <DataTable columns={columns} data={hotels}/>
                </div>
            </div>
            <div className='flex flex-col gap-2 items-center justify-center w-[95%]'>
                <div className="w-full flex justify-end">
                    <Button variant={"primaryGreen"}>Next</Button>
                </div>
            </div>
        </div>
    );
}

export default HotelsTasksTab;
