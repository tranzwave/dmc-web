import { zodResolver } from "@hookform/resolvers/zod";
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
import { Activity } from "./columns";
import {
  SelectActivity,
  SelectActivityType,
  SelectActivityVendor,
  SelectActivityVoucher,
  SelectCity,
} from "~/server/db/schemaTypes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useState } from "react";
import { getActivitiesByTypeAndCity } from "~/server/db/queries/activities";
import { LoaderCircle } from "lucide-react";
import {
  ActivityVoucher,
  useAddBooking,
} from "~/app/dashboard/bookings/add/context";

export type ActivityData = SelectActivity & {
  activityVendor: SelectActivityVendor & {
    city: SelectCity
  };
};
interface ActivityFormProps {
  onAddActivity: (voucher: ActivityVoucher) => void;
  activityTypes: SelectActivityType[];
  cities: SelectCity[];
}

export const activitySchema = z.object({
  activityType: z.string().min(1, "Activity type is required"),
  city: z.string().min(1, "City is required"),
  vendor: z.string().min(1, "Vendor is required"),
  checkInDate: z.string().min(1, "Check-in date is required"),
  time: z.string().min(1, "Time is required").optional().or(z.literal("12:00")),
  adultsCount: z.number().min(0, "Add adult count"),
  kidsCount: z.number().min(0, "Add kids count"),
  remarks: z.string().optional(), // Optional field
});

const ActivitiesForm: React.FC<ActivityFormProps> = ({
  onAddActivity,
  activityTypes,
  cities,
}) => {
  const [selectedActivityType, setSelectedActivityType] =
    useState<SelectActivityType>();
  const [selectedCity, setSelectedCity] = useState<SelectCity>();
  const [selectedActivity, setSelectedActivity] =
    useState<ActivityData | null>();
  const [activityLoading, setActivityLoading] = useState(false);
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [error, setError] = useState<string>();
  const { addActivity, bookingDetails } = useAddBooking();

  const form = useForm<z.infer<typeof activitySchema>>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      activityType: "",
      city: "",
      vendor: "",
      checkInDate: "",
      time: "12:00",
      kidsCount: 0,
      adultsCount:0,
      remarks: "",
    },
  });

  function onSubmit(values: z.infer<typeof activitySchema>) {
    if (selectedActivity) {
      onAddActivity({
        vendor: selectedActivity.activityVendor,
        voucher: {
          date: values.checkInDate,
          activityName: selectedActivity.name,
          city: selectedActivity.activityVendor.city.name,
          activityId: selectedActivity.id,
          activityVendorId: selectedActivity.activityVendor.id,
          bookingLineId: "",
          coordinatorId: bookingDetails.general.marketingManager,
          participantsCount: values.adultsCount + values.kidsCount,
          time: values.time ?? "10:00",
          hours: 1,
          remarks: values.remarks,
        },
      });
      form.reset();
    } else {
      throw new Error("Please select a vendor");
    }
  }

  const getActivityTypeId = (name: string) => {
    setSelectedActivity(null);
    setActivities([]);
    setActivityLoading(false);
    const act = activityTypes.find((act) => act.name === name);
    setSelectedActivityType(act);
  };

  const getCityId = (name: string) => {
    setSelectedActivity(null);
    setActivities([]);
    setActivityLoading(false);
    const city = cities.find((city) => city.name === name);
    setSelectedCity(city);
  };

  const getVendorId = (name: string) => {
    const activity = activities.find((act) => act.activityVendor.name === name);

    setSelectedActivity(activity);
  };

  const fetchActivities = async () => {
    try {
      if (selectedActivityType && selectedCity) {
        setActivityLoading(true);
        const [activitiesResponse] = await Promise.all([
          getActivitiesByTypeAndCity(
            selectedActivityType?.id,
            selectedCity?.id,
          ),
        ]);

        if (!activitiesResponse) {
          throw new Error("Couldn't get any activity");
        }

        console.log(activitiesResponse);
        setActivities(activitiesResponse);
        setActivityLoading(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error("Error fetching data:", error);
      setActivityLoading(false);
    }
  };

  if (!activityTypes || !cities) {
    return <div>Loading...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex w-full flex-row items-end gap-3">
          <div className="grid w-full grid-cols-2 gap-3">
            <FormField
              name="activityType"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Activity Type</FormLabel>
                  <FormControl>
                    {/* <Input placeholder="Enter activity type" {...field} /> */}
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        // getHotelId(value);
                        getActivityTypeId(value);
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className="bg-slate-100 shadow-md">
                        <SelectValue placeholder="Select activity type" />
                      </SelectTrigger>
                      <SelectContent>
                        {activityTypes.map((activityType) => (
                          <SelectItem
                            key={activityType.id}
                            value={activityType.name}
                          >
                            {activityType.name}
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
              name="city"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    {/* <Input placeholder="Enter city" {...field} /> */}
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        // getHotelId(value);
                        getCityId(value);
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className="bg-slate-100 shadow-md">
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.id} value={city.name}>
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
          </div>

          <div className="w-[10%]">
            <Button
              variant={"primaryGreen"}
              onClick={fetchActivities}
              type="button"
              className="w-full"
            >
              {activityLoading ? (
                activityLoading && (
                  <div>
                    <LoaderCircle className="animate-spin" />
                  </div>
                )
              ) : (
                <div>Search</div>
              )}
            </Button>
          </div>
        </div>
        <div className="flex w-full flex-row items-center">
          <FormField
            name="vendor"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Vendor</FormLabel>
                <FormControl>
                  {/* <Input placeholder="Enter vendor" {...field} /> */}
                  {activityLoading ? (
                    <div>Loading...</div>
                  ) : activities.length > 0 ? (
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        // getHotelId(value);
                        getVendorId(value);
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className="bg-slate-100 shadow-md">
                        <SelectValue placeholder="Select activity vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        {activities.map((activity) => (
                          <SelectItem
                            key={activity.id}
                            value={activity.activityVendor.name}
                          >
                            {activity.activityVendor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      placeholder={`Please click search after selecting a valid activity type and a city`}
                      {...field}
                      disabled={true}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <Button variant={"outline"}>Search</Button> */}
        </div>

        <div className="grid grid-cols-4 gap-3">
          <FormField
            name="checkInDate"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Check-in Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            name="time"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <FormField
            name="adultsCount"
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
            name="kidsCount"
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
          {/* <FormField
            name="hours"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hours</FormLabel>
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
          /> */}
        </div>
        <FormField
          name="remarks"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remarks</FormLabel>
              <FormControl>
                <Input placeholder="Enter any remarks" {...field} />
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

export default ActivitiesForm;
