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
  addHotelVoucherLineToExistingVoucher,
  deleteHotelVoucherLine,
  updateSingleHotelVoucherLineTx,
} from "~/server/db/queries/booking";
import { getAllHotelsV2 } from "~/server/db/queries/hotel";
import {
  InsertHotelVoucher,
  InsertHotelVoucherLine,
  SelectHotel,
  SelectHotelVoucherLine
} from "~/server/db/schemaTypes";
import { Hotel, hotelVoucherColumns, hotelVoucherLineColumns } from "./columns";
import HotelsForm from "./hotelsForm";
import { DataTable } from "~/components/bookings/home/dataTable";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { ExpandableDataTableWithActions } from "~/components/common/expnadableDataTable";
import { useOrganization } from "@clerk/nextjs";

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
  const [voucherLineIdToEdit, setVoucherLineIdToEdit] = useState<string>("none");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isExistingVoucherDelete, setIsExistingVoucherDelete] = useState(false);
  const [isUnsavedVoucherDelete, setIsUnsavedVoucherDelete] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<HotelVoucher>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [triggerRefetch, setTriggerRefetch] = useState(false);
  const [voucherToEdit, setVoucherToEdit] = useState<HotelVoucher | null>()
  const [triggerEdit, setTriggerEdit] = useState(false);
  const {organization, isLoaded: isOrgLoaded} = useOrganization();

  const pathname = usePathname();
  const bookingLineId = pathname.split("/")[3];

  const updateHotels = async (
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
    const hotelVoucher: HotelVoucher = {
      hotel: hotel,
      voucher: voucher,
      voucherLines: [data],
    };
    console.log({ datID: data, voucherLineToEdit: voucherLineIdToEdit })
    if (voucherLineIdToEdit !== "none") {
      // editHotelVoucher(hotelVoucher, voucherLineIdToEdit ?? "none", data.id);
      try {
        setSaving(true)
        const updatedResponse = await updateSingleHotelVoucherLineTx(voucherLineIdToEdit, {
          adultsCount: data.adultsCount,
          kidsCount: data.kidsCount,
          checkInDate: data.checkInDate,
          checkOutDate: data.checkOutDate,
          roomType: data.roomType,
          roomCategory: data.roomCategory,
          basis: data.basis,
          roomCount: data.roomCount,
          remarks: data.remarks,
        })
        if (!updatedResponse) {
          throw new Error(`Error: Couldn't update hotel voucher line`);
        }
        toast({
          title: "Success",
          description: "Hotel Vouchers Added!",
        });
        setSaving(false)
        setTriggerEdit(false)
        updateTriggerRefetch()
      } catch (error) {
        if (error instanceof Error) {
        } else {
          setError("An unknown error occurred");
        }
        console.error("Error:", error);
        toast({
          title: "Uh Oh!",
          description: "Couldn't update voucher line!",
        });
        setSaving(false);
        setTriggerEdit(false)
      }
      setVoucherLineIdToEdit("none");
      return;
    }


    try {
      setSaving(true);
      let newResponse = null;
      if (isNewVoucher) {
        newResponse = await addHotelVoucherLinesToBooking(
          [hotelVoucher],
          bookingLineId ?? "",
          bookingDetails.general.marketingManager,
          bookingDetails.vouchers.length + 1
        );
      } else {
        // newResponse = await addHotelVoucherLinesToBooking()
        const existingVoucherId = bookingDetails.vouchers.find(v => v.hotel.id === hotel.id)?.voucher.id
        existingVoucherId ? newResponse = await addHotelVoucherLineToExistingVoucher(
          existingVoucherId,
          data
        ) : alert("Uh oh! Couldn't find the existing voucher")

      }

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

  if (loading || !isOrgLoaded) {
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

  const onEdit = (data: any) => {
    setTriggerEdit(true);
    if (!selectedVoucher) {

      toast({
        title: "Uh Oh!",
        description: "Couldn't find the selected voucher",
      });
      return
    }
    if (selectedVoucher.voucher.status !== "inprogress") {
      toast({
        title: "Uh Oh!",
        description: "You've already proceeded with this voucher. Please go to send vouchers and amend!",
      });
      return
    }
    // setSelectedVoucher(data)
    if (!selectedVoucher.voucherLines[0]) {
      return;
    }

    // const lineIdToEdit = bookingDetails.vouchers.find((v) => v.voucher.id === selectedVoucher?.voucher.id)?.voucherLines.find(v=> v.id === data.id)?.id;
    setVoucherLineIdToEdit(data.id);

    setDefaultValues({ ...data, hotel: selectedVoucher.hotel, id: data.id, hotelVoucherId: data.hotelVoucherId });
    setDefaultHotel(selectedVoucher.hotel);

  };

  const onDelete = async (data: any) => {
    setVoucherLineIdToEdit(data.id);
    // setSelectedVoucher(data);
    if (selectedVoucher?.voucher.status) {
      setIsExistingVoucherDelete(true);
      return;
    }
    setIsUnsavedVoucherDelete(true);
    setIsDeleteOpen(true);
  };

  const handleVoucherLineDelete = async () => {
    if (voucherLineIdToEdit === "none") {
      toast({
        title: "Uh Oh",
        description: `Couldn't find the id for this voucher`,
      });
      return;
    }
    if (selectedVoucher && selectedVoucher.voucher.status) {
      if (selectedVoucher.voucher.status !== "inprogress") {
        toast({
          title: "Uh Oh",
          description: `You cant delete this voucher. It's already ${selectedVoucher.voucher.status}!. Please go to proceed vouchers and send the cancellation voucher first`,
        });
        return;
      }
      try {
        setIsDeleting(true);
        const deletedData = await deleteHotelVoucherLine(
          voucherLineIdToEdit,
        );
        if (!deletedData) {
          throw new Error("Couldn't delete voucher");
        }

        // deleteVoucherLineFromLocalContext();
        setIsDeleting(false);
        setVoucherLineIdToEdit("none")
        updateTriggerRefetch();
      } catch (error) {
        toast({
          title: "Uh Oh",
          description: `Couldn't delete this voucher`,
        });
        setIsDeleting(false);
        setVoucherLineIdToEdit("none")
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

  const renderExpandedRow = (row: HotelVoucher) => {
    // Let's assume `row.bookings` is an array of bookings for the hotel
    const voucherLines = row.voucherLines || [];;  // Example: Add bookings array to each row data

    return (
      <div className="">

        <Table>
          <TableBody>
            {voucherLines.length ? (
              voucherLines.map((line: InsertHotelVoucherLine, index: number) => (
                <TableRow key={index}>
                  <TableCell>{row.hotel.name}</TableCell>
                  <TableCell>{line.adultsCount}</TableCell>
                  <TableCell>{line.kidsCount}</TableCell>
                  <TableCell>{line.roomCount}</TableCell>
                  <TableCell>{line.checkInDate}</TableCell>
                  <TableCell>{line.checkOutDate}</TableCell>
                  <TableCell>{line.roomType}</TableCell>
                  <TableCell>{line.basis}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No bookings available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
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
            ...bookingDetails.vouchers.flatMap((voucher) =>
              voucher.voucherLines.map((line) => ({
                start: line.checkInDate ?? "",
                end: line.checkOutDate ?? "",
              }))
            ),
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
              triggerEdit={triggerEdit}
            />
          )}
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-2">
        <div className="w-full">
          {/* <DataTable columns={voucherColumns} data={bookingDetails.vouchers} /> */}
          {/* <DataTableWithActions
            columns={hotelVoucherColumns}
            data={bookingDetails.vouchers.filter(v => v.voucher.status !== "cancelled")}
            onEdit={onEdit}
            onDelete={onDelete}
            onRowClick={() => {
              console.log("row");
            }}
            renderExpandedRow={renderExpandedRow}
          /> */}
          <ExpandableDataTableWithActions
            columns={hotelVoucherColumns}
            data={bookingDetails.vouchers.filter(v => v.voucher.status !== "cancelled")}
            onEdit={onEdit}
            expandedColumns={hotelVoucherLineColumns}
            onDelete={onDelete}
            onRowClick={(row) => {
              setSelectedVoucher(row)
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
        onDelete={handleVoucherLineDelete}
        isOpen={isUnsavedVoucherDelete}
        setIsOpen={setIsUnsavedVoucherDelete}
        isDeleting={isDeleting}
      />

      <DeletePopup
        itemName={`Voucher for ${selectedVoucher?.hotel.name}`}
        onDelete={handleVoucherLineDelete}
        isOpen={isExistingVoucherDelete}
        setIsOpen={setIsExistingVoucherDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default HotelsTab;
