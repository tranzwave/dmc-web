"use client";
import React, { useEffect, useState } from "react";
import {
  OrganizationProfile,
  OrganizationSwitcher,
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  UserButton,
  UserProfile,
} from "@clerk/nextjs";
import {
  Info,
  Settings,
  Bell,
  DotIcon,
  FileText,
} from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "~/components/ui/breadcrumb";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "~/hooks/use-toast";
import { ClerkOrganizationPublicMetadata } from "~/lib/types/payment";
import CustomPage from "./customInfoPage";
import NotificationModalTrigger from "./notifications/modalTrigger";
import GuideSheet from "./faq";
import { Screen, screens } from "~/lib/constants/guides";
import OrgCustomPage from "./orgCustomInfoPage";

// TopBar component
const TopBar = () => {
  const pathname = usePathname();
  const { orgRole, isLoaded } = useAuth();
  const router = useRouter();

  const handleSettingsOnClick = () => {
    if (orgRole === 'org:admin') {
      router.push('/dashboard/admin')
    } else {
      // alert('You are not authorized to access the settings for the selected organization')
      console.log(toast)
      toast({
        title: 'Unauthorized',
        description: 'You are not authorized to access the settings for the selected organization'
      })
    }
  }
  return (
    <div className="w-full h-full flex items-center">
      <div className="flex w-full flex-row items-center justify-between p-4">
        <div className="flex flex-row items-center gap-2">
          {/* <SearchIcon size={20} color="#697077" /> */}
          <div className="font-sans text-base font-light text-[#697077]">
            {/* Search anything here */}
          </div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink>Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink>{pathname.split("dashboard/")[1]?.toUpperCase()}</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex flex-row items-center gap-8">
          <div className="flex flex-row items-center gap-3">
            <GuideSheet />
            <Settings size={20} color="#697077" className="cursor-pointer" onClick={handleSettingsOnClick} />
            <NotificationModalTrigger />
          </div>
          <SignedIn>
            <div className="flex flex-row gap-3">
              <OrganizationSwitcher
                defaultOpen={false}
                hidePersonal={true}
                appearance={{
                  elements: {
                    organizationSwitcherPopoverActionButton__createOrganization:
                      "hidden",
                  },
                }}
                afterSelectOrganizationUrl={(org) => {
                  if (!(org.publicMetadata as ClerkOrganizationPublicMetadata).subscription.isActive) {
                    return '/dashboard/admin'
                  }
                  return pathname;
                }
                }
              >
                {
                  orgRole === 'org:admin' && (
                    <OrganizationSwitcher.OrganizationProfilePage
                      label="Other Info"
                      url="other-info"
                      labelIcon={<FileText size={15} />}
                    >
                      <OrgCustomPage />
                    </OrganizationSwitcher.OrganizationProfilePage>

                  )
                }
              </OrganizationSwitcher>
              <div>
                {/* <UserButton>
                  <UserButton.UserProfilePage label="Custom Page" url="custom" labelIcon={<DotIcon />}>
                    <CustomPage />
                  </UserButton.UserProfilePage>

                </UserButton> */}
                <UserButton>
                  <UserButton.UserProfilePage label="Personal Info" url="personal-info" labelIcon={<FileText size={15} />}>
                    <CustomPage />
                  </UserButton.UserProfilePage>
                </UserButton>

              </div>
            </div>
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </div>
      </div>
    </div>
  );
};



export default TopBar;
