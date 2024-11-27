"use client";

import { useOrganization } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { z } from "zod";
import { useAddActivity } from "~/app/dashboard/activities/add/context";
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
import { getAllCities } from "~/server/db/queries/activities";
import { SelectCity } from "~/server/db/schemaTypes";



// Define the schema for form validation
export const generalSchema = z.object({
  name: z.string().min(1, "Name is required"),
  // activity: z.string().min(1, "Activity is required"),
  primaryEmail: z.string().email("Invalid email address"),
  contactNumber: z.string().refine(
    (value) => {
      const phoneNumber = parsePhoneNumberFromString(value);
      return phoneNumber?.isValid() ?? false;
    },
    { message: "Invalid phone number" },
  ),
  streetName: z.string().min(1, "Street name is required"),
  cityName: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
});

// Define the type of the form values
type GeneralFormValues = z.infer<typeof generalSchema>;

const GeneralForm = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState<SelectCity[]>([]);
  const { setGeneralDetails, activityVendorDetails, setActiveTab } =
    useAddActivity();
  const [selectedCity, setSelectedCity] = useState<SelectCity>();
  const { city, ...general } = activityVendorDetails.general;
  const form = useForm<GeneralFormValues>({
    resolver: zodResolver(generalSchema),
    defaultValues: {
      ...general,
      cityName: city?.name,
      primaryEmail:general.primaryEmail ?? "N/A"
    },
  });
  const {organization, isLoaded} = useOrganization();


  const onSubmit: SubmitHandler<GeneralFormValues> = (data) => {
    console.log(data);
    setGeneralDetails({
      cityId: selectedCity?.id ?? 0,
      name: data.name,
      contactNumber: data.contactNumber,
      primaryEmail: data.primaryEmail,
      province: data.province,
      streetName: data.streetName,
      tenantId: "",
      city: selectedCity,
    });
    setActiveTab("activities");
  };

  const fetchData = async () => {
    try {
      // Run both requests in parallel
      setLoading(true);
      const country = organization?.publicMetadata.country as string ?? "LK";

      const [citiesResponse] = await Promise.all([getAllCities(country)]);

      if (!citiesResponse) {
        throw new Error("Error fetching cities");
      }

      console.log("Fetched cities:", citiesResponse);

      setCities(citiesResponse);
      setSelectedCity(city);

      setLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error("Error fetching data:", error);
    }
  };

  const { reset } = form;
  useEffect(() => {
    fetchData();
    form.setValue("cityName", city?.name ?? "");
  }, [city]);

  if (loading || !isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-3 gap-4">
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

          {/* <FormField
            name="activity"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Activity</FormLabel>
                <FormControl>
                  <Input placeholder="Enter activity" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

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
            name="contactNumber"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Number</FormLabel>
                <FormControl>
                <PhoneInput
                    country={"us"}
                    value={field.value}
                    onChange={(phone) => field.onChange(`+${phone}`)}
                    inputClass="w-full shadow-md"
                    inputStyle={{ width: "inherit" }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
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
          <FormField
            name="cityName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(valueFromSelection) => {
                      field.onChange(valueFromSelection);
                      setSelectedCity(
                        cities.find((c) => c.name === valueFromSelection),
                      );
                    }}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="bg-slate-100 shadow-md">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.name}>
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
          <div className="grid grid-cols-3 gap-4">
            {/* <FormField
                name="capacity"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter capacity" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
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
