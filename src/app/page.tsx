

import { useRouter } from "next/router";
import { useLayoutEffect } from "react";

const RootPage = ()=>{
    console.log(`Current Environment: ${process.env.NODE_ENV}`);
    // const router = useRouter();
    // useLayoutEffect(() => {
    //     router.replace(
    //         `/dashboard/overview`
    //       );
    //   }, []);

    return (
        <div>Helloo</div>
    )

}

export default RootPage