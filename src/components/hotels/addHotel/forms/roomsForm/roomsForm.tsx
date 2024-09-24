import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from 'zod';
import { defaultHotelRoom } from "~/app/dashboard/hotels/add/context";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { HotelRoomType } from "../roomsForm/columns";

interface RoomsFormProps {
  onAddRoom: (room: HotelRoomType) => void;
  selectedRoom: HotelRoomType
}

// Define the schema for room details
export const roomsSchema = z.object({
  roomType: z.string().min(1, "Room type is required"),
  typeName: z.string().min(1, "Type name is required"),
  count: z.number().min(1, "Count is required"),
  amenities: z.string().min(1, "Amenities are required"),
  floor: z.number().min(0, "Floor must be 0 or higher"),
  bedCount: z.number().min(1, "Bed count is required"),
  additionalComments: z.string().optional(), // Optional field
});

const RoomsForm: React.FC<RoomsFormProps> = ({ onAddRoom, selectedRoom }) => {
  const roomsForm = useForm<HotelRoomType>({
    resolver: zodResolver(roomsSchema),
    defaultValues: defaultHotelRoom
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

  const {reset} = roomsForm;


  const onSubmit: SubmitHandler<HotelRoomType> = (data) => {
    onAddRoom({
      ...data,
      count: Number(data.count), 
      floor: Number(data.floor),
      bedCount: Number(data.bedCount)
    });
    roomsForm.reset();
  }

  useEffect(()=>{
    reset(selectedRoom)

  }, [selectedRoom,reset])

  return (
    <Form {...roomsForm}>
      <form onSubmit={roomsForm.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <FormField name="roomType" control={roomsForm.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Room Type</FormLabel>
              <FormControl>
                <Input placeholder="Enter room type" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="typeName" control={roomsForm.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Room Type Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter type name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="count" control={roomsForm.control} render={({ field }) => (
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
          )} />
        </div>
        <div className="grid grid-cols-4 gap-3">
          <FormField name="amenities" control={roomsForm.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Amenities</FormLabel>
              <FormControl>
                <Input placeholder="Enter amenities" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="floor" control={roomsForm.control} render={({ field }) => (
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
          )} />
          <FormField name="bedCount" control={roomsForm.control} render={({ field }) => (
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
          )} />
          <FormField name="additionalComments" control={roomsForm.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Comments</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter any remarks"
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />          
        </div>
        <div className="w-full flex flex-row justify-end">
          <Button type="submit" variant={'primaryGreen'} className="px-5">Add Room</Button>
        </div>
      </form>
    </Form>
  );
};

export default RoomsForm;
