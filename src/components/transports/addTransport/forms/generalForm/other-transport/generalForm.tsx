"use client";

import { useOrganization } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { set } from "date-fns";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { z } from "zod";
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
import { toast } from "~/hooks/use-toast";
import { getAllCities } from "~/server/db/queries/activities";
import { getAllLanguages, insertOtherTransport } from "~/server/db/queries/transport";
import { tenant } from "~/server/db/schema";
import { SelectCity, SelectLanguage } from "~/server/db/schemaTypes";

// Define the schema for form validation
export const generalSchema = z.object({
  name: z.string().min(1, "Name is required"),
  primaryEmail: z.string().email("Invalid email address"),
  primaryContactNumber: z.string().refine(
    (value) => {
      const phoneNumber = parsePhoneNumberFromString(value);
      return phoneNumber?.isValid() ?? false;
    },
    { message: "Invalid phone number" },
  ),
  streetName: z.string().min(1, "Street name is required"),
  cityId: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  transportMethod: z.enum(['Sea', 'Land', 'Air']).refine((value) => !!value, {
    message: "Transport method is required",
  }),
  vehicleType: z.string().min(1, "Vehicle type is required"),
  startLocation: z.string().min(1, "Start location is required"),
  destination: z.string().min(1, "Destination is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  price: z.number().min(0, "Price must be a positive number"),
  notes: z.string().optional(),
});

// Define the type of the form values
type GeneralFormValues = z.infer<typeof generalSchema>;

//Prop type
type AddOtherTransportGeneralFormProps = {
  defaultValues?: GeneralFormValues;
};


const AddOtherTransportGeneralForm = ({ defaultValues }: AddOtherTransportGeneralFormProps) => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState<SelectCity[]>([]);
  const [languages, setLanguages] = useState<SelectLanguage[]>([]);
  // const { setGeneralDetails, transportDetails, setActiveTab } =
  //   useAddTransport();
  const form = useForm<GeneralFormValues>({
    resolver: zodResolver(generalSchema),
    defaultValues: defaultValues ?? {},
  });
  const { memberships, organization, isLoaded } = useOrganization();
  const [saving, setSaving] = useState(false);


  const onSubmit: SubmitHandler<GeneralFormValues> = async(data) => {
    
    // call the addOtherTransport async function inside a try-catch
    setSaving(true);
    try {
      const otherTransport = {
        ...data,
        primaryContactNumber: parsePhoneNumberFromString(
          data.primaryContactNumber
        )?.formatInternational(),
        cityId: Number(data.cityId),
        price: data.price.toString(),
      };

      console.log(otherTransport);

      // Call insert other transport function
      if(!organization?.id) {
        throw new Error("Organization ID not found");
      }

      const result = await insertOtherTransport(otherTransport, organization.id);
      console.log("Added other transport:", result);
      if (!result) {
        throw new Error("Failed to add other transport");
      }
      setSaving(false);
      toast({
        title: "Successfuly Added",
        description: `${data.vehicleType} has been added successfully`,
      })
    }
    catch (error:any) {
      console.error("Failed to add other transport:", error);
      setError("Failed to add other transport.");
      setSaving(false);
      toast({
        title: "Failed to Add",
        description: `${error}`,
      })
    } finally {
      // setActiveTab("details");
      setSaving(false);
    }


  };

  const fetchData = async () => {
    try {
      // Run both requests in parallel
      setLoading(true);
      const country = organization?.publicMetadata.country as string ?? "LK";

      const [citiesResponse, languagesResponse] = await Promise.all([
        getAllCities(country),
        getAllLanguages(),
      ]);

      if (!citiesResponse) {
        throw new Error("Error fetching cities");
      }

      if (!languagesResponse) {
        throw new Error("Error fetching languages");
      }

      console.log("Fetched cities:", citiesResponse);
      console.log("Fetched langs:", languagesResponse);

      setCities(citiesResponse);
      setLanguages(languagesResponse);

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
  }, []);

  if (loading || !isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            name="transportMethod"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={
                      typeof field.value === "string"
                        ? field.value
                        : undefined
                    }
                  >
                    <SelectTrigger className="bg-slate-100 shadow-md">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Land">Land</SelectItem>
                      <SelectItem value="Sea">Sea</SelectItem>
                      <SelectItem value="Air">Air</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Vehicle type field */}
          <FormField
            name="vehicleType"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Type</FormLabel>
                <FormControl>
                  <Input placeholder="Enter vehicle type" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
                name="cityId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      {/* <Input placeholder="Enter city" {...field} /> */}
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                        value={field.value}
                        defaultValue={form.getValues("cityId")}
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
          {/* other fields */}
        </div>

        <div className="grid grid-cols-4 gap-4">
        <FormField
            name="startLocation"
            control={form.control}
            render={({ field }) => (
              <FormItem>
          <FormLabel>Start Location</FormLabel>
          <FormControl>
            <Input placeholder="Enter start location" {...field} />
          </FormControl>
          <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="destination"
            control={form.control}
            render={({ field }) => (
              <FormItem>
          <FormLabel>Destination</FormLabel>
          <FormControl>
            <Input placeholder="Enter destination" {...field} />
          </FormControl>
          <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="capacity"
            control={form.control}
            render={({ field }) => (
              <FormItem>
          <FormLabel>Capacity</FormLabel>
          <FormControl>
            <Input
              type="number"
              placeholder="Enter capacity"
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          </FormControl>
          <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="price"
            control={form.control}
            render={({ field }) => (
              <FormItem>
          <FormLabel>Price</FormLabel>
          <FormControl>
            <Input
              type="number"
              placeholder="Enter price"
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          </FormControl>
          <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex w-full flex-row justify-end">
            <Button type="submit" variant={"primaryGreen"} disabled={saving}>
            {saving ? 
            <div className="flex flex-row gap-2 items-center">
              <LoaderCircle size={15} className="animate-spin"/>
              <span>Saving</span>
              </div> : "Save"}
            </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddOtherTransportGeneralForm;