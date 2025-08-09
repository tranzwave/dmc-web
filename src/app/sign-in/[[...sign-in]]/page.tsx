import { SignIn } from '@clerk/nextjs';
import Image from 'next/image'; // Make sure to import Image from 'next/image'
import SideHero from '~/components/common/sideHero';

export default function Page() {
  return (
    <div className="flex flex-col md:flex-row h-screen w-full">
      {/* SideHero with mobile embedded form */}
      <SideHero>
        <SignIn forceRedirectUrl={"/dashboard/overview"} />
      </SideHero>

      {/* Sign-In Section */}
      <div className="hidden md:flex md:w-[60%] items-center justify-center bg-zinc-100 px-8 py-12">
        <div className="w-full max-w-md">
          <SignIn forceRedirectUrl={"/dashboard/overview"} />
        </div>
      </div>
    </div>
  );
}
