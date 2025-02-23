"use client";
import { useEffect, useState } from "react";
import { useOrganization, useOrganizationList, useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import SideNavBar from "~/components/common/sideNavComponent";
import TopBar from "~/components/common/topBarComponent";
import LoadingLayout from "~/components/common/dashboardLoading";
import { OrganizationProvider } from "./context";
import type { OrganizationResource } from "@clerk/types"; // Import OrganizationResource type
import { CustomOrganizationSwitcher } from "~/components/orgSwitcher";
import { TopBarFlag } from "~/components/common/topBarComponent/freeTrialFlag";
import { ClerkOrganizationPublicMetadata, ClerkUserPublicMetadata } from "~/lib/types/payment";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { user, isSignedIn, isLoaded } = useUser();
  const { setActive, userInvitations, userMemberships, isLoaded:isOrgListLoaded } = useOrganizationList();
  const [organization, setOrganization] = useState<OrganizationResource | null>(null); // Use undefined as default
  const router = useRouter();
  const searchParams = useSearchParams()
  const [isTrial, setIsTrial] = useState(true);
  const {organization: clerkOrganization, isLoaded: isClerkOrgLoaded} = useOrganization();
  const [trialEndDate, setTrialEndDate] = useState<Date | null>(null);

  useEffect(() => {
    const orgId = searchParams.get('orgId');
    if(orgId && setActive){
      setActive({organization:orgId})
    }
    if (isLoaded && isSignedIn && clerkOrganization) {
      const memberships = user?.organizationMemberships;
      console.log(memberships);
      console.log(userInvitations);

      console.log("Users public metadata is: ", user.publicMetadata);

      

      // If no memberships or multiple memberships, redirect to onboarding
      if (
        (memberships && memberships.length === 0 && userInvitations.data?.length === 0) || 
        (user.publicMetadata && Object.keys(user.publicMetadata).length === 0)
      ) {
        router.push("/onboarding");
        return;
      }

      // if (!(organization?.publicMetadata as ClerkOrganizationPublicMetadata).subscription.isActive) {
      //   router.push("/dashboard/admin");
      //   return;
      // }
      

      // Set the first organization as the active organization if available
      const org = memberships?.[0]?.organization;
      if (org) {
        setOrganization(org);
      }

      const isTrial = (clerkOrganization.publicMetadata as ClerkOrganizationPublicMetadata)?.subscription?.isTrial;
      setIsTrial(isTrial);

      if(isTrial){
        const trialEndDate = new Date(clerkOrganization.createdAt);
        trialEndDate.setDate(trialEndDate.getDate() + 30);

        if(trialEndDate){
          setTrialEndDate(new Date(trialEndDate));
        }
      }
    }
  }, [isSignedIn, isLoaded, isOrgListLoaded, clerkOrganization]);

  if (!isLoaded || !isSignedIn || !organization || !isOrgListLoaded || !isClerkOrgLoaded) {
    return (
      <div className="layout" style={{
        gridTemplateRows: '0 8% 92%',
      }}>
        <div className="side-nav">
          <SideNavBar />
        </div>
        <div className="top-bar">
          <TopBar />
        </div>
        <div className="dashboard-content">
          <LoadingLayout />
        </div>
      </div>
    );
  }

  // if(userMemberships.data?.length > 1){
  //   return (
  //     <CustomOrganizationSwitcher/>
  //   )
  // }

  return (
    <OrganizationProvider initialOrg={organization}>
      
      <div className="layout" style={{
        gridTemplateRows: `${isTrial ? '6% 7% 87%': '0 8% 92%'}`,
      }}>
        <div className="side-nav">
          <SideNavBar />
        </div>
        {isTrial && trialEndDate && <TopBarFlag trialEndDate={trialEndDate}/>}
        <div className="top-bar">
          <TopBar />
        </div>
        <div className="dashboard-content">
          {children}
        </div>
      </div>
    </OrganizationProvider>
  );
  // if (!(user?.organizationMemberships && user?.organizationMemberships.length !== 1 && userInvitations.data?.length === 0)) {
  // }

  // return null;
}
