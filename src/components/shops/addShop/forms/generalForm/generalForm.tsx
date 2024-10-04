"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useAddShop } from "~/app/dashboard/shops/add/context";
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
import { getAllCities, getAllShopTypes } from "~/server/db/queries/shops";
import { SelectCity, SelectShopType } from "~/server/db/schemaTypes";

// Define the schema using Zod for validation
export const generalSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contactNumber: z.string().min(1, "Contact number is required"),
  streetName: z.string().min(1, "Street name is required"),
  province: z.string().min(1, "Province is required"),
  cityName: z.string().min(1, "City is required"),
  typeName: z.string().min(1, "Shop type is required"),
});

type GeneralFormValues = z.infer<typeof generalSchema>;

const GeneralForm = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState<SelectCity[]>([]);
  const [shopTypes, setShopTypes] = useState<SelectShopType[]>([]);
  const { setGeneralDetails, shopDetails, setActiveTab } = useAddShop();
  const [selectedCity, setSelectedCity] = useState<SelectCity>();
  const [selectedShopType, setSelectedShopType] = useState<SelectShopType>();

  // Initialize form with default values using React Hook Form
  const { city, ...general } = shopDetails.general;
  const form = useForm<GeneralFormValues>({
    resolver: zodResolver(generalSchema),
    defaultValues: {
      ...general,
      cityName: city?.name,
      typeName: "",
    },
  });

  // Handle form submission
  const onSubmit: SubmitHandler<GeneralFormValues> = (data) => {
    console.log(data);
    setGeneralDetails({
      cityId: selectedCity?.id ?? 0,
      name: data.name,
      contactNumber: data.contactNumber,
      province: data.province,
      streetName: data.streetName,
      tenantId: "",
      city: selectedCity,
      shopTypes: selectedShopType ? [selectedShopType] : [], // Ensure shopTypes is an array
    });
    setActiveTab("submit");
  };

  // Fetch Cities Data
  const fetchCities = async () => {
    try {
      setLoading(true);
      const citiesResponse = await getAllCities("LK");

      if (!citiesResponse) {
        throw new Error("Error fetching cities");
      }

      setCities(citiesResponse);
      setSelectedCity(city);
      setLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    }
  };

  // Fetch Shop Types Data
  const fetchShopTypes = async () => {
    try {
      setLoading(true);
      const shopTypesResponse = await getAllShopTypes();

      if (!shopTypesResponse) {
        throw new Error("Error fetching shop types");
      }

      setShopTypes(shopTypesResponse);
      setSelectedShopType(selectedShopType);
      setLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    }
  };

  useEffect(() => {
    fetchCities();
    fetchShopTypes();
  }, []);

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

          <FormField
            name="typeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shop Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(valueFromSelection) => {
                      field.onChange(valueFromSelection);
                      setSelectedShopType(
                        shopTypes.find((s) => s.name === valueFromSelection)
                      );
                    }}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="bg-slate-100 shadow-md">
                      <SelectValue placeholder="Select shop type" />
                    </SelectTrigger>
                    <SelectContent>
                      {shopTypes.map((type) => (
                        <SelectItem key={type.id} value={type.name}>
                          {type.name}
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
            name="contactNumber"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Number</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter contact number" {...field} />
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
                  <Input placeholder="Enter street name" {...field} />
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
                        cities.find((c) => c.name === valueFromSelection)
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
        </div>

        <div className="flex w-full flex-row justify-end">
          <Button type="submit" variant="primaryGreen">
            Next
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default GeneralForm;
