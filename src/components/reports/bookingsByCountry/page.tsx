import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { getBookingCountByMonth } from '~/server/db/queries/reports';

type BookingData = {
  month: string|undefined; 
  count: number;
};

const chartConfig = {
  bookings: {
    label: "Bookings",
    color: "#2563eb",
  },
} satisfies ChartConfig;

const BookingsByCountry = () => {
  const [chartData, setChartData] = useState<BookingData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingCounts = await getBookingCountByMonth();
        setChartData(bookingCounts);
      } catch (error) {
        console.error("Error fetching booking counts:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="relative w-[40%]">
      </div>
      <ChartContainer config={chartConfig} className="h-[450px] w-full">
        <BarChart data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="count" fill="var(--color-bookings)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default BookingsByCountry;
