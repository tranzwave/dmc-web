"use client";

import { useOrganization } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { z } from "zod";
import { useAddHotel } from "~/app/dashboard/hotels/add/context";
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
import { InsertHotel, SelectCity } from "~/server/db/schemaTypes";

// Define the schema for form validation
export const hotelGeneralSchema = z.object({
  name: z.string().min(1, "Hotel name is required"),
  stars: z.number().min(1, "Star rating is required"),
  primaryEmail: z.string().email("Invalid email address"),
  primaryContactNumber: z.string().refine(
    (value) => {
      const phoneNumber = parsePhoneNumberFromString(value);
      return phoneNumber?.isValid() ?? false;
    },
    { message: "Invalid phone number" },
  ),
  streetName: z.string().min(1, "Street name is required"),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  hasRestaurant: z.boolean().default(true),
});

export const restaurantSchema = z.object({
  name: z.string().min(1, "Restaurant name is required"),
  streetName: z.string().min(1, "Street name is required"),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  contactNumber: z.string().min(1, "Contact number is required"),
});

export const restaurantMealSchema = z.object({
  mealType: z.string().min(1, "Meal type is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
});

// type HotelGeneralType = z.infer<typeof hotelGeneralSchema>;
type RestaurantType = z.infer<typeof restaurantSchema>;
type RestaurantMealType = z.infer<typeof restaurantMealSchema>;
type HotelGeneralFormData = z.infer<typeof hotelGeneralSchema>;

const HotelGeneralForm = ({
  defaultValues,
}: {
  defaultValues: InsertHotel;
}) => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState<SelectCity[]>([]);
  const [selectedCity, setSelectedCity] = useState(0);
  const {memberships, organization, isLoaded} = useOrganization();


  const {
    setHotelGeneral,
    hotelGeneral,
    addRestaurant,
    addRestaurantMeal,
    restaurants,
    restaurantMeals,
    setActiveTab,
  } = useAddHotel();

  const generalForm = useForm<HotelGeneralFormData>({
    resolver: zodResolver(hotelGeneralSchema),
    defaultValues: {
      name: defaultValues.name,
      stars: defaultValues.stars,
      primaryEmail: defaultValues.primaryEmail,
      primaryContactNumber: defaultValues.primaryContactNumber,
      streetName: defaultValues.streetName,
      city: defaultValues.cityId.toString(),
      province: defaultValues.province,
      hasRestaurant: defaultValues.hasRestaurant
    },
  });

  const { reset } = generalForm; // Destructure the reset method

  const onGeneralSubmit: SubmitHandler<HotelGeneralFormData> = (values) => {
    console.log(values);
    setHotelGeneral({
      name: values.name,
      stars: values.stars,
      primaryEmail: values.primaryEmail,
      primaryContactNumber: values.primaryContactNumber,
      streetName: values.streetName,
      cityId: Number(values.city),
      tenantId: hotelGeneral.tenantId ?? "",
      province: values.province,
      hasRestaurant: values.hasRestaurant,
    });

    setActiveTab("rooms");
  };

  const handleHasRestaurantChange = (value: string) => {
    if (value === "true") {
      generalForm.setValue("hasRestaurant", true);
    }
  };

  const fetchData = async () => {
    try {
      // Run both requests in parallel
      setLoading(true);
      const country = organization?.publicMetadata.country as string ?? "LK";

      const [citiesResponse] = await Promise.all([getAllCities(country)]);

      if (!citiesResponse) {
        throw new Error("Error fetching countries");
      }

      console.log("Fetched Users:", citiesResponse);

      setCities(citiesResponse);

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

  useEffect(() => {
    fetchData();
    if (defaultValues) {
      console.log(defaultValues)
      setSelectedCity(defaultValues.cityId)
      // alert("here")
      console.log(generalForm.getValues())
    }
    reset(defaultValues);
  }, [hotelGeneral]);

  if (loading || !isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Form {...generalForm}>
        <form
          onSubmit={generalForm.handleSubmit(onGeneralSubmit)}
          className="space-y-8"
        >
          <div className="grid grid-cols-4 gap-4">
            <FormField
              name="name"
              control={generalForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hotel Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter hotel name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="stars"
              control={generalForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Star Category</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))} // Convert the selected value to a number
                      value={field.value?.toString() ?? ""} // Ensure the value is a string for Select
                    >
                      <SelectTrigger className="bg-slate-100 shadow-md">
                        <SelectValue placeholder="Select star rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                      </SelectContent>
                    </Select>
                    {/* <Input
                      type="number"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      placeholder="Enter star rating"
                    /> */}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="primaryEmail"
              control={generalForm.control}
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
              control={generalForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Contact Number</FormLabel>
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

          <div className="grid grid-cols-4 gap-4">
            <FormField
              name="streetName"
              control={generalForm.control}
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
            {cities && (
              <FormField
                name="city"
                control={generalForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      {/* <Input placeholder="Enter city" {...field} /> */}
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                        value={
                          field.value ||
                          cities
                            .find((city) => city.id === selectedCity)
                            ?.id?.toString()
                        } // Ensure initial value is set correctly
                        defaultValue={cities
                          .find((city) => city.id === selectedCity)
                          ?.id?.toString()} // Set the initial default value
                      >
                        <SelectTrigger className="bg-slate-100 shadow-md">
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem
                              key={city.id}
                              value={String(city.id ?? 0) ?? "0"}
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
            )}

            <FormField
              name="province"
              control={generalForm.control}
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
              name="hasRestaurant"
              control={generalForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Has Restaurant</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={handleHasRestaurantChange}
                      value={field.value ? "false" : "true"}
                    >
                      <SelectTrigger className="bg-slate-100 shadow-md">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex w-full flex-row justify-end">
            <Button type="submit" variant={"primaryGreen"}>
              Next
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default HotelGeneralForm;
