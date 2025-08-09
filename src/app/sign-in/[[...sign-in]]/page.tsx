import { SignIn } from '@clerk/nextjs';
import Image from 'next/image'; // Make sure to import Image from 'next/image'
import SideHero from '~/components/common/sideHero';

export default function Page() {
  return (
    <div className='w-full h-full flex flex-row'>

      <SideHero>
        <SignIn forceRedirectUrl={"/dashboard/overview"} />
      </SideHero>

      {/* Sign-In Section */}
      <div className='w-[60%] h-full flex justify-center items-center'>
        <SignIn forceRedirectUrl={"/dashboard/overview"} />
      </div>
    </div>
  );
}
