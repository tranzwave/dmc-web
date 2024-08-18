'use client'
import { useEffect, useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import { Button } from "~/components/ui/button";
import { columns, Hotel, voucherColumns } from "../../addBooking/forms/hotelsForm/columns";
import { Calendar } from "~/components/ui/calendar";
import { HotelVoucher } from "~/app/dashboard/bookings/add/context";

// Define props type for the HotelsTasksTab component
interface HotelsTasksTabProps {
    vouchers: HotelVoucher[];
}

const HotelsTasksTab: React.FC<HotelsTasksTabProps> = ({ vouchers }) => {

    useEffect(()=>{
        if(vouchers){
            alert(vouchers[0]?.hotel.id)
        }
    })

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
                    <DataTable columns={voucherColumns} data={vouchers}/>
                    {/* <HotelsForm onAddHotel={updateHotels} /> */}
                    <DataTable columns={voucherColumns} data={vouchers}/>
                    <DataTable columns={voucherColumns} data={vouchers}/>
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
