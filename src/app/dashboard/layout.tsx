"use client";
import { useEffect, useState } from "react";
import { useOrganizationList, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation
import SideNavBar from "~/components/common/sideNavComponent";
import TopBar from "~/components/common/topBarComponent";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { user, isSignedIn, isLoaded } = useUser();
  const { setActive,userInvitations } = useOrganizationList();
  const [invs,setInvs] = useState();
  const router = useRouter();



  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const memberships = user?.organizationMemberships;
      console.log(memberships)
      console.log(userInvitations)
      if (memberships && memberships.length !== 1 && userInvitations.data?.length == 0) {
        router.push("/onboarding");
      }
    }
  }, [isLoaded, isSignedIn, user, setActive, router]);

  if (!isLoaded || !isSignedIn) {
    return <div>Loading...</div>;
  }

  if (!(user?.organizationMemberships && user?.organizationMemberships.length !== 1 && userInvitations.data?.length == 0)) {
  return (
    <div className="w-screen h-screen flex flex-row overflow-y-scroll">
      <div className="side-nav h-full">
        <SideNavBar />
      </div>
      <div className="w-full h-full">
        <div className="top-bar">
          <TopBar />
        </div>
        <div className="dashboard-content">{children}</div>
      </div>
    </div>
  );
  }
}
