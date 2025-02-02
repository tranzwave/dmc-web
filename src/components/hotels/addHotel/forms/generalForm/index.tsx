"use client"
import { Calendar } from "~/components/ui/calendar";
import HotelGeneralForm from "./generalForm";
import { useAddHotel } from "~/app/dashboard/hotels/add/context";
import { useEffect } from "react";
import CityAdder from "~/components/common/cityAdder";

const HotelGeneralTab = ()=>{
    const {hotelGeneral} = useAddHotel()

    useEffect(()=>{
        console.log(hotelGeneral)
    },[hotelGeneral])
    return(
        <div className='flex flex-row gap-2 justify-center mx-9'>
            <div className='card w-[90%] space-y-6'>
                <div className='card-title'>General Information</div>
                <HotelGeneralForm defaultValues={hotelGeneral}/>
                <CityAdder />
            </div>
        </div>
    )
}

export default HotelGeneralTab;