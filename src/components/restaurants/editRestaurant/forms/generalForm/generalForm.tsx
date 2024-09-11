"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useEditRestaurant } from "~/app/dashboard/restaurants/[id]/edit/context";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { getAllCities } from "~/server/db/queries/restaurants";
import { SelectCity } from "~/server/db/schemaTypes";

// Define the schema for form validation
export const generalSchema = z.object({
  name: z.string().min(1, "Name is required"),
  mealType: z.string().min(1, "End time is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "Contact number is required"),
  streetName: z.string().min(1, "Street name is required"),
  cityId: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  primaryContactNumber: z.string().min(1, "Contact number is required"),
  tenantId: z.string().default("f7f856e0-5be1-4a62-bd6c-b3f0dd887ac0"),
});

// Define the type of the form values
type GeneralFormValues = z.infer<typeof generalSchema>;

const GeneralForm = () => {
  const { setGeneralDetails, restaurantDetails } = useEditRestaurant();
  const [cities, setCities] = useState<SelectCity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
        try {
            setLoading(true);
            const result = await getAllCities();
            setCities(result);
        } catch (error) {
            console.error("Failed to fetch restaurant data:", error);
            setError("Failed to load data.");
        } finally {
            setLoading(false);
        }
    }

    fetchData();
}, []);

  const form = useForm<GeneralFormValues>({
    resolver: zodResolver(generalSchema),
    defaultValues: restaurantDetails.general,
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
            name="mealType"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meal Type</FormLabel>
                <FormControl>
                  <Input placeholder="Enter meal type" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="startTime"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input placeholder="" type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="endTime"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input placeholder="" type="date" {...field} />
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
            name="cityId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      alert(value);
                    }}
                    value={field.value}
                  >
                    <SelectTrigger className="bg-slate-100 shadow-md">
                      <SelectValue placeholder="Select city" />
                      
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem
                          key={city.id}
                          value={String(city.id)}
                        >
                          {city.name}
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
