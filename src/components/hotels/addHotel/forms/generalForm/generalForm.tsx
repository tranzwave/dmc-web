"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
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
import { toast } from "~/hooks/use-toast";
import { toTitleCase } from "~/lib/utils/index";
import { InsertHotel, SelectCity } from "~/server/db/schemaTypes";
import { hotelGeneralSchema, type HotelGeneralFormData } from "../schemas";

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

type Props = {
  defaultValues: InsertHotel;
  cities: SelectCity[];
  orgId: string;
};

const HotelGeneralForm = ({ defaultValues, cities, orgId }: Props) => {
  const [error, setError] = useState<string>();
  const { setHotelGeneral, hotelGeneral, setActiveTab } = useAddHotel();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const lastPayloadRef = useRef<string>("");
  const citiesMapRef = useRef<Record<string, { id: number; name: string }>>({});

  // Build a case-insensitive city lookup map when cities change
  useEffect(() => {
    const map: Record<string, { id: number; name: string }> = {};
    (cities || []).forEach((c) => {
      const key = (c.name ?? "").trim().toLowerCase();
      if (key) map[key] = { id: Number(c.id as any), name: c.name };
    });
    citiesMapRef.current = map;
  }, [cities]);

  const generalForm = useForm<HotelGeneralFormData>({
    resolver: zodResolver(hotelGeneralSchema),
    defaultValues: {
      name: defaultValues.name,
      stars: defaultValues.stars,
      primaryEmail: defaultValues.primaryEmail,
      primaryContactNumber: defaultValues.primaryContactNumber,
      streetName: defaultValues.streetName,
      province: defaultValues.province,
      hasRestaurant: defaultValues.hasRestaurant,
      city: toTitleCase(
        (cities ?? []).find((city) => String(city.id) === String(defaultValues.cityId))?.name ?? ""
      ),
    },
  });

  const { reset, watch, getValues, setValue } = generalForm;

  // Populate city once when cities arrive if the field is still empty
  useEffect(() => {
    const currentCity = (getValues("city") ?? "").trim();
    if (currentCity) return;
    const match = (cities ?? []).find((c) => String(c.id) === String(defaultValues.cityId));
    const initCity = toTitleCase(match?.name ?? "");
    if (initCity) {
      setValue("city", initCity, { shouldDirty: false, shouldTouch: false, shouldValidate: false });
    }
  }, [cities, defaultValues.cityId, getValues, setValue]);

  // Sync form values into context (debounced) so tab switches reflect latest edits
  useEffect(() => {
    const subscription = watch((values) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const inputCity = (values.city ?? "").trim();
        const foundCity = citiesMapRef.current[inputCity.toLowerCase()];
        const cityId = foundCity?.id ?? 0;
        const payload = {
          name: values.name ?? "",
          stars: values.stars! ?? 0,
          primaryEmail: values.primaryEmail ?? "",
          primaryContactNumber: values.primaryContactNumber ?? "",
          streetName: values.streetName ?? "",
          cityId,
          tenantId:
            hotelGeneral.tenantId && hotelGeneral.tenantId !== ""
              ? hotelGeneral.tenantId
              : orgId,
          province: values.province ?? "",
          hasRestaurant: values.hasRestaurant ?? false,
          city: toTitleCase(foundCity?.name ?? inputCity),
        };
        const key = JSON.stringify(payload);
        if (lastPayloadRef.current !== key) {
          lastPayloadRef.current = key;
          setHotelGeneral(payload as any);
        }
      }, 200);
    });
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      subscription.unsubscribe();
    };
  }, [watch, orgId, setHotelGeneral]);

  // Initialize once when defaults arrive and the form is still empty
  useEffect(() => {
    const currentName = (generalForm.getValues("name") ?? "").trim();
    const hasDefaults = Boolean(
      defaultValues?.name ||
      defaultValues?.primaryEmail ||
      defaultValues?.streetName ||
      defaultValues?.province
    );
    if (!hasDefaults) return;
    if (!currentName) {
      reset({
        name: defaultValues.name,
        stars: defaultValues.stars,
        primaryEmail: defaultValues.primaryEmail,
        primaryContactNumber: defaultValues.primaryContactNumber,
        streetName: defaultValues.streetName,
        province: defaultValues.province,
        hasRestaurant: defaultValues.hasRestaurant,
        city: toTitleCase(
          (cities ?? []).find((city) => String(city.id) === String(defaultValues.cityId))?.name ?? ""
        ),
      });
    }
  }, [defaultValues, cities, reset]);

  const onGeneralSubmit: SubmitHandler<HotelGeneralFormData> = (values) => {
    setActiveTab("rooms");
  };

  const handleHasRestaurantChange = (value: string) => {
    generalForm.setValue("hasRestaurant", value === "true");
  };

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
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString() ?? ""}
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
            <FormField
              name="city"
              control={generalForm.control}
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
                      value={field.value ? "true" : "false"}
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
