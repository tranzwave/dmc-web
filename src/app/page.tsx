

import { ClerkProvider } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useLayoutEffect } from "react";
import LandingPage from "~/components/landingPage";

const RootPage = ()=>{
    console.log(`Current Environment: ${process.env.NODE_ENV}`);
    // const router = useRouter();
    // useLayoutEffect(() => {
    //     router.replace(
    //         `/dashboard/overview`
    //       );
    //   }, []);

    return (

        <div className="h-screen w-screen overflow-y-scroll">
            <LandingPage/>
        </div>


    )

}

export default RootPage