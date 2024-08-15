import GeneralForm from "./chargesForm";

const GeneralTab = ()=>{
    return(
        <div className='flex flex-row gap-2 justify-center mx-9'>
            <div className='card w-[100%] space-y-6'>
                <div className='card-title'>General Information</div>
                <GeneralForm />
            </div>
        </div>
    )
}

export default GeneralTab;