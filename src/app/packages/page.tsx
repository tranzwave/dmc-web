"use client"
import SideHero from "~/components/common/sideHero";
import EnhancedPaymentPackages from "~/components/payment/PaymentForm";


const PackagePage = () => {

    const onCloseDialog = () => {
        return
    }
    return (

        <div className="flex flex-row w-screen h-screen">
            <SideHero/>
            <div className="w-full h-full flex flex-col justify-center items-center">
                <EnhancedPaymentPackages onCloseDialog={onCloseDialog}/>
            </div>
            
        </div>
    )
};

export default PackagePage;