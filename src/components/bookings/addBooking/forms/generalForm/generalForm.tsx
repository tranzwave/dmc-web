"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import { useAddBooking } from "~/app/dashboard/bookings/add/context";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

// Define the schema for form validation
export const generalSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  primaryEmail: z.string().email("Invalid email address"),
  startDate: z.string().min(1, "Start date is required"),
  numberOfDays: z.number().min(1, "Number of days must be at least 1"),
  endDate: z.string().min(1, "End date is required"),
  marketingManager: z.string().min(1, "Marketing manager is required"),
  agent: z.string().min(1, "Agent is required"),
  tourType: z.string().min(1, "Tour type is required"),
  includes: z.object({
    hotels: z.boolean(),
    transport: z.boolean(),
    activities: z.boolean(),
  }),
}).refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
  message: "End date cannot be earlier than start date",
  path: ["endDate"],
});

// Define the type of the form values
type GeneralFormValues = z.infer<typeof generalSchema>;

// Define checkbox options
const includesOptions = [
  { id: "hotels", label: "Hotels" },
  { id: "transport", label: "Transport" },
  { id: "activities", label: "Activities" },
];

const GeneralForm = () => {
  const { setGeneralDetails, bookingDetails } = useAddBooking();
  const form = useForm<GeneralFormValues>({
    resolver: zodResolver(generalSchema),
    defaultValues: bookingDetails.general,
  });

  const startDate = form.watch("startDate");
  const numberOfDays = form.watch("numberOfDays");

  useEffect(() => {
    if (startDate && numberOfDays) {
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + numberOfDays);
      form.setValue("endDate", endDate.toISOString().split("T")[0] ?? '');
    }
  }, [startDate, numberOfDays, form]);

  const onSubmit: SubmitHandler<GeneralFormValues> = (data) => {
    console.log(data);
    setGeneralDetails(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <FormField name="clientName" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Client Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter client name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="primaryEmail" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter primary email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField name="startDate" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="numberOfDays" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Days</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="endDate" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} min={form.watch("startDate") || ""}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField name="marketingManager" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Marketing Manager</FormLabel>
              <FormControl>
                <Input placeholder="Enter marketing manager's name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="agent" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Agent</FormLabel>
              <FormControl>
                <Input placeholder="Enter agent's name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField name="tourType" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Tour Type</FormLabel>
            <FormControl>
              <Input placeholder="Enter tour type" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField name="includes" control={form.control} render={({ field }) => (
          <FormItem>
            <div className="mb-4">
              <FormLabel className="text-base">Select Tour Includes</FormLabel>
              <FormDescription>
                Choose the options you want to include in this tour.
              </FormDescription>
            </div>
            <div className="w-full grid grid-cols-5 items-center gap-3">
              {includesOptions.map((option) => (
                <FormItem key={option.id} className="flex flex-row items-end rounded-lg  p-2 space-x-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value[option.id as keyof typeof field.value]}
                      onCheckedChange={(checked) => {
                        field.onChange({
                          ...field.value,
                          [option.id]: checked,
                        });
                      }}
                      name={option.id}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">{option.label}</FormLabel>
                </FormItem>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )} />

        <div className="w-full flex flex-row justify-end">
          <Button type="submit" variant={"primaryGreen"}>Next</Button>
        </div>
      </form>
    </Form>
  );
};

export default GeneralForm;
