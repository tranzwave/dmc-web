"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse, set } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEditBooking } from "~/app/dashboard/bookings/[id]/edit/context";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";
import { InsertOtherTransportVoucherLine, SelectCity, SelectLanguage } from "~/server/db/schemaTypes";
import { OtherTransport } from "./otherTransportColumns";
import { OtherTransportSearchType } from "../columns";
import { Input } from "~/components/ui/input";

interface OtherTransportFormProps {
  onSearchTransport: (transportSearchCriteria: OtherTransportSearchType) => void;
  setOtherTransportVoucherLine : (voucherLine: InsertOtherTransportVoucherLine) => void;
  cities: SelectCity[];
}

export const otherTransportSchema = z.object({
  transportType: z.enum(["Sea", "Land", "Air"]),
  vehicle: z.string().min(1, "Vehicle type is required"),
  date: z.string().min(1, "Start date is required"),
  time: z.string().min(1, "End date is required"),
  adultsCount: z.string().min(1, "Adult count is required"),
  kidsCount: z.string().min(1, "Kids count is required"),
  cityId: z.number().int().positive(),
  notes: z.string().optional(),
  startLocation: z.string().min(1, "Start location is required"),
  endLocation: z.string().min(1, "End location is required"),
});

const OtherTransportForm: React.FC<OtherTransportFormProps> = ({
  onSearchTransport: onSearchTransportMethod,
  setOtherTransportVoucherLine,
  cities,
}) => {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<SelectCity>();
  const [selectedVehicleType, setSelectedVehicleType] = useState<
    string | null
  >();
  const [driverLoading, setDriversLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [selectedDriver, setSelectedDriver] = useState<any | null>();
  const { bookingDetails } = useEditBooking();

  const form = useForm<z.infer<typeof otherTransportSchema>>({
    resolver: zodResolver(otherTransportSchema),
    defaultValues: {
      transportType: "Sea",
      vehicle: "",
      date: "",
      time: "",
      adultsCount: '0',
      kidsCount: '0',
      cityId: 0,
      notes: "",
      startLocation: "",
      endLocation: "",
    },
  });

  const onSubmit = (values: z.infer<typeof otherTransportSchema>) => {
    onSearchTransportMethod({
      transportType: values.transportType,
      vehicleType: values.vehicle,
      cityId: values.cityId,
    });
    setOtherTransportVoucherLine({
      adultsCount: Number(values.adultsCount),
      kidsCount: Number(values.kidsCount),
      date: values.date,
      time: values.time,
      startLocation: values.startLocation,
      endLocation: values.endLocation,
      remarks: values.notes,
      otherTransportId: '0',
      transportVoucherId: '0',
    });
  };

  const getCityById = (id: string) => {
    setDrivers([]);
    setDriversLoading(false);
    const city = cities.find((city) => city.id === Number(id));
    setSelectedCity(city);
    return city;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <FormField
            name="transportType"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue="Sea" value={field.value ?? 'Sea'}>
                    <SelectTrigger className="bg-slate-100 shadow-md">
                      <SelectValue placeholder="Select transport type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sea">Sea</SelectItem>
                      <SelectItem value="Land">Land</SelectItem>
                      <SelectItem value="Air">Air</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            />
            
            <FormField
            name="vehicle"
            control={form.control}
            render={({ field }) => (
              <FormItem>
              <FormLabel>Vehicle</FormLabel>
                <FormControl>
                <Input
                  type="text"
                  placeholder="Enter vehicle type"
                  {...field}
                  className="h-10 w-full rounded-md border border-gray-300 p-2 text-sm"
                />
                </FormControl>
              <FormMessage />
              </FormItem>
            )}
            />
            <FormField
            name="cityId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(Number(value));
                      // getHotelId(value);
                      getCityById(value);
                    }}
                  >
                    <SelectTrigger className="bg-slate-100 shadow-md">
                      <SelectValue placeholder={cities.length === 0 ? 'There are no other transport methods added' : 'Select a city'} />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.id.toString()}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-4 gap-3">
          <FormField
            name="startLocation"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Location</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter start location"
                    {...field}
                    className="h-10 w-full rounded-md border border-gray-300 p-2 text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="endLocation"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Location</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter end location"
                    {...field}
                    className="h-10 w-full rounded-md border border-gray-300 p-2 text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
                    <FormField
            name="date"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(new Date(field.value), "LLL dd, y")
                          ) : (
                            <span>Pick the date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          initialFocus
                          selected={
                            field.value
                              ? parse(field.value, "MM/dd/yyyy", new Date())
                              : new Date()
                          }
                          onSelect={(date: Date | undefined) => {
                            const dateString = format(
                              date ?? new Date(),
                              "MM/dd/yyyy",
                            );
                            field.onChange(dateString);
                          }}
                          disabled={(date) => {
                            const min = new Date(bookingDetails.general.startDate);
                            const max = new Date(bookingDetails.general.endDate)
                            min.setHours(0, 0, 0, 0);
                            max.setHours(0, 0, 0, 0)
                            return date < min || date > max;
                          }}
                          numberOfMonths={1}
                        />
                      </PopoverContent>
                    </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="time"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    placeholder="Pick time"
                    {...field}
                    className="h-10 w-full rounded-md border border-gray-300 p-2 text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField
            name="adultsCount"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adults</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter number of adults"
                    {...field}
                    className="h-10 w-full rounded-md border border-gray-300 p-2 text-sm"
                    min={0}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="kidsCount"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kids</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter number of kids"
                    {...field}
                    className="h-10 w-full rounded-md border border-gray-300 p-2 text-sm"
                    min={0}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full flex-row justify-end">
          <Button variant={"primaryGreen"} type="submit" className="px-5">
            Search
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default OtherTransportForm;
