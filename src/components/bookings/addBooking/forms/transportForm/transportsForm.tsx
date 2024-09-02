"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { VehicleType } from "~/lib/types/driver/type";
import { Transport } from "./columns";
import { SelectLanguage } from "~/server/db/schemaTypes";
import { useState } from "react";
import { useAddBooking } from "~/app/dashboard/bookings/add/context";

interface TransportFormProps {
  onSearchTransport: (transport: Transport) => void;
  vehicleTypes: string[];
  languages: SelectLanguage[];
}

export const transportSchema = z.object({
  driver: z.nullable(z.any()),
  vehicle: z.string().min(1, "Vehicle type is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  language: z.string().min(1, "Languages are required"),
  type: z.enum(["Driver", "Chauffer"], {
    required_error: "Type is required",
  }),
  remarks: z.string().optional(),
});

const TransportForm: React.FC<TransportFormProps> = ({
  onSearchTransport,
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
  const { bookingDetails } = useAddBooking();

  const form = useForm<z.infer<typeof transportSchema>>({
    resolver: zodResolver(transportSchema),
    defaultValues: {
      driver: null,
      vehicle: "",
      startDate: bookingDetails.general.startDate,
      endDate: bookingDetails.general.endDate,
      language: "",
      type: "Driver",
      remarks: "",
    },
  });

  const onSubmit = (values: z.infer<typeof transportSchema>) => {
    onSearchTransport({
      driver: null,
      startDate: values.startDate,
      endDate:values.endDate,
      languageCode:values.language,
      type:values.type,
      vehicleType:values.vehicle,
      remarks:values.remarks
    });
  };

  const getLanguageId = (code: string) => {
    setDrivers([]);
    setDriversLoading(false);
    const lan = languages.find((lan) => lan.code === code);
    alert(lan?.code);
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
                      <SelectItem value="Chauffer">Chauffer</SelectItem>
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
                  <Input type="date" {...field} />
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
                  <Input type="date" {...field} />
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
                <FormLabel>Remarks</FormLabel>
                <FormControl>
                  <Input placeholder="Enter any remarks" {...field} />
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
