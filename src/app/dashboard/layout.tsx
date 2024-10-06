"use client";
import { useEffect, useState } from "react";
import { useOrganizationList, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import SideNavBar from "~/components/common/sideNavComponent";
import TopBar from "~/components/common/topBarComponent";
import LoadingLayout from "~/components/common/dashboardLoading";
import { OrganizationProvider } from "./context";
import type { OrganizationResource } from "@clerk/types"; // Import OrganizationResource type

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { user, isSignedIn, isLoaded } = useUser();
  const { setActive, userInvitations } = useOrganizationList();
  const [organization, setOrganization] = useState<OrganizationResource | null>(null); // Use undefined as default
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const memberships = user?.organizationMemberships;
      console.log(memberships);
      console.log(userInvitations);

      // If no memberships or multiple memberships, redirect to onboarding
      if (memberships && memberships.length !== 1 && userInvitations.data?.length === 0) {
        router.push("/onboarding");
        return;
      }

      // Set the first organization as the active organization if available
      const org = memberships?.[0]?.organization;
      if (org) {
        setOrganization(org);
      }
    }
  }, [isLoaded, isSignedIn, user, setActive, router]);

  if (!isLoaded || !isSignedIn || !organization) {
    return (
      <div className="layout">
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

  if (!(user?.organizationMemberships && user?.organizationMemberships.length !== 1 && userInvitations.data?.length === 0)) {
    return (
      <OrganizationProvider initialOrg={organization}>
        <div className="layout">
          <div className="side-nav">
            <SideNavBar />
          </div>
          <div className="top-bar">
            <TopBar />
          </div>
          <div className="dashboard-content">
            {children}
          </div>
        </div>
      </OrganizationProvider>
    );
  }

  return null;
}
