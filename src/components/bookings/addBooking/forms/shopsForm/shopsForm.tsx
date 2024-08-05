import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Shop } from "./columns";

interface ShopsFormProps {
  onAddShop: (shop: Shop) => void;
}

export const shopsSchema = z.object({
  shopType: z.string().min(1, "Shop type is required"),
  city: z.string().min(1, "City is required"),
  productType: z.string().min(1, "Product type is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  headCount: z.number().min(1, "Head count is required"),
  hours: z.number().min(1, "Hours are required"),
  remarks: z.string().optional(), // Optional field
});

const ShopsForm: React.FC<ShopsFormProps> = ({ onAddShop }) => {
  const form = useForm<z.infer<typeof shopsSchema>>({
    resolver: zodResolver(shopsSchema),
    defaultValues: {
      shopType: "",
      city: "",
      productType: "",
      date: "",
      time: "",
      headCount: 1,
      hours: 1,
      remarks: "",
    },
  });

  function onSubmit(values: z.infer<typeof shopsSchema>) {
    onAddShop({
      ...values,
      headCount: Number(values.headCount),
      hours: Number(values.hours), 
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <FormField name="shopType" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Shop Type</FormLabel>
              <FormControl>
                <Input placeholder="Enter shop type" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="city" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="Enter city" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="productType" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Product Type</FormLabel>
              <FormControl>
                <Input placeholder="Enter product type" {...field} />
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
          <FormField name="headCount" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Head Count</FormLabel>
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
          <FormField name="hours" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Hours</FormLabel>
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

export default ShopsForm;
