"use client"
import { CreateOrganization, SignOutButton, useOrganizationList, useUser } from "@clerk/nextjs";
import { OrganizationResource } from "@clerk/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SideHero from "~/components/common/sideHero";
import OnboardingFlow from "~/components/onboardingFlow";
import { Button } from "~/components/ui/button";


const OnboardingRootPage = ()=>{
    const { user, isSignedIn, isLoaded } = useUser();
    const { setActive, userInvitations } = useOrganizationList();
    const [organization, setOrganization] = useState<OrganizationResource | null>(null); // Use undefined as default
    const router = useRouter();

  
    useEffect(() => {
      if (isLoaded && isSignedIn) {
        const memberships = user?.organizationMemberships;
        console.log(memberships);
        console.log(userInvitations);
  
        if (memberships[0] ?? userInvitations.data?.length != 0) {
            const org = memberships?.[0]?.organization;
            if (org) {
              setOrganization(org);
            }
          router.push("/dashboard/overview");
          return;
        }
      }
    }, [isLoaded, isSignedIn, user, setActive, router]);
    return (

        <div className="flex flex-row w-screen h-screen">
            <SideHero/>
            <div className="w-full h-full flex flex-col justify-center items-center">
                <OnboardingFlow/>
            </div>
            
        </div>
    )

}

export default OnboardingRootPage;