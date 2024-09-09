"use client";
import React, { useEffect, useState } from "react";
import {
  OrganizationList,
  OrganizationProfile,
  OrganizationSwitcher,
  SignedIn,
  SignedOut,
  SignInButton,
  useOrganization,
  useOrganizationList,
  UserButton,
} from "@clerk/nextjs";
import {
  SearchIcon,
  Info,
  Settings,
  Bell,
  Building2,
  House,
} from "lucide-react";

// Import or create your modal component
const TopBar = () => {
  return (
    <div className="flex w-full flex-row items-center justify-between bg-white p-4">
      <div className="flex flex-row items-center gap-2">
        <SearchIcon size={20} color="#697077" />
        <div className="font-sans text-base font-light text-[#697077]">
          Search anything here
        </div>
      </div>
      <div className="flex flex-row items-center gap-8">
        <div className="flex flex-row items-center gap-3">
          <Info size={20} color="#697077" className="cursor-pointer" />
          <Settings size={20} color="#697077" className="cursor-pointer" />
          <Bell size={20} color="#697077" className="cursor-pointer" />
        </div>
        <SignedIn>
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="Organization"
                labelIcon={<Building2 size={15} color="#737373" />}
                open="organization"
              />
            </UserButton.MenuItems>

            <UserButton.UserProfilePage
              label="Organization"
              labelIcon={<House size={15} color="#737373" />}
              url="organization"
            >
              <div>
                <div className="items-center border-b pb-4 text-base font-bold">
                  Organization
                </div>
                <div className="flex flex-row gap-2 mt-4 items-center">
                  <div className="text-[13px] font-medium">Please select your organization from this list</div>
                  <div>
                    <OrganizationSwitcher
                      defaultOpen={true}
                      hidePersonal={true}
                      appearance={{
                        elements: {
                          organizationSwitcherPopoverActionButton__createOrganization:
                            "hidden",
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            </UserButton.UserProfilePage>
          </UserButton>
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>
    </div>
  );
};

export default TopBar;
