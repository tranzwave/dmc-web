"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useAddTransport } from "~/app/dashboard/transport/add/context";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";


// Define the schema for form validation
export const ChargesSchema = z.object({
  feePerKm: z.number().min(1, "Fee per km is required"),
  fuelAllowance: z.number().min(1, "Fuel allowance is required"),
  accommodationAllowance: z.number().min(1, "Accommodation allowance is required"),
  mealAllowance: z.number().min(1, "Meal allowance is required"),
});

// Define the type of the form values
type ChargesFormValues = z.infer<typeof ChargesSchema>;

const ChargesForm = () => {
  const { setChargesDetails, transportDetails, setActiveTab } = useAddTransport();

  const form = useForm<ChargesFormValues>({
    resolver: zodResolver(ChargesSchema),
    defaultValues: transportDetails.charges,
  });

  const onSubmit: SubmitHandler<ChargesFormValues> = (data) => {
    setChargesDetails(data);
    console.log(data);
    setActiveTab("documents")
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-4 gap-4">
            <FormField
              name="feePerKm"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fee Per km</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter fee per km" 
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          <FormField
            name="fuelAllowance"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fuel Allowance</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter fuel allowance"
                    value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          

          <FormField
            name="accommodationAllowance"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Accommodation Allowance</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter accommodation allowance"
                    value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
            <FormField
              name="mealAllowance"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meal ALlowance</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter meal allowance"
                    value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>


  

        <div className="flex w-full flex-row justify-end gap-2">
          <Button type="submit" variant={"primaryGreen"}>
            Next
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ChargesForm;
