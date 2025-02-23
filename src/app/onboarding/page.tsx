"use client";

import { CreateOrganization, SignOutButton, useOrganizationList, useUser } from "@clerk/nextjs";
import { OrganizationResource } from "@clerk/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SideHero from "~/components/common/sideHero";
import OnboardingFlow from "~/components/onboardingFlow";

const OnboardingRootPage = () => {
    const { user, isSignedIn, isLoaded } = useUser();
    const { userInvitations } = useOrganizationList();
    // const [organization, setOrganization] = useState<OrganizationResource | null>(null);
    const [isNewlyInvitedMember, setIsNewlyInvitedMember] = useState<boolean | null>(null); // Set null initially
    const router = useRouter();

    useEffect(() => {
        if (!isLoaded || !isSignedIn) return;

        const memberships = user?.organizationMemberships ?? [];
        const invitations = userInvitations?.data ?? [];

        if (memberships.length > 0) {
            // User already belongs to an organization
            // setOrganization(memberships[0]?.organization);

            if (user.publicMetadata && Object.keys(user.publicMetadata).length > 0) {
                router.push("/dashboard/overview");
            } else {
               setIsNewlyInvitedMember(true);
            }

            return;
        } else {
            setIsNewlyInvitedMember(false);
        }
    }, [isLoaded, isSignedIn, user, userInvitations, router]);

    // Prevent rendering OnboardingFlow until we determine user type
    if (isNewlyInvitedMember === null) {
        return <div className="flex w-screen h-screen items-center justify-center">Loading...</div>;
    }

    return (
        <div className="flex flex-row w-screen h-screen">
            <SideHero />
            <div className="w-full h-full flex flex-col justify-center items-center">
                <OnboardingFlow isNewlyInvitedMember={isNewlyInvitedMember} />
            </div>
        </div>
    );
};

export default OnboardingRootPage;
