import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { defaultHotelRoom } from "~/app/dashboard/hotels/add/context";
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
import { hotelRoomCategories, hotelRoomTypes } from "~/lib/constants";
import { HotelRoomType } from "../roomsForm/columns";

interface RoomsFormProps {
  onAddRoom: (room: HotelRoomType) => void;
  selectedRoom: HotelRoomType;
}

// Define the schema for room details
export const roomsSchema = z.object({
  roomType: z.string().min(1, "Room type is required"),
  typeName: z.string().min(1, "Type name is required"),
  count: z
    .number()
    .min(1, "Count must be 1 or higher")
    .optional()
    .or(z.literal("")), // Optional field
  amenities: z
    .string()
    .min(1, "Amenities are required")
    .optional()
    .or(z.literal("")), // Optional field
  floor: z
    .number()
    .min(0, "Floor must be 0 or higher")
    .optional()
    .or(z.literal("")), // Optional field
  bedCount: z
    .number()
    .min(1, "Bed count is required")
    .optional()
    .or(z.literal("")), // Optional field
  additionalComments: z.string().optional(), // Optional field
});

const RoomsForm: React.FC<RoomsFormProps> = ({ onAddRoom, selectedRoom }) => {
  const roomsForm = useForm<HotelRoomType>({
    resolver: zodResolver(roomsSchema),
    defaultValues: defaultHotelRoom,
    // defaultValues: {
    //   roomType: '',
    //   typeName: '',
    //   count: 1,
    //   amenities: '',
    //   floor: 1,
    //   bedCount: 1,
    //   additionalComments: ""
    // },
  });

  const { reset } = roomsForm;

  const onSubmit: SubmitHandler<HotelRoomType> = (data) => {
    onAddRoom({
      ...data,
      count: Number(data.count),
      floor: Number(data.floor),
      bedCount: Number(data.bedCount),
    });
    roomsForm.reset();
  };

  useEffect(() => {
    reset(selectedRoom);
  }, [selectedRoom, reset]);

  return (
    <Form {...roomsForm}>
      <form onSubmit={roomsForm.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-3 gap-3">
          {/* <FormField name="roomType" control={roomsForm.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Room Category</FormLabel>
              <FormControl>
                <Input placeholder="Enter room category" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} /> */}
          <FormField
            name="roomType"
            control={roomsForm.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Category</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    value={field.value || ""} // Ensure initial value is set correctly
                  >
                    <SelectTrigger className="bg-slate-100 shadow-md">
                      <SelectValue placeholder="Select room category" />
                    </SelectTrigger>
                    <SelectContent>
                      {hotelRoomTypes.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
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
            name="typeName"
            control={roomsForm.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    value={field.value || ""} // Ensure initial value is set correctly
                  >
                    <SelectTrigger className="bg-slate-100 shadow-md">
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      {hotelRoomCategories.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
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
            name="count"
            control={roomsForm.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Count</FormLabel>
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
            name="amenities"
            control={roomsForm.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amenities</FormLabel>
                <FormControl>
                  <Input placeholder="Enter amenities" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="floor"
            control={roomsForm.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Floor</FormLabel>
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
            name="bedCount"
            control={roomsForm.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bed Count</FormLabel>
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
            name="additionalComments"
            control={roomsForm.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Comments</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter any additional comments"
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full flex-row justify-end">
          <Button type="submit" variant={"primaryGreen"} className="px-5">
            Add Room
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RoomsForm;
