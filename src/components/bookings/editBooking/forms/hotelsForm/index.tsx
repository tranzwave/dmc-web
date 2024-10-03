"use client";
import { useEffect, useState } from "react";
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
import { getAllHotels, getAllHotelsV2 } from "~/server/db/queries/hotel";
import { useToast } from "~/hooks/use-toast";
import { Calendar } from "~/components/ui/calendar";
import { CalendarV2, DateRange } from "~/components/common/customCalendar";
import {   HotelVoucher,useEditBooking } from "~/app/dashboard/bookings/[id]/edit/context";
import { addHotelVoucherLinesToBooking } from "~/server/db/queries/booking";
import { usePathname, useSearchParams } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { DataTableWithActions } from "~/components/common/dataTableWithActions";

const HotelsTab = () => {
  const [addedHotels, setAddedHotels] = useState<Hotel[]>([]);
  const { addHotelVoucher, bookingDetails, setActiveTab, editHotelVoucher } = useEditBooking();
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState<SelectHotel[]>([]);
  const [error, setError] = useState<string | null>();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false)
  const [defaultValues, setDefaultValues] = useState<InsertHotelVoucherLine & {
    hotel:SelectHotel
  } | null>()
  const [defaultHotel, setDefaultHotel] = useState<SelectHotel>()
  const [indexToEdit, setIndexToEdit] = useState<number>()

  const pathname = usePathname()
  const bookingLineId = pathname.split("/")[3]
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
      alert(data.id)
      if(data.id && indexToEdit != 999){
        editHotelVoucher(hotelVoucher, indexToEdit ?? 99, data.id)
        setIndexToEdit(999)
        return
      }
      addHotelVoucher(hotelVoucher);
    } else {
      console.log("Multiple vouchers for same hotel is not supported yet");
    }
    // addHotelVoucher(hotel);
  };

  const getHotels = async () => {
    setLoading(true);

    try {
      const newResponse = await getAllHotelsV2();

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

  const onSaveClick = async()=>{
    console.log(bookingDetails.vouchers)
    const newVouchers = bookingDetails.vouchers.filter(v => v.voucherLines[0]?.id ? false : true);

    if(newVouchers.length == 0){
      toast({
        title: "Uh Oh!",
        description: "No new vouchers to add!",
      });

      return
    }
    try {
      setSaving(true)
      const newResponse = await addHotelVoucherLinesToBooking(newVouchers,bookingLineId ?? "", bookingDetails.general.marketingManager);

      if (!newResponse) {
        throw new Error(`Error: Couldn't add hotel vouchers`);
      }
      console.log("Fetched Hotels:", newResponse);

      setSaving(false);
      toast({
        title: "Success",
        description: "Hotel Vouchers Added!",
      });
    } catch (error) {
      if (error instanceof Error) {
        // setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error("Error:", error);
      setSaving(false)
    }

  }

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

  const onEdit = (data:HotelVoucher)=>{
    const index = bookingDetails.vouchers.findIndex(v => v == data)
    setIndexToEdit(index)
    if(!data.voucherLines[0]){
      return
    }
    setDefaultValues({...data.voucherLines[0], hotel: data.hotel})
    alert(data.hotel.name)
    setDefaultHotel(data.hotel)
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
          <div className="flex flex-row justify-between">
          <div className="card-title">Hotel Information</div>
          <Link href={`${pathname.split("edit")[0]}/tasks?tab=hotels`}>
            <Button variant={"primaryGreen"}>Send Vouchers</Button>
          </Link>

          </div>
          {hotels && (
            <HotelsForm
              onAddHotel={updateHotels}
              hotels={hotels}
              defaultValues={defaultValues}
            />
          )}
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-2">
        <div className="w-full">
          {/* <DataTable columns={voucherColumns} data={bookingDetails.vouchers} /> */}
          <DataTableWithActions columns={voucherColumns} data={bookingDetails.vouchers} onEdit={onEdit} onDelete={()=>{console.log("delete")}} onRowClick={()=>{console.log("row")}}/>
        </div>
        <div className="flex w-full justify-end">
          {/* <Button variant={"primaryGreen"} onClick={onNextClick}>
            Next
          </Button> */}
          <Button variant={"primaryGreen"} onClick={onSaveClick} disabled={saving}>
            {saving ? (<div className="flex flex-row gap-1"><div><LoaderCircle className="animate-spin" size={10}/>Saving</div></div>): ('Save')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HotelsTab;
