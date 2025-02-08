"use client";
import { useEffect, useState } from "react";
import { useOrganizationList, useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import SideNavBar from "~/components/common/sideNavComponent";
import TopBar from "~/components/common/topBarComponent";
import LoadingLayout from "~/components/common/dashboardLoading";
import { OrganizationProvider } from "./context";
import type { OrganizationResource } from "@clerk/types"; // Import OrganizationResource type
import { CustomOrganizationSwitcher } from "~/components/orgSwitcher";
import { TopBarFlag } from "~/components/common/topBarComponent/freeTrialFlag";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { user, isSignedIn, isLoaded } = useUser();
  const { setActive, userInvitations, userMemberships, isLoaded:isOrgListLoaded } = useOrganizationList();
  const [organization, setOrganization] = useState<OrganizationResource | null>(null); // Use undefined as default
  const router = useRouter();
  const searchParams = useSearchParams()
  const [isTrial, setIsTrial] = useState(true);

  useEffect(() => {
    const orgId = searchParams.get('orgId');
    if(orgId && setActive){
      setActive({organization:orgId})
    }
    if (isLoaded && isSignedIn) {
      const memberships = user?.organizationMemberships;
      console.log(memberships);
      console.log(userInvitations);

      

      // If no memberships or multiple memberships, redirect to onboarding
      if (memberships && memberships.length === 0 && userInvitations.data?.length === 0) {
        router.push("/onboarding");
        return;
      }

      // Set the first organization as the active organization if available
      const org = memberships?.[0]?.organization;
      if (org) {
        setOrganization(org);
      }
    }
  }, [isSignedIn, isLoaded, isOrgListLoaded]);

  if (!isLoaded || !isSignedIn || !organization || !isOrgListLoaded) {
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
        <TopBarFlag trialEndDate={new Date('2025/12/31')}/>
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
