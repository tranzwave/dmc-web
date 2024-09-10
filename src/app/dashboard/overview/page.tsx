"use client";
import Image from "next/image";
import TitleBar from "~/components/common/titleBar";
import Services from "~/components/overview/services";
import StatCards from "~/components/overview/statCards";
import TouristsByCountry, { TouristData } from "~/components/overview/touristsByCountry";
import heroImage from "../../../../public/assets/Rectangle 47.png";
import { useEffect, useState } from "react";
import { useToast } from "~/hooks/use-toast";
import { getClientCountByCountry, getStat } from "~/server/db/queries/overview";
import Link from "next/link";
import LoadingLayout from "~/components/common/dashboardLoading";
import { useUser } from "@clerk/nextjs";
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


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [statsData, touristsData] = await Promise.all([
          getStat(),
          getClientCountByCountry(),
        ]);

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
  }, []);

  const calculatePercentage = (value: number) => {

    const baseValue = 100;
    return ((value - baseValue) / baseValue) * 100;
  };

  if (loading || !isLoaded) {
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
      <div className="flex w-full h-[20%] py-3 flex-col gap-2 justify-center items-center rounded-lg bg-welcome-bg bg-cover">
        <div className="text-3xl font-semibold text-[#235026]">WELCOME</div>
        <div className="text-3xl font-semibold text-[#235026]">{user ? user.fullName?.toUpperCase() : "To Tranzwave"}</div>
      </div>
      <div className="h-[14%]">
        <StatCards stats={data.stats ?? []}/>
      </div>
      <div className="flex w-full h-[55%] flex-row gap-3">
        <div className="card w-1/2 gap-3 h-full">
          <div>
            <div className="card-title">Services</div>
            <div className="text-sm text-primary-gray">
              Services you can interact with
            </div>
          </div>
          <div>
            <Services />
          </div>
        </div>
        <div className="card w-1/2 gap-3">
          <div>
            <div className="card-title">Tourists By Country</div>
            <div className="text-sm text-primary-gray">
              Countries with highest number of tourists
            </div>
          </div>
          <div>
            <TouristsByCountry data={data.tourists ?? []}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
