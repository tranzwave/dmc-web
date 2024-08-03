'use client'
import { useState } from "react"
import HotelsForm from "../hotelsForm"
import { columns, Hotel } from "./columns"
import { DataTable } from "~/components/bookings/home/dataTable"

const AddBookingHotel = () => {
    const [addedHotels, setAddedHotels] =useState<Hotel[]>([])

    const updateHotels = (hotel:Hotel)=>{
        setAddedHotels((prev)=>[...prev,hotel]);
    }
    return (
        <div className="flex flex-col gap-3">
            <div className='flex flex-row gap-2 justify-center mx-9'>
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
            <div className='flex flex-row gap-2 justify-center mx-9'>
                <div className='w-full border'>
                    <DataTable columns={columns} data={addedHotels}/>
                </div>
            </div>
        </div>
    );
}


export default AddBookingHotel;