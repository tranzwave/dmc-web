'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { VehicleType } from "~/lib/types/driver/type";
import { Transport } from "./columns";

interface TransportFormProps {
  onSearchTransport: (transport: Transport) => void;
}

export const transportSchema = z.object({
  driver: z.nullable(z.any()),
  vehicle: z.enum([VehicleType.CAR, VehicleType.BUS, VehicleType.VAN, VehicleType.TUK], {
    required_error: "Vehicle type is required",
  }),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  languages: z.string().min(1, "Languages are required"),
  type: z.enum(["Driver", "Guide", "Both"], {
    required_error: "Type is required",
  }),
  remarks: z.string().optional(),
});

const TransportForm: React.FC<TransportFormProps> = ({ onSearchTransport }) => {
  const form = useForm<z.infer<typeof transportSchema>>({
    resolver: zodResolver(transportSchema),
    defaultValues: {
      driver: null,
      vehicle: VehicleType.CAR,
      startDate: "",
      endDate: "",
      languages: "",
      type: "Driver",
      remarks: "",
    },
  });

  const onSubmit = (values: z.infer<typeof transportSchema>) => {
    onSearchTransport(values as Transport);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <FormField name="vehicle" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="shadow-md bg-slate-100">
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={VehicleType.CAR}>Car</SelectItem>
                    <SelectItem value={VehicleType.BUS}>Bus</SelectItem>
                    <SelectItem value={VehicleType.VAN}>Van</SelectItem>
                    <SelectItem value={VehicleType.TUK}>Tuk Tuk</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="startDate" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="endDate" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <FormField name="languages" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Languages</FormLabel>
              <FormControl>
                <Input placeholder="Enter languages" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="type" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="shadow-md bg-slate-100">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Driver">Driver</SelectItem>
                    <SelectItem value="Guide">Guide</SelectItem>
                    <SelectItem value="Both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="remarks" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Remarks</FormLabel>
              <FormControl>
                <Input placeholder="Enter any remarks" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <div className="w-full flex flex-row justify-end">
          <Button variant={'primaryGreen'} type="submit" className="px-5">Search</Button>
        </div>
      </form>
    </Form>
  );
};

export default TransportForm;
