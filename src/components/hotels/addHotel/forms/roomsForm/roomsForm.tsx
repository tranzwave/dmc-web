import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { defaultHotelRoom, useAddHotel } from "~/app/dashboard/hotels/add/context";
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
import { roomsSchema } from "../schemas";

interface RoomsFormProps {
  onAddRoom: (room: HotelRoomType) => void;
  selectedRoom: HotelRoomType;
  customRoomCategories: string[];
}

// Define the schema for room details
// moved to shared schemas.ts

const RoomsForm: React.FC<RoomsFormProps> = ({ onAddRoom, selectedRoom, customRoomCategories }) => {
  const { roomDraft, setRoomDraft } = useAddHotel();
  const lastDraftKeyRef = useRef<string>("");
  const lastResetKeyRef = useRef<string>("");

  const categories = useMemo(
    () => Array.from(new Set([...(hotelRoomCategories ?? []), ...(customRoomCategories ?? [])])),
    [customRoomCategories]
  );

  const toStableKey = (r: Partial<HotelRoomType> | null | undefined) => {
    const x: any = r ?? {};
    return JSON.stringify({
      ...x,
      count: x.count === undefined || x.count === null || x.count === "" ? "" : String(x.count),
      floor: x.floor === undefined || x.floor === null || x.floor === "" ? "" : String(x.floor),
      bedCount: x.bedCount === undefined || x.bedCount === null || x.bedCount === "" ? "" : String(x.bedCount),
    });
  };

  const toResetTarget = (r: Partial<HotelRoomType> | null | undefined): any => {
    const x: any = { ...defaultHotelRoom, ...(r ?? {}) };
    return {
      ...x,
      count: x.count === undefined || x.count === null ? "" : String(x.count),
      floor: x.floor === undefined || x.floor === null ? "" : String(x.floor),
      bedCount: x.bedCount === undefined || x.bedCount === null ? "" : String(x.bedCount),
    };
  };

  const roomsForm = useForm<HotelRoomType>({
    resolver: zodResolver(roomsSchema),
    defaultValues: defaultHotelRoom,
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const { reset, watch, getValues } = roomsForm;

  const onSubmit: SubmitHandler<HotelRoomType> = (data) => {
    onAddRoom({
      ...data,
      count: Number(data.count),
      floor: Number(data.floor),
      bedCount: Number(data.bedCount),
      id: selectedRoom?.id ?? undefined,
    });
    roomsForm.reset();
    // clear draft after successful add/update
    setRoomDraft(null);
    lastDraftKeyRef.current = "";
  };

  // Initialize form from selected row (edit) or from draft if present
  useEffect(() => {
    const target = selectedRoom && (selectedRoom.id ?? selectedRoom.roomType ?? selectedRoom.amenities ?? selectedRoom.typeName ?? selectedRoom.additionalComments)
      ? selectedRoom
      : roomDraft
      ? (roomDraft as any)
      : defaultHotelRoom;
    const current = getValues();
    const keyTarget = toStableKey(target);
    const keyCurrent = toStableKey(current);
    if (keyTarget !== keyCurrent && lastResetKeyRef.current !== keyTarget) {
      lastResetKeyRef.current = keyTarget;
      reset(toResetTarget(target));
    }
  }, [selectedRoom, roomDraft, reset, getValues]);

  // Live-sync to draft so switching tabs preserves progress
  useEffect(() => {
    const sub = watch((value) => {
      const nextDraft = {
        ...defaultHotelRoom,
        ...(value as any),
        id: selectedRoom?.id ?? (value as any)?.id,
        count: Number((value as any)?.count ?? 0),
        floor: Number((value as any)?.floor ?? 0),
        bedCount: Number((value as any)?.bedCount ?? 0),
      } as any;
      const key = JSON.stringify(nextDraft);
      if (lastDraftKeyRef.current !== key) {
        lastDraftKeyRef.current = key;
        setRoomDraft(nextDraft);
      }
    });
    return () => sub.unsubscribe();
  }, [watch, setRoomDraft, selectedRoom?.id]);

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
                      if (value !== field.value) field.onChange(value);
                    }}
                    value={field.value || ""}
                  >
                    <SelectTrigger className="bg-slate-100 shadow-md">
                      <SelectValue placeholder="Select room category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
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
                      if (value !== field.value) field.onChange(value);
                    }}
                    value={field.value || ""} // Ensure initial value is set correctly
                  >
                    <SelectTrigger className="bg-slate-100 shadow-md">
                      <SelectValue placeholder="Room type selection is disabled" />
                    </SelectTrigger>
                    <SelectContent>
                      {hotelRoomTypes.map((type) => (
                        <SelectItem key={type} value={type} disabled>
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
                    onChange={(e) => field.onChange(e.target.value)}
                    min={0}
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
                    onChange={(e) => field.onChange(e.target.value)}
                    min={0}
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
                    onChange={(e) => field.onChange(e.target.value)}
                    min={0}
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
