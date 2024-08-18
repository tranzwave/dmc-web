"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
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
import { ArrowRightSquareIcon } from "lucide-react";

// Define the schema for form validation
export const hotelGeneralSchema = z.object({
  hotelName: z.string().min(1, "Hotel name is required"),
  stars: z.number().min(1, "Star rating is required"),
  primaryEmail: z.string().email("Invalid email address"),
  primaryContactNumber: z.string().min(1, "Primary contact number is required"),
  streetName: z.string().min(1, "Street name is required"),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  hasRestaurant: z.boolean().optional(),
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

type HotelGeneralType = z.infer<typeof hotelGeneralSchema>;
type RestaurantType = z.infer<typeof restaurantSchema>;
type RestaurantMealType = z.infer<typeof restaurantMealSchema>;

const HotelGeneralForm = () => {
  const {
    setHotelGeneral,
    hotelGeneral,
    addRestaurant,
    addRestaurantMeal,
    restaurants,
    restaurantMeals,
  } = useAddHotel(); // Adjusted context hook
  const [showRestaurantForm, setShowRestaurantForm] = useState<boolean>(
    hotelGeneral.hasRestaurant ?? false,
  );
  const [showMealForm, setShowMealForm] = useState<boolean>(false)

  const generalForm = useForm<HotelGeneralType>({
    resolver: zodResolver(hotelGeneralSchema),
    defaultValues: hotelGeneral, // Adjusted to hotelDetails
  });
  const restaurantForm = useForm<RestaurantType>({
    resolver: zodResolver(restaurantSchema),
  });

  const restaurantMealForm = useForm<RestaurantMealType>({
    resolver: zodResolver(restaurantMealSchema),
  });

  const onGeneralSubmit: SubmitHandler<HotelGeneralType> = (data) => {
    console.log(data);
    setHotelGeneral(data);
    // restaurantForm.setValue("streetName",data.streetName);
    // restaurantForm.setValue("city",data.city);
    // restaurantForm.setValue("province",data.province);
    // restaurantForm.setValue("contactNumber",data.primaryContactNumber)
    // setShowRestaurantForm(data.hasRestaurant ?? false);

  };

  const onRestaurantNameSubmit: SubmitHandler<RestaurantType> = (data) => {
    console.log(restaurants)
    console.log(data)
    const existingRestaurant = restaurants.find(
      (res) => res.restaurant?.name === data.name
    );
  
    if (existingRestaurant) {
      console.log("Existing restaurant")
    } else {
      // Add a new restaurant
      addRestaurant({
        restaurant: data,
        meals: [],
      });
    }
  
    setShowMealForm(true);
  };

  const onRestaurantMealSubmit: SubmitHandler<RestaurantMealType> = (data) => {
    console.log(data);
    const existingRestaurant = restaurants.find(
      (res) => res.restaurant?.name === restaurantForm.getValues("name")
    );
    if(existingRestaurant){
      addRestaurantMeal(data,existingRestaurant.restaurant.name);
    }
    setShowMealForm(false)
    restaurantMealForm.reset();
    // Optionally handle restaurant submission here if needed
    console.log(restaurants)
  };

  const handleHasRestaurantChange = (value: string) => {
    const hasRestaurant = value === "true";
    generalForm.setValue("hasRestaurant", hasRestaurant);
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
              name="hotelName"
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
                  <FormLabel>Stars</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      placeholder="Enter star rating"
                    />
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
                    <Input
                      placeholder="Enter primary contact number"
                      {...field}
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

      {/* <div>
        {showRestaurantForm && (
          <div className="mt-4">
            <h2 className="card-title mb-4">Restaurant Details</h2>
            <div className="flex flex-row gap-1 w-full">
              <div className="w-1/3">              
                <Form {...restaurantForm}>
                  <form
                    onSubmit={restaurantForm.handleSubmit(onRestaurantNameSubmit)}
                    className="flex flex-row gap-2 space-y-8 w-full"
                  >
                    <FormField
                      name="name"
                      control={restaurantForm.control}
                      render={({ field }) => (
                        <FormItem className="w-4/5">
                          <FormLabel>Restaurant Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter restaurant name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" variant={"primaryGreen"}>
                      <ArrowRightSquareIcon />
                    </Button>
                  </form>
                </Form>
              </div>
              <div className="w-2/3">
              {showMealForm && (
                <Form {...restaurantMealForm}>
                  <form
                    onSubmit={restaurantMealForm.handleSubmit(
                      onRestaurantMealSubmit,
                    )}
                    className="flex flex-row items-start gap-2 w-full"
                  >
                    <div className="w-2/5">
                      <FormField
                        name="mealType"
                        control={restaurantMealForm.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meal Type</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter restaurant name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="w-1/5">
                      <FormField
                        name="startTime"
                        control={restaurantMealForm.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="w-1/5">
                      <FormField
                        name="endTime"
                        control={restaurantMealForm.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="mt-8">
                      <Button type="submit" variant={"primaryGreen"}>
                        Add
                      </Button>
                    </div>

                  </form>
                </Form>
              )}
              </div>
            </div>
          </div>
        )}
      </div> */}
    </div>
  );
};

export default HotelGeneralForm;
