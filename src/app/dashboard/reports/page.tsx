"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import LoadingLayout from "~/components/common/dashboardLoading";
import Pagination from "~/components/common/pagination";
import TitleBar from "~/components/common/titleBar";
import TouristsByCountry from "~/components/overview/touristsByCountry";
import BookingsByCountry from "~/components/reports/bookingsByCountry/page";
import HotelsBookingTab from "~/components/reports/hotelsBookingTable";
import TransportHistoryTab from "~/components/reports/transportHistoryTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useToast } from "~/hooks/use-toast";
import { getClientCountByCountry, getStat } from "~/server/db/queries/overview";

type Stat = {
  title: string;
  value: number;
  percentage: number;
};

export type TouristData = {
  country: string;
  code: string;
  count: number;
};
type DataState = {
  stats: Stat[] | null;
  tourists: TouristData[] | null;
};

const Reports = () => {
  const { toast } = useToast();
  const [data, setData] = useState<DataState>({
    stats: null,
    tourists: null,
  });

  const [loading, setLoading] = useState(true);
  const { user, isSignedIn, isLoaded } = useUser();

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 3;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [statsData, touristsData] = await Promise.all([
          getStat(),
          getClientCountByCountry(),
        ]);

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

  const totalPages = data.tourists
    ? Math.ceil(data.tourists.length / rowsPerPage)
    : 0;
  const paginatedTourists = data.tourists
    ? data.tourists.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage,
      )
    : [];

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
    <div>
      <div className="flex w-full flex-row justify-between gap-1">
        <TitleBar title="Reports" link="to AddReport" />
     
      </div>
      <div className="flex gap-10">
        <div className="w-[40%] grid-flow-col">
          <div className="text-sm text-primary-gray">
            Number of bookings within a year
          </div>
          <BookingsByCountry />

          <div>
            <div className="card-title">Tourists By Country</div>
            <div className="text-sm text-primary-gray">
              Countries with highest number of tourists
            </div>
          </div>
          <div>
            <TouristsByCountry data={paginatedTourists} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>

        <div className="w-full">
          <Tabs defaultValue="hotelsBooking" className="w-full border">
            <TabsList className="flex w-full justify-evenly">
              <TabsTrigger value="hotelsBooking">
                Hotels Booking History
              </TabsTrigger>
              <TabsTrigger value="transportHistory">
                Transport History
              </TabsTrigger>
            </TabsList>
            <TabsContent value="hotelsBooking">
              <HotelsBookingTab />
            </TabsContent>
            <TabsContent value="transportHistory">
              <TransportHistoryTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Reports;
