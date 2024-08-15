'use client'
import { useState } from "react"
import { useAddBooking } from "~/app/dashboard/bookings/add/context"
import { DataTable } from "~/components/bookings/home/dataTable"
import { Button } from "~/components/ui/button"
import { columns, Hotel } from "./columns"
import HotelsForm from "./hotelsForm"

const HotelsTab = () => {
    const [addedHotels, setAddedHotels] =useState<Hotel[]>([])
    const { addHotel,bookingDetails } = useAddBooking();

    const updateHotels = (hotel:Hotel)=>{
        console.log(hotel);
        addHotel(hotel);
    }
    return (
        <div className="flex flex-col gap-3 justify-center items-center ">
            <div className='w-full flex flex-row gap-2 justify-center'>
                <div className='w-[25%]'>
                    <div className='card'>
                        Calendar
                    </div>
                </div>
                <div className='card w-[70%] space-y-6'>
                    <div className='card-title'>Hotel Information</div>
                    <HotelsForm onAddHotel={updateHotels} />
                </div>
            </div>
            <div className='flex flex-col gap-2 items-center justify-center w-[95%]'>
                <div className='w-full'>
                    <DataTable columns={columns} data={bookingDetails.hotels}/>
                </div>
                <div className="w-full flex justify-end">
                <Button variant={"primaryGreen"}>Next</Button>
            </div>
            </div>
            
        </div>
    );
}


export default HotelsTab;