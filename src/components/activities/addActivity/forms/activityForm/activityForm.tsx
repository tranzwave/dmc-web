import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { ActivityTypeDTO } from "~/app/dashboard/activities/add/context";
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
import { getAllActivityTypes } from "~/server/db/queries/activities";
import { SelectActivityType } from "~/server/db/schemaTypes";

interface ActivityFormProps {
  onAddActivity: (activity: ActivityTypeDTO) => void;
  selectedActivity: ActivityTypeDTO
}

// Define the schema for activity details
export const activitySchema = z.object({
  name: z.string().min(1, "Activity name is required"),
  typeName: z.string().min(1, "Activity type is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
});

const VendorActivityForm: React.FC<ActivityFormProps> = ({ onAddActivity, selectedActivity }) => {
  const activityForm = useForm<ActivityTypeDTO>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      name: "",
      typeName: "",
      capacity: 1,
    },
  });

  const {reset} = activityForm;

  const [activityTypes, setActivityTypes] = useState<SelectActivityType[]>([]);
  const [selectedActivityType, setSelectedActivityType] =
    useState<SelectActivityType>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<ActivityTypeDTO> = (data) => {
    onAddActivity({
      ...data,
      typeName: data.typeName,
    });
    activityForm.reset();
  };

  useEffect(()=>{
    reset(selectedActivity)

  }, [selectedActivity,reset])


  const fetchData = async () => {
    try {
      // Run both requests in parallel
      setLoading(true);
      const [activityTpesResponse] = await Promise.all([getAllActivityTypes()]);

      if (!activityTpesResponse) {
        throw new Error("Error fetching aactivity types");
      }

      console.log("Fetched activity types:", activityTpesResponse);

      setActivityTypes(activityTpesResponse);
      setSelectedActivityType(selectedActivityType);

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



  return (
    <Form {...activityForm}>
      <form
        onSubmit={activityForm.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div className="grid grid-cols-3 gap-3">
          <FormField
            name="name"
            control={activityForm.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Activity Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter activity name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="typeName"
            // control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Activity Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(valueFromSelection) => {
                      field.onChange(valueFromSelection);
                      setSelectedActivityType(
                        activityTypes.find(
                          (a) => a.name === valueFromSelection,
                        ),
                      );
                    }}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="bg-slate-100 shadow-md">
                      <SelectValue placeholder="Select activity type" />
                    </SelectTrigger>
                    <SelectContent>
                      {activityTypes.map((type) => (
                        <SelectItem key={type.id} value={type.name}>
                          {type.name}
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
            name="capacity"
            control={activityForm.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    placeholder="Enter capacity"
                    min={0}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full flex-row justify-end">
          <Button type="submit" variant={"primaryGreen"} className="px-5">
            Add Activity
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default VendorActivityForm;

