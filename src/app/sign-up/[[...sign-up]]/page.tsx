"use client";

import { SignUp } from "@clerk/nextjs";
import SideHero from "~/components/common/sideHero";

export default function SignUpPage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full">
      {/* SideHero with mobile embedded form */}
      <SideHero>
        <SignUp forceRedirectUrl={"/onboarding"} />
      </SideHero>

      {/* Desktop form shown only on md+ */}
      <div className="hidden md:flex md:w-[60%] items-center justify-center bg-zinc-100 px-8 py-12">
        <div className="w-full max-w-md">
          <SignUp forceRedirectUrl={"/onboarding"} />
        </div>
      </div>
    </div>
  );
}
