import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Activity } from "./columns";

interface ActivityFormProps {
  onAddActivity: (activity: Activity) => void;
}

export const activitySchema = z.object({
  activityType: z.string().min(1, "Activity type is required"),
  city: z.string().min(1, "City is required"),
  vendor: z.string().min(1, "Vendor is required"),
  checkInDate: z.string().min(1, "Check-in date is required"),
  time: z.string().min(1, "Time is required"),
  headCount: z.number().min(1, "Head count is required"),
  hours: z.number().min(1, "Hours are required"),
  remarks: z.string().optional(), // Optional field
});

const ActivitiesForm: React.FC<ActivityFormProps> = ({ onAddActivity }) => {
  const form = useForm<z.infer<typeof activitySchema>>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      activityType: "",
      city: "",
      vendor: "",
      checkInDate: "",
      time: "",
      headCount: 1,
      hours: 1,
      remarks: "",
    },
  });

  function onSubmit(values: z.infer<typeof activitySchema>) {
    onAddActivity({
      ...values,
      headCount: Number(values.headCount), // Ensure headCount is a number
      hours: Number(values.hours), // Ensure hours is a number
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <FormField name="activityType" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Activity Type</FormLabel>
              <FormControl>
                <Input placeholder="Enter activity type" {...field} />
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
          <FormField name="vendor" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Vendor</FormLabel>
              <FormControl>
                <Input placeholder="Enter vendor" {...field} />
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

export default ActivitiesForm;
