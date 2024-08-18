'use client';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '~/components/ui/select'; // Import Shadcn Select components
import { Hotel } from "./columns";
import { SelectHotel, SelectHotelVoucherLine, SelectShopVoucher } from "~/server/db/schemaTypes";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { HotelVoucher } from "~/app/dashboard/bookings/add/context";

interface HotelsFormProps {
  onAddHotel: (data: SelectHotelVoucherLine,isNewVoucher:boolean, hotel:any) => void;
  hotels:SelectHotel[]
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

const HotelsForm: React.FC<HotelsFormProps> = ({ onAddHotel,hotels }) => {
  const [selectedHotel,setSelectedHotel] = useState<SelectHotel | null>()
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    setIsModalOpen(true);
  }

  function handleModalResponse(isNewVoucher: boolean) {
    const voucherLine: SelectHotelVoucherLine = {
      id: "", // Optional field; if you don't have an ID yet, you can leave it as an empty string or `undefined`.
      adultsCount: Number(form.getValues('quantity')), // Assuming you have an `adultsCount` field in your form.
      kidsCount: Number(form.getValues('quantity')), // Assuming you have a `kidsCount` field in your form.
      hotelVoucherId: "", // Use the selected hotel ID stored in the state.
      roomType: form.getValues('roomType'), // Room type from the form.
      basis: form.getValues('basis'), // Basis from the form.
      checkInDate: new Date(form.getValues('checkInDate')), // Convert check-in date from form to a Date object.
      checkOutDate: new Date(form.getValues('checkOutDate')), // Convert check-out date from form to a Date object.
      roomCount: Number(form.getValues('roomCount')), // Room count from the form, converted to a number.
      remarks: form.getValues('remarks') || "", // Optional remarks from the form; default to an empty string if not provided.
      createdAt: new Date(), // Optional; usually set automatically.
      updatedAt: new Date(), // Optional; usually set automatically.
    };
    
    if(isNewVoucher){
      onAddHotel(voucherLine,true,selectedHotel )
    } else{
      onAddHotel(voucherLine,false,selectedHotel)
    }



    // Reset form and close the modal
    form.reset();
    setIsModalOpen(false);
  }

  function getHotelId(hotelName: string) {
    const hotel = hotels.find(hotel => hotel.hotelName === hotelName);
    const id = hotel?.id;
    alert(id);
    setSelectedHotel(hotel);
  }

  useEffect(()=>{
    console.log(hotels)
  },[])

  return (
    <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <FormField name="hotelName" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Hotel Name</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    getHotelId(value)
                  }}
                  value={field.value}
                >
                  <SelectTrigger className="shadow-md bg-slate-100">
                    <SelectValue placeholder="Select hotel" />
                  </SelectTrigger>
                  <SelectContent>
                    {hotels.map((hotel) => (
                      <SelectItem key={hotel.id} value={hotel.hotelName}>
                        {hotel.hotelName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Input type="date" {...field} min={form.watch("checkInDate") || ""}/>
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

    {/* Modal Component */}
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Voucher</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Would you like to add this to a new voucher or an existing voucher?</p>
          </div>
          <DialogFooter>
            <Button variant={"primaryGreen"} onClick={() => handleModalResponse(true)}>New Voucher</Button>
            <Button variant="outline" onClick={() => handleModalResponse(false)}>Existing Voucher</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>

  );
};

export default HotelsForm;
