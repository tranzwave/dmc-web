"use client";

import { SignUp } from "@clerk/nextjs";
// import * as Clerk from "@clerk/elements/common";
// import * as SignUp from "@clerk/elements/sign-up";
import { Loader, LoaderCircle, Triangle, TriangleRight } from "lucide-react";
import SideHero from "~/components/common/sideHero";

export default function SignUpPage() {
  return (
    <div className="flex h-full w-full flex-row">
      <SideHero />
      <div className="flex w-[60%] items-center bg-zinc-100 px-4 sm:justify-center">
        <SignUp forceRedirectUrl={"/dashboard/overview"}/>
      </div>
    </div>
  );
}
