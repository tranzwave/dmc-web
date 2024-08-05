import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Hotel } from "./columns";

interface HotelsFormProps {
  onAddHotel: (hotel: Hotel) => void;
}

export const hotelsSchema = z.object({
  hotelName: z.string().min(1, "Hotel name is required"),
  quantity: z.number().min(1, "Quantity is required"),
  roomCount: z.number().min(1, "Room count is required"),
  checkInDate: z.string().min(1, "Check-in date is required"),
  checkInTime: z.string().min(1, "Check-in time is required"),
  checkOutDate: z.string().min(1, "Check-out date is required"),
  checkOutTime: z.string().min(1, "Check-out time is required"),
  roomType: z.string().min(1, "Room type is required"),
  basis: z.string().min(1, "Basis is required"),
  remarks: z.string().optional(), // Optional field
});

const HotelsForm: React.FC<HotelsFormProps> = ({ onAddHotel }) => {
  const form = useForm<z.infer<typeof hotelsSchema>>({
    resolver: zodResolver(hotelsSchema),
    defaultValues: {
      hotelName: "",
      quantity: 1,
      roomCount: 1,
      checkInDate: "",
      checkInTime: "",
      checkOutDate: "",
      checkOutTime: "",
      roomType: "",
      basis: "",
      remarks: "",
    },
  });

  function onSubmit(values: z.infer<typeof hotelsSchema>) {
    onAddHotel({
      ...values,
      quantity: Number(values.quantity), // Ensure quantity is a number
      roomCount: Number(values.roomCount), // Ensure roomCount is a number
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <FormField name="hotelName" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Hotel Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter hotel name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="quantity" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
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
          <FormField name="roomCount" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Room Count</FormLabel>
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
          <FormField name="checkInDate" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Check-in Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="checkInTime" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Check-in Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="checkOutDate" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Check-out Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="checkOutTime" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Check-out Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <FormField name="roomType" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Room Type</FormLabel>
              <FormControl>
                <Input placeholder="Enter room type" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="basis" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Basis</FormLabel>
              <FormControl>
                <Input placeholder="Enter basis" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="remarks" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Remarks</FormLabel>
              <FormControl>
                <Input placeholder="Enter any remarks" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <div className="w-full flex flex-row justify-end">
          <Button variant={'primaryGreen'} type="submit" className="px-5">Add</Button>
        </div>
      </form>
    </Form>
  );
};

export default HotelsForm;
