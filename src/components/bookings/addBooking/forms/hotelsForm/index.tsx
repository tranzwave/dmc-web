"use client";
import { useEffect, useState } from "react";
import {
  HotelVoucher,
  useAddBooking,
} from "~/app/dashboard/bookings/add/context";
import { CalendarV2 } from "~/components/common/customCalendar";
import { DataTableWithActions } from "~/components/common/dataTableWithActions";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { getAllHotelsV2 } from "~/server/db/queries/hotel";
import {
  InsertHotelVoucher,
  InsertHotelVoucherLine,
  SelectHotel
} from "~/server/db/schemaTypes";
import { Hotel, voucherColumns } from "./columns";
import HotelsForm from "./hotelsForm";
import { useOrganization } from "@clerk/nextjs";

const HotelsTab = () => {
  const [addedHotels, setAddedHotels] = useState<Hotel[]>([]);
  const { addHotelVoucher, bookingDetails, setActiveTab, deleteHotel } = useAddBooking();
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState<SelectHotel[]>([]);
  const [error, setError] = useState<string | null>();
  const { toast } = useToast();
  const {organization, isLoaded:isOrgLoaded} = useOrganization();

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
        hotel: hotel,
        voucher: voucher,
        voucherLines: [data],
      };
      addHotelVoucher(hotelVoucher);
    } else {
      console.log("Multiple vouchers for same hotel is not supported yet");
    }
    // addHotelVoucher(hotel);
  };

  const getHotels = async () => {
    setLoading(true);

    try {
      const newResponse = await getAllHotelsV2(organization?.id ?? "");

      if (!newResponse) {
        throw new Error(`Error: Couldn't get hotels`);
      }
      console.log("Fetched Hotels:", newResponse);

      setHotels(newResponse);
      setLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (!bookingDetails.general.includes.hotels) {
      setActiveTab("restaurants");
      return () => {
        console.log("Return");
      };
    }
    console.log("rerenderinggg");
    getHotels();
  }, []);

  if (loading) {
    return <div>Loading</div>;
  }

  const onNextClick = () => {
    console.log(bookingDetails);
    if (bookingDetails.vouchers.length > 0) {
      setActiveTab("restaurants");
    } else {
      toast({
        title: "Uh Oh!",
        description: "You must add hotel vouchers to continue",
      });
    }
  };

  const onRowEdit = (row: HotelVoucher) => {
    console.log(row);
    // setSelectedActivity(row);
  };

  const onRowDelete = (row: HotelVoucher) => {
    alert(row.hotel.name);
    deleteHotel(row.hotel.name);
  };
  
  // const dateRanges: DateRange[] = [
  //   { start: "2024-09-03", end: "2024-09-07" }, // No color provided
  //   // { start: "2024-09-01", end: "2024-09-05", color: "bg-blue-300" },
  //   // { start: "2024-09-20", end: "2024-09-22", color: "bg-red-300" },
  // ];

  const dateRanges = [
    {
      start: bookingDetails.general.startDate,
      end: bookingDetails.general.endDate,
      color: "bg-green-200", // Default color for booking range
    },
    ...bookingDetails.vouchers.map((voucher) => ({
      start: voucher.voucherLines[0]?.checkInDate ?? '',
      end: voucher.voucherLines[0]?.checkOutDate ?? '',
    })),
  ];

  if (!isOrgLoaded) {
    return <div>Loading</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="flex w-full flex-row justify-center gap-3">
        {/* <Calendar
            mode="range"
            selected={{from: new Date(bookingDetails.general.startDate), to:new Date(bookingDetails.general.endDate)}}
            className="rounded-md"
          /> */}
        <CalendarV2
          dateRanges={[

            {
              start: bookingDetails.general.startDate,
              end: bookingDetails.general.endDate,
              color: "bg-green-200", // Default color for booking range
            },
            ...bookingDetails.vouchers.map((voucher) => ({
              start: voucher.voucherLines[0]?.checkInDate ?? '',
              end: voucher.voucherLines[0]?.checkOutDate ?? '',
            })),

          ]}
        />
        <div className="card w-full space-y-6">
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
      <div className="flex w-full flex-col items-center justify-center gap-2">
        <div className="w-full">
          <DataTableWithActions columns={voucherColumns} data={bookingDetails.vouchers}
          onDelete={onRowDelete}
          onEdit={onRowEdit}
          onRowClick={onRowEdit}
          onDuplicate={onRowEdit} />
        </div>
        <div className="flex w-full justify-end">
          <Button variant={"primaryGreen"} onClick={onNextClick}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HotelsTab;
