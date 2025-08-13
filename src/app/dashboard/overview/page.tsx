"use client";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingLayout from "~/components/common/dashboardLoading";
import TitleBar from "~/components/common/titleBar";
import Services from "~/components/overview/services";
import StatCards from "~/components/overview/statCards";
import TouristsByCountry, { TouristData } from "~/components/overview/touristsByCountry";
import { useToast } from "~/hooks/use-toast";
import { getClientCountByCountry, getStat } from "~/server/db/queries/overview";
type Stat = {
  title: string;
  value: number;
  percentage: number;
};

type DataState = {
  stats: Stat[] | null;
  tourists: TouristData[] | null; // Define a proper type if possible instead of 'any'
};
const Overview = () => {
  const { toast } = useToast();
  const [data, setData] = useState<DataState>({
    stats: null,
    tourists: null,
  });

  const [loading, setLoading] = useState(true);
  const { user, isSignedIn, isLoaded } = useUser();
  const {organization, isLoaded:isOrgLoaded, membership} = useOrganization();

  //check params
  const searchParams = useSearchParams();
  const router = useRouter();


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        //Check for unathetnicated param
        if(searchParams.get("unauthenticated")){
          toast({
            title: "Access Denied",
            description: "You are not authenticated to access settings",
            duration: 5000,
          });
        }

        // Remove the query parameter after the toast is shown
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('unauthenticated');
      const newUrl = `${window.location.pathname}?${newParams.toString()}`;

      // Update the URL without the query parameter
      router.replace(newUrl, { scroll: false });

        const [statsData, touristsData] = await Promise.all([
          getStat(organization?.id ?? ""),
          getClientCountByCountry(organization?.id ?? ""),
        ]);

        console.log("Stats Data:", statsData);
        console.log("Tourists Data:", touristsData);
        console.log("Organization Data:", membership);
        console.log("User Data:", user);

        // Transform statsData to match the required structure
        const transformedStatsData = [
          {
            title: "Total Bookings",
            value: statsData.bookingCount,
            percentage: calculatePercentage(statsData.bookingCount),
          },
          {
            title: "Total Customers",
            value: statsData.clientCount,
            percentage: calculatePercentage(statsData.clientCount),
          },
          {
            title: "Registered Hotels",
            value: statsData.hotelCount,
            percentage: calculatePercentage(statsData.hotelCount),
          },
          {
            title: "Registered Activity Vendors",
            value: statsData.activityVendorCount,
            percentage: calculatePercentage(statsData.activityVendorCount),
          },
        ];

        setData({
          stats: transformedStatsData,
          tourists: touristsData,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Uh Oh!",
          description: "Error fetching overview data",
        });

        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams, router]);

  const calculatePercentage = (value: number) => {

    const baseValue = 100;
    return ((value - baseValue) / baseValue) * 100;
  };

  if (loading || !isLoaded || !isOrgLoaded) {
    return (
      <div>
        <div className="flex w-full flex-row justify-between gap-1">
          <TitleBar title="Overview" link="toReadMe" />
        </div>
          <LoadingLayout />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="h-[3%]">
        <TitleBar title="Overview" link="toReadMe"/>
      </div>
      <div className="flex w-full h-[18%] 2xl:h-[20%] py-3 flex-col gap-2 justify-center items-center rounded-lg bg-welcome-bg bg-cover">
        <div className="text-3xl font-semibold text-[#235026]">WELCOME</div>
        <div className="text-3xl font-semibold text-[#235026]">{user ? user.fullName?.toUpperCase() : "To COORD.TRAVEL"}</div>
      </div>
      <div className="">
        <StatCards stats={data.stats ?? []}/>
      </div>
      <div className="flex w-full flex-row gap-3 h-[46%] 2xl:h-[55%] max-h-[46%] 2xl:max-h-[55%]">
        <div className="card w-1/2 gap-3 h-full">
          <div>
            <div className="card-title">Services</div>
            <div className="text-sm text-primary-gray">
              Services you can interact with
            </div>
          </div>
          <div className="h-full max-h-full overflow-y-auto">
            <Services />
          </div>
        </div>
        <div className="card w-1/2 gap-3 ">
          <div>
            <div className="card-title">Tourists By Country</div>
            <div className="text-sm text-primary-gray">
              Countries with highest number of tourists
            </div>
          </div>
          <div className="h-full max-h-full overflow-y-auto">
            <TouristsByCountry data={data.tourists ?? []}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
