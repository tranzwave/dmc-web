import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { InsertActivity } from "~/server/db/schemaTypes";
import { ActivityTypeDTO } from "~/app/dashboard/activities/add/context";

interface ActivityFormProps {
  onAddActivity: (activity: ActivityTypeDTO) => void;
}

// Define the schema for activity details
export const activitySchema = z.object({
  name: z.string().min(1, "Activity name is required"),
  typeName: z.string().min(1, "Activity type is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
});

const VendorActivityForm: React.FC<ActivityFormProps> = ({ onAddActivity }) => {
  const activityForm = useForm<ActivityTypeDTO>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      name: "",
      typeName: "",
      capacity: 1,
    },
  });

  const onSubmit: SubmitHandler<ActivityTypeDTO> = (data) => {
    onAddActivity({
        ...data,
        typeName : data.typeName
    });
    activityForm.reset();
  };

  return (
    <Form {...activityForm}>
      <form onSubmit={activityForm.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <FormField name="name" control={activityForm.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Activity Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter activity name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="typeName" control={activityForm.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Activity Type</FormLabel>
              <FormControl>
                <Input
                  type="name"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder="Enter activity type"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="capacity" control={activityForm.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Capacity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  placeholder="Enter capacity"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <div className="w-full flex flex-row justify-end">
          <Button type="submit" variant={'primaryGreen'} className="px-5">Add Activity</Button>
        </div>
      </form>
    </Form>
  );
};

export default VendorActivityForm;
