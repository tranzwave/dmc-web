import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Restaurant } from "./columns";

interface RestaurantFormProps {
  onAddRestaurant: (restaurant: Restaurant) => void;
}

export const restaurantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  quantity: z.object({
    adults: z.number().min(1, "Adults quantity is required"),
    kids: z.number().min(0, "Kids quantity is required"),
  }),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  mealType: z.string().min(1, "Meal type is required"),
  remarks: z.string().optional(), // Optional field
});

const RestaurantForm: React.FC<RestaurantFormProps> = ({ onAddRestaurant }) => {
  const form = useForm<z.infer<typeof restaurantSchema>>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      name: "",
      quantity: {
        adults: 1,
        kids: 0,
      },
      date: "",
      time: "",
      mealType: "",
      remarks: "",
    },
  });

  function onSubmit(values: z.infer<typeof restaurantSchema>) {
    onAddRestaurant({
      ...values,
      quantity: {
        adults: Number(values.quantity.adults), // Ensure adults quantity is a number
        kids: Number(values.quantity.kids), // Ensure kids quantity is a number
      },
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-5 gap-3">
          <FormField name="name" control={form.control} render={({ field }) => (
            <FormItem className="col-span-3">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="quantity.adults" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Adults</FormLabel>
              <FormControl>
                <Input
                    type="number"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="quantity.kids" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Kids</FormLabel>
              <FormControl>
                <Input
                    type="number"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <div className="grid grid-cols-4 gap-3">
          <FormField name="date" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="time" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="mealType" control={form.control} render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Meal Type</FormLabel>
              <FormControl>
                <Input placeholder="Enter meal type" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

        </div>
        <FormField name="remarks" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Remarks</FormLabel>
              <FormControl>
                <Input placeholder="Enter any remarks" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        <div className="w-full flex flex-row justify-end">
          <Button variant={'primaryGreen'} type="submit" className="px-5">Add</Button>
        </div>
      </form>
    </Form>
  );
};

export default RestaurantForm;
