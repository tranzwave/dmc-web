import { SignUp } from "@clerk/nextjs";
import SideHero from "~/components/common/sideHero";

export default function Page() {
  return (
    <div className="flex h-full w-full flex-row">
      <SideHero />
      <div className="flex h-full w-[60%] items-center justify-center">
        <SignUp forceRedirectUrl={"/onboarding"}/>
      </div>
    </div>
  );
}

<SideHero />;
