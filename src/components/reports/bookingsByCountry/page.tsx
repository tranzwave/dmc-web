import { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '~/components/ui/chart';
import { getBookingCountByMonth } from '~/server/db/queries/reports';

type BookingData = {
  month: string;
  count: number;
};

const chartConfig = {
  bookings: {
    label: "Bookings",
    color: "#287f71",
  },
};

const BookingsByCountry = () => {
  const [chartData, setChartData] = useState<BookingData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingCounts = await getBookingCountByMonth();
        console.log("bookingCounts", bookingCounts);
        setChartData(bookingCounts);
      } catch (error) {
        console.error("Error fetching booking counts:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='w-full'>
      <div className="relative w-[40%]">
      </div>
      <div className="h-[400px] w-full">
        <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig.bookings.color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={chartConfig.bookings.color} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" fontSize={13}/>
            <YAxis fontSize={13}/>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="count"
              stroke={chartConfig.bookings.color}
              fillOpacity={1}
              fill="url(#colorBookings)"
            />
          </AreaChart>
        </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};

export default BookingsByCountry;
