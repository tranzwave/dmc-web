"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
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
import { SelectLanguage } from "~/server/db/schemaTypes";
import { Transport } from "./columns";

interface TransportFormProps {
  onSearchTransport: (transport: Transport) => void;
  vehicleTypes: string[];
  languages: SelectLanguage[];
}

export const transportSchema = z.object({
  transportType: z.nullable(z.any()),
  vehicle: z.string().min(1, "Vehicle type is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  language: z.string().min(1, "Languages are required"),
  type: z.enum(["Driver", "Chauffeur", "Guide"], {
    required_error: "Type is required",
  }),
  remarks: z.string().optional(),
});

const TransportForm: React.FC<TransportFormProps> = ({
  onSearchTransport: onSearchDriver,
  vehicleTypes,
  languages,
}) => {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<SelectLanguage>();
  const [selectedVehicleType, setSelectedVehicleType] = useState<
    string | null
  >();
  const [driverLoading, setDriversLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [selectedDriver, setSelectedDriver] = useState<any | null>();
  const { bookingDetails } = useEditBooking();

  const form = useForm<z.infer<typeof transportSchema>>({
    resolver: zodResolver(transportSchema),
    defaultValues: {
      transportType: null,
      vehicle: "Van",
      startDate: bookingDetails.general.startDate,
      endDate: bookingDetails.general.endDate,
      language: "",
      type: "Driver",
      remarks: "",
    },
  });

  const onSubmit = (values: z.infer<typeof transportSchema>) => {
    onSearchDriver({
      transportType: null,
      startDate: values.startDate,
      endDate: values.endDate,
      languageCode: values.language,
      type: values.type,
      vehicleType: values.vehicle,
      remarks: values.remarks,
    });
  };

  const getLanguageId = (code: string) => {
    setDrivers([]);
    setDriversLoading(false);
    const lan = languages.find((lan) => lan.code === code);
    setSelectedLanguage(lan);
  };

  const getVehicleType = (name: string) => {
    setSelectedVehicleType(null);
    setDrivers([]);
    setDriversLoading(false);
    setSelectedVehicleType(name);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <FormField
            name="type"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="bg-slate-100 shadow-md">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Driver">Driver</SelectItem>
                      <SelectItem value="Chauffeur">Chauffeur</SelectItem>
                      <SelectItem value="Guide">Guide</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.watch("type") === "Driver" || form.watch("type") === "Chauffeur" ? (
          <FormField
            name="vehicle"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      // getHotelId(value);
                      getVehicleType(value);
                    }}
                    value={field.value}
                  >
                    <SelectTrigger className="bg-slate-100 shadow-md">
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleTypes.map((type, index) => (
                        <SelectItem key={index} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ): (
          ""
        )}
          <FormField
            name="language"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Languages</FormLabel>
                <FormControl>
                  {/* <Input placeholder="Enter languages" {...field} /> */}
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      // getHotelId(value);
                      getLanguageId(value);
                    }}
                    value={field.value}
                  >
                    <SelectTrigger className="bg-slate-100 shadow-md">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lan) => (
                        <SelectItem key={lan.id} value={lan.code}>
                          {lan.name}
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
        <div className="grid grid-cols-3 gap-3">
          <FormField
            name="startDate"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
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
                            <span>Pick the start date</span>
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
            name="endDate"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
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
                            <span>Pick the end date</span>
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
                            const min = new Date(form.watch("startDate"));
                            const max = new Date(bookingDetails.general.endDate)
                            min.setHours(0, 0, 0, 0);
                            max.setHours(0, 0, 0, 0)
                            return date < min || date > max;
                          }}
                          numberOfMonths={1}
                        />
                      </PopoverContent>
                    </Popover>
                  {/* <Input
                    type="date"
                    {...field}
                    min={form.watch("startDate") ?? ""}
                    max={bookingDetails.general.endDate ?? ""}
                  /> */}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="remarks"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Note</FormLabel>
                <FormControl>
                  {/* <Input placeholder="Enter any special note" {...field} /> */}
                  <textarea
                    placeholder="Enter any special notes"
                    {...field}
                    className="h-20 w-full rounded-md border border-gray-300 p-2 text-sm"
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

export default TransportForm;
