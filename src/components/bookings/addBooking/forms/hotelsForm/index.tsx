"use client";
import { useEffect, useState } from "react";
import {
  HotelVoucher,
  useAddBooking,
} from "~/app/dashboard/bookings/add/context";
import { DataTable } from "~/components/bookings/home/dataTable";
import { Button } from "~/components/ui/button";
import {
  InsertHotelVoucher,
  InsertHotelVoucherLine,
  SelectHotel,
  SelectHotelVoucher,
  SelectHotelVoucherLine,
} from "~/server/db/schemaTypes";
import { Hotel, voucherColumns } from "./columns";
import HotelsForm from "./hotelsForm";

const HotelsTab = () => {
  const [addedHotels, setAddedHotels] = useState<Hotel[]>([]);
  const { addHotelVoucher, bookingDetails } = useAddBooking();
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState<SelectHotel[]>([]);
  const [error, setError] = useState<string | null>();

  const updateHotels = (
    data: InsertHotelVoucherLine,
    isNewVoucher: boolean,
    hotel: SelectHotel,
  ) => {
    console.log(data);
    const voucher: InsertHotelVoucher = {
      hotelId: hotel.id,
      bookingLineId: "",
      coordinatorId: bookingDetails.general.marketingManager,
    };
    if (isNewVoucher) {
      const hotelVoucher: HotelVoucher = {
        hotel: hotel as SelectHotel,
        voucher: voucher,
        voucherLines: [data],
      };
      addHotelVoucher(hotelVoucher);
    } else {
      alert("Multiple vouchers for same hotel is not supported yet");
    }
    // addHotelVoucher(hotel);
  };

  const getHotels = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/hotels", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Fetched Hotels:", result);

      setHotels(result.allHotels);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHotels();
  }, []);

  if (loading) {
    return <div>Loading</div>;
  }
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="flex w-full flex-row justify-center gap-2">
        <div className="w-[25%]">
          <div className="card">Calendar</div>
        </div>
        <div className="card w-[70%] space-y-6">
          <div className="card-title">Hotel Information</div>
          {hotels && (
            <HotelsForm
              onAddHotel={updateHotels}
              hotels={hotels}
              defaultValues={{
                adultsCount: 0,
                kidsCount: 0,
                hotelVoucherId: "",
                roomType: "",
                basis: "",
                checkInDate: "",
                checkInTime: "",
                checkOutDate: "",
                checkOutTime: "",
                roomCount: 0,
              }}
            />
          )}
        </div>
      </div>
      <div className="flex w-[95%] flex-col items-center justify-center gap-2">
        <div className="w-full">
          <DataTable columns={voucherColumns} data={bookingDetails.vouchers} />
        </div>
        <div className="flex w-full justify-end">
          <Button variant={"primaryGreen"}>Next</Button>
        </div>
      </div>
    </div>
  );
};

export default HotelsTab;
