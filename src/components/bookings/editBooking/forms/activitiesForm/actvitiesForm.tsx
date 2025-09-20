import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { CalendarIcon, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEditBooking } from "~/app/dashboard/bookings/[id]/edit/context";
import {
  ActivityVoucher
} from "~/app/dashboard/bookings/add/context";
import { useOrganization } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";
import { getActivitiesByTypeAndCity, getActivitiesWithFlexibleFilter } from "~/server/db/queries/activities";
import {
  SelectActivity,
  SelectActivityType,
  SelectActivityVendor,
  SelectCity
} from "~/server/db/schemaTypes";

export type ActivityData = SelectActivity & {
  activityVendor: SelectActivityVendor & {
    city: SelectCity
  };
};
interface ActivityFormProps {
  onAddActivity: (voucher: ActivityVoucher) => void;
  activityTypes: SelectActivityType[];
  cities: SelectCity[];
  isSaving?: boolean;
}

export const activitySchema = z.object({
  activityType: z.string().optional(),
  city: z.string().optional(),
  vendor: z.string().min(1, "Vendor is required"),
  checkInDate: z.string().min(1, "Check-in date is required"),
  time: z.string().min(1, "Time is required").optional().or(z.literal("12:00")),
  adultsCount: z.number().min(1, "Add adult count"),
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
  const { addActivity, bookingDetails } = useEditBooking();
  const { organization } = useOrganization();

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
          adultsCount: values.adultsCount,
          kidsCount: values.kidsCount,
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
    if (name === "all") {
      setSelectedActivityType(undefined);
    } else {
      const act = activityTypes.find((act) => act.name === name);
      setSelectedActivityType(act);
    }
  };

  const getCityId = (name: string) => {
    setSelectedActivity(null);
    setActivities([]);
    setActivityLoading(false);
    if (name === "all") {
      setSelectedCity(undefined);
    } else {
      const city = cities.find((city) => city.name === name);
      setSelectedCity(city);
    }
  };

  const getVendorId = (name: string) => {
    const activity = activities.find((act) => act.activityVendor.name === name);

    setSelectedActivity(activity);
  };

  const fetchActivities = async () => {
    try {
      // Allow searching with both "All" selections (will fetch all activities)
      // or with at least one specific filter
      const hasActivityTypeFilter = selectedActivityType !== undefined;
      const hasCityFilter = selectedCity !== undefined;
      
      // Only prevent search if neither filter is selected at all (not even "All")
      const activityTypeSelected = form.getValues("activityType");
      const citySelected = form.getValues("city");
      
      if (!activityTypeSelected && !citySelected) {
        setError("Please select at least one filter to search");
        return;
      }

      setActivityLoading(true);
      setError(undefined);
      
      const [activitiesResponse] = await Promise.all([
        getActivitiesWithFlexibleFilter(
          selectedActivityType?.id,
          selectedCity?.id,
          organization?.id,
        ),
      ]);

      if (!activitiesResponse) {
        throw new Error("Couldn't get any activity");
      }

      console.log(activitiesResponse);
      setActivities(activitiesResponse);
      setActivityLoading(false);
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
                  <FormLabel>Activity Type (Optional)</FormLabel>
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
                        <SelectValue placeholder="Filter by activity type (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          All Activity Types
                        </SelectItem>
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
                  <FormLabel>Location (Optional)</FormLabel>
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
                        <SelectValue placeholder="Filter by city (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          All Cities
                        </SelectItem>
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

          <div className="w-[10%] flex flex-col gap-1">
            <div className="text-xs text-gray-600 text-center">
              Select filters or "All"
            </div>
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

        {/* Error Display */}
        {error && (
          <div className="rounded-md bg-red-50 p-3">
            <div className="text-sm text-red-800">{error}</div>
          </div>
        )}

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
                      placeholder={`Select filters above and click search to find vendors`}
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
                <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(new Date(field.value), "LLL dd, y")
                          ) : (
                            <span>Pick the check-in date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          initialFocus
                          selected={
                            field.value
                              ? parse(field.value, "MM/dd/yyyy", new Date())
                              : new Date()
                          }
                          onSelect={(date: Date | undefined) => {
                            const dateString = format(
                              date ?? new Date(),
                              "MM/dd/yyyy",
                            );
                            field.onChange(dateString);
                          }}
                          disabled={(date) => {
                            const min = new Date(bookingDetails.general.startDate);
                            const max = new Date(bookingDetails.general.endDate)
                            min.setHours(0, 0, 0, 0);
                            max.setHours(0, 0, 0, 0)
                            return date < min || date > max;
                          }}
                          numberOfMonths={1}
                        />
                      </PopoverContent>
                    </Popover>
                  {/* <Input
                        type="date"
                        {...field}
                        min={bookingDetails.general.startDate ?? ""}
                        max={bookingDetails.general.endDate ?? ""}
                      /> */}
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
                    min={0}
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
                    min={0}
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
              <FormLabel>Special Note</FormLabel>
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

export default ActivitiesForm;
