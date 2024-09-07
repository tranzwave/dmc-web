import { CreateOrganization } from "@clerk/nextjs";
import OnboardingFlow from "~/components/onboardingFlow";


const OnboardingRootPage = ()=>{
    return (
        <div className="w-screen">
            {/* <CreateOrganization routing="hash" afterCreateOrganizationUrl={"/dashboard/overview"}/> */}
            <OnboardingFlow/>
        </div>
    )

}

export default OnboardingRootPage;