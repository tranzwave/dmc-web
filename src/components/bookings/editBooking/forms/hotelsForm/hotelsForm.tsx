"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEditBooking } from "~/app/dashboard/bookings/[id]/edit/context";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
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
} from "~/components/ui/select"; // Import Shadcn Select components
import { hotelBoardBasis, hotelRoomTypes } from "~/lib/constants";
import {
  InsertHotelVoucherLine,
  SelectHotel,
  SelectHotelVoucherLine,
} from "~/server/db/schemaTypes";

interface HotelsFormProps {
  onAddHotel: (
    data: SelectHotelVoucherLine,
    isNewVoucher: boolean,
    hotel: any,
  ) => void;
  hotels: SelectHotel[];
  defaultValues: InsertHotelVoucherLine | null;
}

export const hotelsSchema = z.object({
  name: z.string().min(1, "Hotel name is required"),
  adultsCount: z.number().min(1, "Quantity is required"),
  kidsCount: z.number().min(1, "Quantity is required"),
  roomCount: z.number().min(1, "Room count is required"),
  checkInDate: z.string().min(1, "Check-in date is required"),
  // checkInTime: z.string().min(1, "Check-in time is required").optional(),
  checkOutDate: z.string().min(1, "Check-out date is required"),
  // checkOutTime: z.string().min(1, "Check-out time is required").optional(),
  roomType: z.string().min(1, "Room type is required"),
  basis: z.string().min(1, "Basis is required"),
  remarks: z.string().min(1, "Remarks required"), // Optional field
});

const HotelsForm: React.FC<HotelsFormProps> = ({
  onAddHotel,
  hotels,
  defaultValues,
}) => {
  const [selectedHotel, setSelectedHotel] = useState<SelectHotel | null>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { bookingDetails } = useEditBooking();

  const form = useForm<z.infer<typeof hotelsSchema>>({
    resolver: zodResolver(hotelsSchema),
    defaultValues: {
      ...defaultValues,
      remarks: defaultValues?.remarks ?? "No Remarks",
    },
    values: {
      adultsCount: defaultValues?.adultsCount ?? 0,
      kidsCount: defaultValues?.kidsCount ?? 0,
      name: hotels[0]?.name ?? "",
      checkInDate: defaultValues?.checkInDate ?? "",
      // checkInTime: defaultValues?.checkInTime ?? "10:00",
      checkOutDate: defaultValues?.checkOutDate ?? "",
      // checkOutTime: defaultValues?.checkOutTime ?? "10:00",
      roomType: defaultValues?.roomType ?? "",
      basis: defaultValues?.basis ?? "",
      roomCount: defaultValues?.roomCount ?? 0,
      remarks: defaultValues?.remarks ?? "",
    },
  });



  function handleModalResponse(isNewVoucher: boolean) {
    const voucherLine: InsertHotelVoucherLine = {
      adultsCount: Number(form.getValues("adultsCount")), // Assuming you have an `adultsCount` field in your form.
      kidsCount: Number(form.getValues("kidsCount")), // Assuming you have a `kidsCount` field in your form.
      hotelVoucherId: "", // Use the selected hotel ID stored in the state.
      roomType: form.getValues("roomType"), // Room type from the form.
      basis: form.getValues("basis"), // Basis from the form.
      checkInDate: form.getValues("checkInDate").toString(), // Convert check-in date from form to a Date object.
      checkInTime: "10:00",
      checkOutDate: form.getValues("checkOutDate").toString(), // Convert check-out date from form to a Date object.
      checkOutTime: "10:00",
      roomCount: Number(form.getValues("roomCount")), // Room count from the form, converted to a number.
      remarks: form.getValues("remarks"),
    };

    if (isNewVoucher) {
      onAddHotel(voucherLine, true, selectedHotel);
    } else {
      onAddHotel(voucherLine, false, selectedHotel);
    }

    // Reset form and close the modal
    form.reset();
    setIsModalOpen(false);
  }

  function onSubmit(values: z.infer<typeof hotelsSchema>) {
    // setIsModalOpen(true);
    handleModalResponse(true)
  }

  function getHotelId(name: string) {
    const hotel = hotels.find((hotel) => hotel.name === name);
    const id = hotel?.id;
    setSelectedHotel(hotel);
  }

  useEffect(() => {
    console.log(hotels);
  }, [defaultValues]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hotel Name</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        getHotelId(value);
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className="bg-slate-100 shadow-md">
                        <SelectValue placeholder="Select hotel" />
                      </SelectTrigger>
                      <SelectContent>
                        {hotels.map((hotel) => (
                          <SelectItem key={hotel.id} value={hotel.name}>
                            {hotel.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row gap-1">
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
            </div>
            <FormField
              name="roomCount"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Count</FormLabel>
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
              name="checkInTime"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Check-in Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} defaultValue={"10:00"}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <FormField
              name="checkOutDate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Check-out Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      min={form.watch("checkInDate") ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
                        <FormField
              name="roomType"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Type</FormLabel>
                  <FormControl>
                    {/* <Input placeholder="Enter room type" {...field} /> */}
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className="bg-slate-100 shadow-md">
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent>
                        {hotelRoomTypes.map((room) => (
                          <SelectItem key={room} value={room}>
                            {room}
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
              name="basis"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Basis</FormLabel>
                  <FormControl>
                    {/* <Input placeholder="Enter basis" {...field} /> */}
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className="bg-slate-100 shadow-md">
                        <SelectValue placeholder="Select Basis" />
                      </SelectTrigger>
                      <SelectContent>
                        {hotelBoardBasis.map((basis) => (
                          <SelectItem key={basis} value={basis}>
                            {basis}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              name="checkOutTime"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Check-out Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </div>
          <div className="grid grid-cols-1 gap-3">

            <FormField
              name="remarks"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Notes</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter any special notes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex w-full flex-row justify-end">
            <Button variant={"primaryGreen"} type="submit" className="px-5">
              Add
            </Button>
          </div>
        </form>
      </Form>

      {/* Modal Component */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          {bookingDetails.vouchers.length > 0 ? (
            <>
              <DialogHeader>
                <DialogTitle>Add to Voucher</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p>
                  Would you like to add this to a new voucher or an existing
                  voucher?
                </p>
              </div>
              <DialogFooter>
                <Button
                  variant={"primaryGreen"}
                  onClick={() => handleModalResponse(true)}
                >
                  New Voucher
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleModalResponse(false)}
                >
                  Existing Voucher
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Add to Voucher</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p>This hotel will get added to a new voucher</p>
              </div>
              <DialogFooter>
                <Button
                  variant={"primaryGreen"}
                  onClick={() => handleModalResponse(true)}
                >
                  OK
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HotelsForm;
