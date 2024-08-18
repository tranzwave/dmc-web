import { Calendar } from "~/components/ui/calendar";
import HotelGeneralForm from "./generalForm";

const HotelGeneralTab = ()=>{
    return(
        <div className='flex flex-row gap-2 justify-center mx-9'>
            <div className='card w-[90%] space-y-6'>
                <div className='card-title'>General Information</div>
                <HotelGeneralForm />
            </div>
        </div>
    )
}

export default HotelGeneralTab;