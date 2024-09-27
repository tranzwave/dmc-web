import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";

const chartData = [
  { month: "China", desktop: 186, mobile: 80 },
  { month: "Germany", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "Canada", desktop: 73, mobile: 190 },
  { month: "Belgium", desktop: 209, mobile: 130 },
  { month: "Bangladesh", desktop: 214, mobile: 140 },
  { month: "Australia", desktop: 73, mobile: 190 },
  { month: "Austria", desktop: 209, mobile: 130 },
  { month: "Brazil", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "September",
    color: "#2563eb",
  },
  mobile: {
    label: "August",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

const BookingsByCountry = () => {
  return (
    <div>
      <div className="relative w-[40%]">
        {/* <Select
          onValueChange={(valueFromSelection) => {
          }}
        >
          <SelectTrigger className="bg-slate-100 shadow-md">
            <SelectValue placeholder="Select Country" />
          </SelectTrigger>
          <SelectContent>
          </SelectContent>
        </Select> */}
      </div>
      <ChartContainer config={chartConfig} className="h-[450px] w-full">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
          <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default BookingsByCountry;
