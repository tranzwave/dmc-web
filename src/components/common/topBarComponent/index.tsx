"use client";
import React, { useEffect, useState } from "react";
import {
  OrganizationSwitcher,
  SignedIn,
  SignedOut,
  SignInButton,
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
import { OrganizationRolesAndPermissions } from "~/components/organization/managePermissions";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "~/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import Link from "next/link";

// TopBar component
const TopBar = () => {
  const pathname = usePathname();
  return (
    <div className="flex w-full flex-row items-center justify-between bg-white p-4">
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
          <Info size={20} color="#697077" className="cursor-pointer" />
          <Link href={"/dashboard/admin"} className="hover:cursor-pointer">
            <Settings size={20} color="#697077" className="cursor-pointer" />
          </Link>
          <Bell size={20} color="#697077" className="cursor-pointer" />
        </div>
        <SignedIn>
          <UserButton>
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
