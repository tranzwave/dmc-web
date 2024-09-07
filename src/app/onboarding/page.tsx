import { CreateOrganization, SignOutButton } from "@clerk/nextjs";
import SideHero from "~/components/common/sideHero";
import OnboardingFlow from "~/components/onboardingFlow";
import { Button } from "~/components/ui/button";


const OnboardingRootPage = ()=>{
    return (
        <div className="flex flex-row w-screen h-screen">
            <SideHero/>
            <div className="w-[60%] h-screen flex flex-col justify-center items-center">
            <CreateOrganization routing="hash" afterCreateOrganizationUrl={"/dashboard/overview"} />
            <div className="flex flex-row justify-end items-center gap-2 p-2">
                <div className="text-[13px]">Sign in with a different account</div>
                <Button variant={"primaryGreen"} className="h-8 text-[13px]"><SignOutButton/></Button>
                
            </div>
            </div>
            {/* <OnboardingFlow/> */}
        </div>
    )

}

export default OnboardingRootPage;