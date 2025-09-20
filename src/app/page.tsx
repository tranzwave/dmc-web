

import { ClerkProvider } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useLayoutEffect } from "react";
import LandingPage from "~/components/landingPage";
import { Footer } from "~/components/footer/footer";
import { Navbar } from "~/components/navbar/navBar";

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
            <Navbar/>
            <LandingPage/>
            <Footer/>
        </div>


    )

}

export default RootPage