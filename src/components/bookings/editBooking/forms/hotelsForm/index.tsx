"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  HotelVoucher,
  useEditBooking,
} from "~/app/dashboard/bookings/[id]/edit/context";
import { CalendarV2 } from "~/components/common/customCalendar";
import { DataTableWithActions } from "~/components/common/dataTableWithActions";
import DeletePopup from "~/components/common/deletePopup";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import {
  addHotelVoucherLinesToBooking,
  deleteHotelVoucherLine,
} from "~/server/db/queries/booking";
import { getAllHotelsV2 } from "~/server/db/queries/hotel";
import {
  InsertHotelVoucher,
  InsertHotelVoucherLine,
  SelectHotel
} from "~/server/db/schemaTypes";
import { Hotel, hotelVoucherColumns } from "./columns";
import HotelsForm from "./hotelsForm";

const HotelsTab = () => {
  const [addedHotels, setAddedHotels] = useState<Hotel[]>([]);
  const {
    addHotelVoucher,
    bookingDetails,
    setActiveTab,
    editHotelVoucher,
    deleteHotelVoucher,
    updateTriggerRefetch,
  } = useEditBooking();
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState<SelectHotel[]>([]);
  const [error, setError] = useState<string | null>();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [defaultValues, setDefaultValues] = useState<
    | (InsertHotelVoucherLine & {
        hotel: SelectHotel;
      })
    | null
  >();
  const [defaultHotel, setDefaultHotel] = useState<SelectHotel>();
  const [indexToEdit, setIndexToEdit] = useState<number>();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isExistingVoucherDelete, setIsExistingVoucherDelete] = useState(false);
  const [isUnsavedVoucherDelete, setIsUnsavedVoucherDelete] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<HotelVoucher>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [triggerRefetch, setTriggerRefetch] = useState(false);
  const [voucherToEdit, setVoucherToEdit] = useState<HotelVoucher | null>()

  const pathname = usePathname();
  const bookingLineId = pathname.split("/")[3];
  
  const updateHotels = async (
    data: InsertHotelVoucherLine,
    isNewVoucher: boolean,
    hotel: SelectHotel,
  ) => {
    if(voucherToEdit !== null){
      handleExistingVoucherDelete()
      setVoucherToEdit(null)
    }
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
      if (data.id && indexToEdit != 999) {
        editHotelVoucher(hotelVoucher, indexToEdit ?? 99, data.id);
        setIndexToEdit(999);
        return;
      }

      try {
        setSaving(true);
        const newResponse = await addHotelVoucherLinesToBooking(
          [hotelVoucher],
          bookingLineId ?? "",
          bookingDetails.general.marketingManager,
          bookingDetails.vouchers.length + 1
        );

        if (!newResponse) {
          throw new Error(`Error: Couldn't add hotel vouchers`);
        }
        console.log("Fetched Hotels:", newResponse);

        toast({
          title: "Success",
          description: "Hotel Vouchers Added!",
        });
        addHotelVoucher(hotelVoucher);
        setSaving(false);
        updateTriggerRefetch();
      } catch (error) {
        if (error instanceof Error) {
        } else {
          setError("An unknown error occurred");
        }
        console.error("Error:", error);
        setSaving(false);
      }

      // onSaveClick()
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

  const dateRanges = [
    {
      start: bookingDetails.general.startDate,
      end: bookingDetails.general.endDate,
      color: "bg-green-200", // Default color for booking range
    },
    ...bookingDetails.vouchers.map((voucher) => ({
      start: voucher.voucherLines[0]?.checkInDate ?? "",
      end: voucher.voucherLines[0]?.checkOutDate ?? "",
    })),
  ];

  const onEdit = (data: HotelVoucher) => {
    if(data.voucher.status !== "inprogress"){
      toast({
        title: "Uh Oh!",
        description: "You've already proceeded with this voucher. Please go to send vouchers and amend!",
      });
      return
    }
    setSelectedVoucher(data)
    const index = bookingDetails.vouchers.findIndex((v) => v == data);
    setIndexToEdit(index);
    if (!data.voucherLines[0]) {
      return;
    }
    setDefaultValues({ ...data.voucherLines[0], hotel: data.hotel });
    setDefaultHotel(data.hotel);

  };

  const onDelete = async (data: HotelVoucher) => {
    setSelectedVoucher(data);
    if (data.voucher.status) {
      setIsExistingVoucherDelete(true);
      return;
    }
    setIsUnsavedVoucherDelete(true);
    setIsDeleteOpen(true);
  };

  const handleExistingVoucherDelete = async () => {
    if (selectedVoucher && selectedVoucher.voucher.status) {
      if (selectedVoucher.voucher.status != "inprogress") {
        toast({
          title: "Uh Oh",
          description: `You cant delete this voucher. It's already ${selectedVoucher.voucher.status}!. Please go to proceed vouchers and send the cancellation voucher first`,
        });
        return;
      }
      try {
        setIsDeleting(true);
        const deletedData = await deleteHotelVoucherLine(
          selectedVoucher?.voucherLines[0]?.id ?? "",
        );
        if (!deletedData) {
          throw new Error("Couldn't delete voucher");
        }

        deleteVoucherLineFromLocalContext();
        setIsDeleting(false);
      } catch (error) {
        toast({
          title: "Uh Oh",
          description: `Couldn't delete this voucher`,
        });
        setIsDeleting(false);
      }
      return;
    }
  };

  const deleteVoucherLineFromLocalContext = () => {
    setIsDeleting(true);
    const index = bookingDetails.vouchers.findIndex(
      (v) => v == selectedVoucher,
    );
    deleteHotelVoucher(index, selectedVoucher?.voucherLines[0]?.id ?? "");
    setIsDeleting(false);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="flex w-full flex-row justify-center gap-3">
        <CalendarV2
          dateRanges={[
            {
              start: bookingDetails.general.startDate,
              end: bookingDetails.general.endDate,
              color: "bg-green-200", // Default color for booking range
            },
            ...bookingDetails.vouchers.map((voucher) => ({
              start: voucher.voucherLines[0]?.checkInDate ?? "",
              end: voucher.voucherLines[0]?.checkOutDate ?? "",
            })),
          ]}
        />
        <div className="card w-full space-y-6">
          <div className="flex flex-row justify-between">
            <div className="card-title">Hotel Information</div>
          </div>
          {hotels && (
            <HotelsForm
              onAddHotel={updateHotels}
              hotels={hotels}
              defaultValues={defaultValues}
              isSaving={saving}
            />
          )}
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-2">
        <div className="w-full">
          {/* <DataTable columns={voucherColumns} data={bookingDetails.vouchers} /> */}
          <DataTableWithActions
            columns={hotelVoucherColumns}
            data={bookingDetails.vouchers.filter(v => v.voucher.status !== "cancelled")}
            onEdit={onEdit}
            onDelete={onDelete}
            onRowClick={() => {
              console.log("row");
            }}
          />
        </div>
        <div className="flex w-full justify-end">
          {/* <Button variant={"primaryGreen"} onClick={onNextClick}>
            Next
          </Button> */}
          <Link href={`${pathname.split("edit")[0]}/tasks?tab=hotels`}>
            <Button variant={"primaryGreen"}>Send Vouchers</Button>
          </Link>
          {/* <Button
            variant={"primaryGreen"}
            onClick={onSaveClick}
            disabled={saving}
          >
            {saving ? (
              <div className="flex flex-row gap-1">
                <div>
                  <LoaderCircle className="animate-spin" size={10} />
                  Saving
                </div>
              </div>
            ) : (
              "Save"
            )}
          </Button> */}
        </div>
      </div>
      <DeletePopup
        itemName={`Voucher for ${selectedVoucher?.hotel.name}`}
        onDelete={deleteVoucherLineFromLocalContext}
        isOpen={isUnsavedVoucherDelete}
        setIsOpen={setIsUnsavedVoucherDelete}
        isDeleting={isDeleting}
      />

      <DeletePopup
        itemName={`Voucher for ${selectedVoucher?.hotel.name}`}
        onDelete={handleExistingVoucherDelete}
        isOpen={isExistingVoucherDelete}
        setIsOpen={setIsExistingVoucherDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default HotelsTab;
