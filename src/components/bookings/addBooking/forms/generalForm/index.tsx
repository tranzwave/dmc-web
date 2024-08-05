import { Calendar } from "~/components/ui/calendar";
import GeneralForm from "./generalForm";

const GeneralTab = ()=>{
    return(
        <div className='flex flex-row gap-2 justify-center mx-9'>
            <div className='w-[25%]'>
                <div className='card w-full'>
                    {/* <Calendar
                        mode="single"
                        className="rounded-md"
                    /> */}
                    Calendar
                </div>
            </div>
            <div className='card w-[70%] space-y-6'>
                <div className='card-title'>General Information</div>
                <GeneralForm />
            </div>
        </div>
    )
}

export default GeneralTab;