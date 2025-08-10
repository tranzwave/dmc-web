"use client"
import HotelGeneralForm from "./generalForm";
import { useAddHotel } from "~/app/dashboard/hotels/add/context";
import CityAdder from "~/components/common/cityAdder";
import { SelectCity } from "~/server/db/schemaTypes";

const HotelGeneralTab = ({ cities, orgId }: { cities: SelectCity[]; orgId: string })=>{
    const {hotelGeneral} = useAddHotel()

    return(
        <div className='flex flex-row gap-2 justify-center mx-9'>
            <div className='card w-[90%] space-y-6'>
                <div className='card-title'>General Information</div>
                <HotelGeneralForm defaultValues={hotelGeneral} cities={cities} orgId={orgId}/>
                <div className="flex flex-row gap-5">
                <CityAdder />
                </div>

            </div>
        </div>
    )
}

export default HotelGeneralTab;