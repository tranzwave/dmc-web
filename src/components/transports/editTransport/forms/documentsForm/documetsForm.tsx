"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useEditTransport } from "~/app/dashboard/transport/[id]/edit/context";
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
export const DocumentsSchema = z.object({
  driverLicense: z.string().min(1, "Driver's license is required"),
  guideLicense: z.string().min(1, "Guid license is required"),
  vehicleEmissionTest: z.string().min(1, "Vehicle emission test is required"),
  insurance: z.string().min(1, "Insurance is required"),
});

// Define the type of the form values
type DocumentsFormValues = z.infer<typeof DocumentsSchema>;

const DocumentsForm = () => {
  const { setDocumetsDetails, transportDetails } = useEditTransport();
  
  const form = useForm<DocumentsFormValues>({
    resolver: zodResolver(DocumentsSchema),
    defaultValues: transportDetails.documents,
  });



  const onSubmit: SubmitHandler<DocumentsFormValues> = (data) => {
    setDocumetsDetails(data);
    console.log(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-4 gap-4">
            <FormField
              name="driverLicense"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Driver's License</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter driver's license" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          <FormField
            name="guideLicense"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guide License</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter guid license"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          

          <FormField
            name="vehicleEmissionTest"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Emission Test</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter contact number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
            <FormField
              name="insurance"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Insurance</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Insurance" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

        <div className="flex w-full flex-row justify-end gap-2">
          <Button type="submit" variant={"primaryGreen"}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DocumentsForm;
