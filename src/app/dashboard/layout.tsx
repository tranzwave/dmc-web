"use client";
import { useEffect } from "react";
import { useOrganizationList, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation
import SideNavBar from "~/components/common/sideNavComponent";
import TopBar from "~/components/common/topBarComponent";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { user, isSignedIn, isLoaded } = useUser();
  const { setActive } = useOrganizationList();
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const memberships = user?.organizationMemberships;

      if (memberships && memberships.length !== 1) {
        router.push("/onboarding"); // Redirect to /onboarding if no valid organization 
      }
    }
  }, [isLoaded, isSignedIn, user, setActive, router]);

  if (!isLoaded || !isSignedIn) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-screen flex flex-row">
      <div className="side-nav">
        <SideNavBar />
      </div>
      <div className="w-full">
        <div className="top-bar">
          <TopBar />
        </div>
        <div className="dashboard-content">{children}</div>
      </div>
    </div>
  );
}
