import SideHero from "~/components/common/sideHero";
import EnhancedPaymentPackages from "~/components/payment/PaymentForm";


const PackagePage = () => {
    return (

        <div className="flex flex-row w-screen h-screen">
            <SideHero/>
            <div className="w-full h-full flex flex-col justify-center items-center">
                <EnhancedPaymentPackages/>
            </div>
            
        </div>
    )
};

export default PackagePage;