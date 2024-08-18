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
export const generalSchema = z.object({
  name: z.string().min(1, "Name is required"),
  language: z.string().min(1, "Activity is required"),
  primaryEmail: z.string().email("Invalid email address"),
  primaryContactNumber: z.string().min(1, "Contact number is required"),
  streetName: z.string().min(1, "Street name is required"),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  guid: z.string().min(1, "Capacity is required"),
  includes: z.object({
    vehicles: z.boolean(),
    charges: z.boolean(),
    documents: z.boolean(),
  }),
});

// Define the type of the form values
type GeneralFormValues = z.infer<typeof generalSchema>;

// Define checkbox options
const includesOptions = [
  { id: "vehicles", label: "Vehicles" },
  { id: "changes", label: "Charges" },
  { id: "documents", label: "Documents" },
];

const GeneralForm = () => {
  const { setGeneralDetails, transportDetails } = useAddTransport();
  const form = useForm<GeneralFormValues>({
    resolver: zodResolver(generalSchema),
    defaultValues: transportDetails.general,
  });

  const onSubmit: SubmitHandler<GeneralFormValues> = (data) => {
    console.log(data);
    setGeneralDetails(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-4 gap-4">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name" {...field} />
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
                <FormLabel>Language</FormLabel>
                <FormControl>
                  <Input placeholder="Enter language" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="primaryEmail"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter primary email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="primaryContactNumber"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Number</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter contact number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <FormField
              name="streetName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Street Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-2">
            <div className="grid grid-cols-3 gap-4">
              <FormField
                name="city"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="province"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Province</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter province" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="guid"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guid</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter guid" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex w-full flex-row justify-end">
          <Button type="submit" variant={"primaryGreen"}>
            Next
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default GeneralForm;
