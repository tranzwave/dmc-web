"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";

export const generalSchema = z.object({
    clientName: z.string().min(1, "Client name is required"),
    primaryEmail: z.string().email("Invalid email address"),
    startDate: z.string().min(1, "Start date is required"),
    numberOfDays: z.number().min(1, "Number of days must be at least 1"),
    endDate: z.string().min(1, "End date is required"),
    marketingManager: z.string().min(1, "Marketing manager is required"),
    agent: z.string().min(1, "Agent is required"),
    tourType: z.string().min(1, "Tour type is required"),
    checkboxes: z.object({
      hotels: z.boolean(),
      transport: z.boolean(),
      activities: z.boolean(),
    }),
  });

// Define the type of the form values
type GeneralFormValues = z.infer<typeof generalSchema>;

const GeneralForm = () => {
  const form = useForm<GeneralFormValues>({
    resolver: zodResolver(generalSchema),
    defaultValues: {
      clientName: "",
      primaryEmail: "",
      startDate: "",
      numberOfDays: 1,
      endDate: "",
      marketingManager: "",
      agent: "",
      tourType: "",
      checkboxes: {
        hotels: false,
        transport: false,
        activities: false,
      },
    },
  });

  const onSubmit = (values:GeneralFormValues) => {
    // Do something with the form values
    console.log(values);
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
                <FormMessage/>
            </FormItem>
            )} />
            <FormField name="primaryEmail" control={form.control} render={({ field }) => (
            <FormItem>
                <FormLabel>Primary Email</FormLabel>
                <FormControl>
                <Input type="email" placeholder="Enter primary email" {...field} />
                </FormControl>
                <FormMessage/>
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
                <FormMessage/>
            </FormItem>
            )} />
            <FormField name="numberOfDays" control={form.control} render={({ field }) => (
            <FormItem>
                <FormLabel>Number of Days</FormLabel>
                <FormControl>
                <Input type="number" {...field} />
                </FormControl>
                <FormMessage/>
            </FormItem>
            )} />
            <FormField name="endDate" control={form.control} render={({ field }) => (
            <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                <Input type="date" {...field} />
                </FormControl>
                <FormMessage/>
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
                    <FormMessage/>
                </FormItem>
                )} />
            <FormField name="agent" control={form.control} render={({ field }) => (
                <FormItem>
                    <FormLabel>Agent</FormLabel>
                    <FormControl>
                    <Input placeholder="Enter agent's name" {...field} />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )} />            
        </div>

            <FormField name="tourType" control={form.control} render={({ field }) => (
            <FormItem>
                <FormLabel>Tour Type</FormLabel>
                <FormControl>
                <Input placeholder="Enter tour type" {...field} />
                </FormControl>
                <FormMessage/>
            </FormItem>
            )} />
        <div className="grid grid-cols-6 gap-6">
            <FormField name="checkboxes.hotels" control={form.control} render={({ field }) => (
                <FormItem className="flex flex-row justify-between items-center px-2 bg-[#f2f4f8] rounded-sm h-10">
                <FormLabel>Hotels</FormLabel>
                <div className="pb-1">
                    <FormControl>
                        <Checkbox checked={field.value} onChange={field.onChange} name={field.name}/>
                    </FormControl>
                </div>

                <FormMessage/>
                </FormItem>
            )} />
            <FormField name="checkboxes.transport" control={form.control} render={({ field }) => (
                <FormItem className="flex flex-row justify-between items-center px-2 bg-[#f2f4f8] rounded-sm h-10">
                <FormLabel>Transport</FormLabel>
                <div className="pb-1">
                    <FormControl>
                        <Checkbox checked={field.value} onChange={field.onChange} name={field.name}/>
                    </FormControl>
                </div>
                <FormMessage/>
                </FormItem>
            )} />
            <FormField name="checkboxes.activities" control={form.control} render={({ field }) => (
                <FormItem className="flex flex-row justify-between items-center px-2 bg-[#f2f4f8] rounded-sm h-10">
                <FormLabel>Activities</FormLabel>
                <div className="pb-1">
                    <FormControl>
                        <Checkbox checked={field.value} onChange={field.onChange} name={field.name}/>
                    </FormControl>
                </div>
                <FormMessage/>
                </FormItem>
            )} />
        </div>
        <div className="w-full flex flex-row justify-end">
            <Button variant={'primaryGreen'} type="submit" className="px-5">Next</Button>
        </div>
      </form>
    </Form>
  );
};

export default GeneralForm;
