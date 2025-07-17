
import CityAdder from "~/components/common/cityAdder";
import GeneralForm from "./generalForm";
import ShopTypeAdder from "~/components/common/shopTypeAdder";

const GeneralTab = () => {
  return (
<div className='flex flex-row gap-2 justify-center mx-9'>
            <div className='card w-[100%] space-y-6'>
                <div className='card-title'>General Information</div>
                <GeneralForm />
                <div className="flex flex-row gap-4">
                <CityAdder />
                <ShopTypeAdder/>
                </div>
            </div>
        </div>  )
}

export default GeneralTab