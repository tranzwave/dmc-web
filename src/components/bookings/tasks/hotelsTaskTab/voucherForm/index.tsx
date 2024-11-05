"use client";
// HotelsForm.tsx

import React, { useEffect, useState } from "react";
import { EditBookingProvider } from "~/app/dashboard/bookings/[id]/edit/context";
import HotelsForm from "~/components/bookings/editBooking/forms/hotelsForm/hotelsForm";
import { Input } from "~/components/ui/input";
import { useToast } from "~/hooks/use-toast";
import { updateHotelVoucherAndLine } from "~/server/db/queries/booking";
import {
  InsertHotelVoucherLine,
  SelectHotel
} from "~/server/db/schemaTypes";

interface HotelsFormProps {
  defaultValues:
    | (InsertHotelVoucherLine & {
        hotel: SelectHotel;
      })
    | null
    | undefined; // Ensures it matches the expected type
  onSave: () => void; // Ensures it matches the expected type
  hotels: SelectHotel[];
}

const HotelsVoucherForm: React.FC<HotelsFormProps> = ({
  defaultValues,
  onSave,
  hotels,
}) => {
  // Form logic and UI here
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false)
  const [reasonToAmend, setReasonToAmend] = useState('')

  const addReason = async (
    data: InsertHotelVoucherLine,
    isNewVoucher: boolean,
    hotel: SelectHotel,
  ) => {
    setShowReasonModal(true)

  }


  const handleSubmit = async (
    data: InsertHotelVoucherLine,
    isNewVoucher: boolean,
    hotel: SelectHotel,
  ) => {
    // Log the inputs for debugging
    console.log("Voucher Line Data:", data);
    console.log("Parent Hotel:", hotel);

    const voucherId = defaultValues?.hotelVoucherId;
    const voucherLineId = defaultValues?.id;

    // setShowReasonModal(true)

    if(reasonToAmend == ''){
      toast({
        title: "Uh oh! You can't amend the voucher without a reason",
        description:
          "Please add a reason for your amendment!",
      });

      return
    }

    try {
      setIsUpdating(true);
      if (!voucherId || !voucherLineId) {
        // Handle new voucher creation logic if needed (out of scope for this example)
        alert("You cant amend this voucher");
        // console.log("New voucher creation is not handled here.");
      } else {
        // Call the `updateHotelVoucherAndLine` function to update the voucher and its line
        if (voucherId && voucherLineId) {
          if (hotel.id != defaultValues.hotel.id) {
            toast({
              title: "Uh oh! You can't change the hotel from this form",
              description:
                "Hotels cant be changed in the voucher. Please cancel the voucher first!",
            });
            setIsUpdating(false);
            return;
          }
          const updatedVoucherLine = await updateHotelVoucherAndLine(
            voucherId, // Voucher ID
            voucherLineId, // Voucher Line ID
            { hotelId: hotel.id, status: "amended", reasonToAmend: reasonToAmend},
            {
              adultsCount: data.adultsCount,
              kidsCount: data.kidsCount,
              roomCount: data.roomCount,
              checkInDate: data.checkInDate,
              checkInTime: data.checkInTime,
              checkOutDate: data.checkOutDate,
              checkOutTime: data.checkOutTime,
              basis: data.basis,
              roomType: data.roomType,
              roomCategory: data.roomCategory,
            }, // Voucher Line update data
          );

          console.log("Updated Voucher Line:", updatedVoucherLine);
          toast({
            title: "Success",
            description: "Voucher has been amended successfully",
          });
          setIsUpdating(false);
          window.location.reload();
        } else {
          console.error("Missing voucher ID or voucher line ID for update.");
          setIsUpdating(false);
        }
      }
    } catch (error) {
      console.error("Error during voucher line update:", error);
      toast({
        title: "Uh oh! You can't amend this hotel voucher",
        description: "This voucher has not been updated!",
      });
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    console.log("Hotel voucher");
    console.log(defaultValues);
  }, []);

  return (
    <EditBookingProvider>
      <div className="flex flex-col gap-2">
        <div className="text-xs font-medium text-neutral-600">
          Note that you can't change the selected hotel from this amendment
          process. To change the hotel, you have to cancel the voucher and
          create a new voucher from the add voucher page
        </div>
        <div className="flex flex-col gap-2 my-3">
          <div className="text-base font-normal">Please add a reason for this amendment</div>
          <Input placeholder={'Add a reason to amend'} type="text" className="h-16" onChange={(e)=>setReasonToAmend(e.target.value)}/>
        </div>
        <HotelsForm
          defaultValues={defaultValues ?? null}
          hotels={hotels}
          onAddHotel={handleSubmit}
          amendment={true}
          isUpdating={isUpdating}
        />

        {/* <Dialog onOpenChange={setShowReasonModal} open={showReasonModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                Please add a reason to amend
              </DialogDescription>
            </DialogHeader>
            <Input placeholder={'Add a reason to amend'} type="text" className="h-8"/>
          </DialogContent>
        </Dialog> */}
      </div>
    </EditBookingProvider>
  );
};

export default HotelsVoucherForm;
