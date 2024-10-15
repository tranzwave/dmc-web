"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useAddGuideTransport } from "~/app/dashboard/transport/guide/add/context";
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
  guideLicense: z.string().min(1, "Guid license is required"),
});

// Define the type of the form values
type DocumentsFormValues = z.infer<typeof DocumentsSchema>;

const DocumentsForm = () => {
  const { setDocumetsDetails, transportDetails, setActiveTab } = useAddGuideTransport();
  
  const form = useForm<DocumentsFormValues>({
    resolver: zodResolver(DocumentsSchema),
    defaultValues: transportDetails.documents,
  });

  const onSubmit: SubmitHandler<DocumentsFormValues> = (data) => {
    setDocumetsDetails(data);
    console.log(data);
    setActiveTab("submit")
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-4 gap-4">
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
