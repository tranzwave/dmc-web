"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useAddAgent } from "~/app/dashboard/agents/add/context";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { getAllCountries } from "~/server/db/queries/agents";
import { SelectCountry } from "~/server/db/schemaTypes";


// Define the schema for form validation
export const generalSchema = z.object({
  name: z.string().min(1, "Name is required"),
  countryCode: z.string().min(1, "Country is required"),
  email: z.string().email("Invalid email address"),
  primaryContactNumber: z.string().min(1, "Contact number is required"),
  agency: z.string().min(1, "Street name is required"),
  // feild1: z.string().min(1, "City is required"),
  // feild2: z.string().min(1, "Province is required"),
  // feild3: z.string().min(1, "Capacity is required"),
});

// Define the type of the form values
type GeneralFormValues = z.infer<typeof generalSchema>;

const GeneralForm = () => {
  const [countries, setCountries] = useState<SelectCountry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { setGeneralDetails, agentDetails, setActiveTab } = useAddAgent();
  const form = useForm<GeneralFormValues>({
    resolver: zodResolver(generalSchema),
    defaultValues: agentDetails.general,
  });

  const onSubmit: SubmitHandler<GeneralFormValues> = (data) => {
    console.log(data);
    setGeneralDetails(data);
    setActiveTab("submit")

  };

  const fetchData = async () => {
        try {
            setLoading(true);
            const result = await getAllCountries();
            setCountries(result);
        } catch (error) {
            console.error("Failed to fetch country data:", error);
            setError("Failed to load data.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
      fetchData();
    }, []);


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
            name="countryCode"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      alert(value);
                    }}
                    value={field.value}
                  >
                    <SelectTrigger className="bg-slate-100 shadow-md">
                      <SelectValue placeholder="Select country" />
                      
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((countryCode) => (
                        <SelectItem
                          key={countryCode.id}
                          value={String(countryCode.code)}
                        >
                          {countryCode.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                {/* <FormControl>
                  <Input placeholder="Enter country" {...field} />
                </FormControl> */}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="email"
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
              name="agency"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agency</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Agency" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-2">
            <div className="grid grid-cols-3 gap-4">
              {/* <FormField
                name="feild1"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feild 1</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter feild 1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="feild2"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feild 2</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter feild 2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="feild3"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feild 3</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter feild 3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </div>
          </div>
        </div>

        <div className="flex w-full flex-row justify-end">
          <Button type="submit" variant={"primaryGreen"}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default GeneralForm;

