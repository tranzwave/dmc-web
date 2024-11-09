"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import {
  InsertRestaurantVoucherLine,
  SelectMeal
} from "~/server/db/schemaTypes";
import { RestaurantData } from ".";

interface RestaurantFormProps {
  onAddRestaurant: (
    data: InsertRestaurantVoucherLine,
    restaurant: RestaurantData,
  ) => void;
  restaurants: RestaurantData[];
  defaultValues: InsertRestaurantVoucherLine | null;
  lockedVendorId?: string;
  amendment?: boolean;  // Add this to include 'amendment'
  isUpdating?: boolean

}

export const restaurantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  quantity: z.object({
    adults: z.number().min(1, "Adults quantity is required"),
    kids: z.number().min(0, "Kids quantity is required"),
  }),
  date: z.string().min(1, "Date is required"),
  time: z.string().optional().or(z.literal("12:00")),
  mealType: z.string().min(1, "Meal type is required"),
  remarks: z.string().optional(), // Optional field
});

const RestaurantForm: React.FC<RestaurantFormProps> = ({
  onAddRestaurant,
  restaurants,
  defaultValues,
  lockedVendorId,
}) => {
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<RestaurantData | null>();
  const [meals, setMeals] = useState<SelectMeal[]>([]);

  const [selectedMeal, setSelectedMeal] = useState<SelectMeal>();
  const [rests, setRests] = useState<RestaurantData[]>([]);
  const [showTimeField, setShowTimeField] = useState(false);

  // const fetchMeals = async (restaurantId: string) => {
  //   const response = await getMeals;
  // };
  const form = useForm<z.infer<typeof restaurantSchema>>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      date: defaultValues?.date,
      mealType: defaultValues?.mealType,
      name: defaultValues?.restaurantVoucherId,
      quantity: {
        adults: defaultValues?.adultsCount,
        kids: defaultValues?.kidsCount,
      },
      remarks: defaultValues?.remarks ?? "",
      time: defaultValues?.time ?? "12:00",
    },
  });

  function onSubmit(values: z.infer<typeof restaurantSchema>) {
    const voucherLine: InsertRestaurantVoucherLine = {
      //TODO:
      adultsCount: Number(form.getValues("quantity.adults")),
      kidsCount: Number(form.getValues("quantity.kids")),
      date: form.getValues("date").toString(),
      mealType: form.getValues("mealType"),
      restaurantVoucherId: "",
      time: form.getValues("time") ?? "10:00",
      remarks: form.getValues("remarks"),
    };
    if (!selectedRestaurant) {
      throw new Error("Can't fetch selected restaurant");
    }
    onAddRestaurant(voucherLine, selectedRestaurant);
    form.reset();
  }

  function getRestaurantId(restaurantName: string) {
    const restaurant = restaurants.find(
      (restaurant) => restaurant.name === restaurantName,
    );
    const id = restaurant?.id;
    setSelectedRestaurant(restaurant);
  }

  useEffect(() => {
    setRests(restaurants);
    if (lockedVendorId) {
      const lockedRestaurant = restaurants.find(
        (res) => res.id === lockedVendorId,
      );
      if (lockedRestaurant) {
        setRests([lockedRestaurant]);
        setSelectedRestaurant(lockedRestaurant);
        if (defaultValues?.mealType) {
          const meal = lockedRestaurant.restaurantMeal.find(
            (m) => m.mealType === defaultValues.mealType,
          );
          if (meal) {
            setSelectedMeal(meal);
          }
        }
      }
    }
    console.log(restaurants);
  }, [defaultValues]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-5 gap-3">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  {/* <Input placeholder="Enter name" {...field} /> */}
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      getRestaurantId(value);
                    }}
                    value={field.value}
                  >
                    <SelectTrigger className="bg-slate-100 shadow-md">
                      <SelectValue placeholder="Select restaurant" />
                    </SelectTrigger>
                    <SelectContent>
                      {rests.map((restaurant) => (
                        <SelectItem key={restaurant.id} value={restaurant.name}>
                          {restaurant.name}
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
            name="quantity.adults"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adults</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="quantity.kids"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kids</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-4 gap-3">
          <FormField
            name="date"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* {!showTimeField && (
            <Button
              variant="outline"
              type="button"
              onClick={() => setShowTimeField(true)}
              className="mt-3"
            >
              Add Time
            </Button>
          )}
          {showTimeField && (
            <FormField
              name="time"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                      value={field.value || "10:00"} // Default time
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )} */}
          {/* <FormField
            name="time"
            control={form.control}
            defaultValue="10:00"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <></>
                  <Input
                    type="time"
                    {...field}
                    value={field.value || "10:00 AM"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <FormField
            name="mealType"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Meal Type</FormLabel>
                <FormControl>
                  {selectedRestaurant ? (
                    selectedRestaurant && (
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedMeal(
                            selectedRestaurant.restaurantMeal.find((meal) => {
                              meal.mealType === value;
                            }),
                          );
                          // getRestaurantId(value);
                        }}
                        value={field.value}
                      >
                        <SelectTrigger className="bg-slate-100 shadow-md">
                          <SelectValue placeholder="Select meal type" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedRestaurant?.restaurantMeal.map((meal) => (
                            <SelectItem key={meal.id} value={meal.mealType}>
                              {meal.mealType}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )
                  ) : (
                    <Input
                      placeholder="First select a restaurant"
                      {...field}
                      disabled={true}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          name="remarks"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Special Notes</FormLabel>
              <FormControl>
                {/* <Input placeholder="Enter any special note" {...field} /> */}
                <textarea
                      placeholder="Enter any special notes"
                      {...field}
                      className="h-20 w-full rounded-md border border-gray-300 p-2 text-sm"
                    />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex w-full flex-row justify-end">
          <Button variant={"primaryGreen"} type="submit" className="px-5">
            Add
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RestaurantForm;
