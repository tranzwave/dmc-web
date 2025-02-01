import React, { useEffect, useState } from 'react';
import OtherTransportForm from './otherTransportsForm';
import { LoaderCircle, SearchIcon } from 'lucide-react';
import { DataTable } from '~/components/bookings/home/dataTable';
import { DataTableWithActions } from '~/components/common/dataTableWithActions';
import { Button } from '~/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { InsertOtherTransportVoucherLine, SelectCity, SelectLanguage, SelectOtherTransport } from '~/server/db/schemaTypes';
import { BookingLineWithAllData } from '~/lib/types/booking';
import { TransportVoucher, useEditBooking } from '~/app/dashboard/bookings/[id]/edit/context';
import { OtherTransportSearchType, Transport } from '../columns';
import { useToast } from '~/hooks/use-toast';
import { getAllOtherTransports, getOtherTransportByCityTransportAndVehicle } from '~/server/db/queries/transport';
import { otherTransportColumns, OtherTransportWithCity } from '~/components/transports/addTransport/forms/generalForm/other-transport/columns';
import { addTransportVouchersToBooking } from '~/server/db/queries/booking';
import { deleteDriverTransportVoucher, deleteGuideTransportVoucher, deleteOtherTransportVoucher } from '~/server/db/queries/booking/transportVouchers';
import { otherTransportVoucherLineColumns } from './otherTransportColumns';
import Popup from '~/components/common/popup';
import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogTrigger } from '~/components/ui/dialog';
import { is } from 'drizzle-orm';
import { DialogTitle } from '@radix-ui/react-dialog';
import { format } from 'date-fns';
import DeletePopup from '~/components/common/deletePopup';
import { ColumnDef } from '@tanstack/react-table';



const OtherTransportTab: React.FC = () => {
    const { addTransport, bookingDetails, setActiveTab } = useEditBooking();
    const [otherTransports, setOtherTransports] = useState<(OtherTransportWithCity)[]>([]);
    const [currentSearchType, setCurrentSearchType] = useState<
        "Sea" | "Land" | "Air" | null
    >(null);
    const [searchDetails, setSearchDetails] = useState<OtherTransportSearchType | null>(null);
    const [error, setError] = useState<string | null>();
    const [loading, setLoading] = useState(false);
    const [vehicleTypes, setVehicleTypes] = useState<string[]>([]);
    const [languages, setLanguages] = useState<SelectLanguage[]>([]);
    const { toast } = useToast();

    const [saving, setSaving] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState<TransportVoucher>();
    const [isExistingVoucherDelete, setIsExistingVoucherDelete] = useState(false);
    const [isUnsavedVoucherDelete, setIsUnsavedVoucherDelete] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const { deleteTransportVouchers, updateTriggerRefetch } = useEditBooking();
    const pathname = usePathname();
    const bookingLineId = pathname.split("/")[3];
    const [otherTransportVoucherLine, setOtherTransportVoucherLine] = useState<InsertOtherTransportVoucherLine>();
    const [selectedOtherTransport, setSelectedOtherTransport] = useState<OtherTransportWithCity>();

    const fetchData = async () => {
        try {
            // Run both requests in parallel
            setLoading(true);
            //TODO: Dynamic country code
            const otherTransportsResponse = await getAllOtherTransports();

            // Check for errors in the response
            if (!otherTransportsResponse) {
                throw new Error("Error fetching other transports");
            }

            console.log("Fetched Other Transports:", otherTransportsResponse);

            // Set states after successful fetch
            setOtherTransports(otherTransportsResponse);

            setLoading(false);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error occurred");
            }
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        console.log("Booking Details: ", bookingDetails);
        if (!bookingDetails.general.includes.transport) {
            setActiveTab("shops");
            return () => {
                console.log("Return");
            };
        }
        fetchData();
    }, []);

    const handleRowClick = (type: OtherTransportWithCity) => {
        setSelectedOtherTransport(type);
        setIsPopupOpen(true);
    };

    const searchOtherTransportData = (transportSearchData: OtherTransportSearchType) => {
        setSearchDetails(transportSearchData);
        const searchParams: OtherTransportSearchType = {
            transportType: transportSearchData.transportType,
            vehicleType: transportSearchData.vehicleType,
            cityId: transportSearchData.cityId
        };
    };

    const onSaveClick = async () => {
        console.log(bookingDetails.transport);

        const newVouchers = bookingDetails.transport.filter((v) => !v.voucher?.id);

        if (newVouchers.length === 0) {
            toast({
                title: "Uh Oh!",
                description: "No new vouchers to add!",
            });

            return;
        }

        try {
            setSaving(true);
            const newResponse = await addTransportVouchersToBooking(
                newVouchers,
                bookingLineId ?? "",
                bookingDetails.general.marketingManager,
            );

            if (!newResponse) {
                throw new Error("Error: Couldn't add transport vouchers");
            }

            console.log("Fetched Transport:", newResponse);
            setSaving(false);
            toast({
                title: "Success",
                description: "Transport Vouchers Added!",
            });
            updateTriggerRefetch();
        } catch (error) {
            setSaving(false);
            toast({
                title: "Uh Oh!",
                description: "Couldn't add transport!",
            });
            console.error("Error:", error);
        }
    };

    const onDelete = async (data: TransportVoucher) => {
        setSelectedVoucher(data);
        if (data.voucher.status) {
            setIsExistingVoucherDelete(true);
            return;
        }
        setIsUnsavedVoucherDelete(true);
        setIsDeleteOpen(true);
    };

    const deleteVoucherLineFromLocalContext = () => {
        setIsDeleting(true);
        const index = bookingDetails.transport.findIndex(
            (v) => v == selectedVoucher,
        );
        deleteTransportVouchers(index, selectedVoucher?.voucher?.id ?? "");
        setIsDeleting(false);
    };

    const onYesClick = async () => {
        if (selectedOtherTransport && otherTransportVoucherLine) {
            addTransport({
                driver: null,
                guide: null,
                otherTransport: selectedOtherTransport,
                voucher: {
                    bookingLineId: bookingLineId ?? "",
                    coordinatorId: bookingDetails.general.marketingManager,
                    driverId: undefined,
                    guideId: undefined,
                    otherTransportId: selectedOtherTransport.id,
                    startDate: otherTransportVoucherLine?.date,
                    endDate: otherTransportVoucherLine?.date,
                    language: bookingDetails.general.country,
                    remarks: otherTransportVoucherLine.remarks,
                },
                // Add driverVoucherLine if it's a driver
                driverVoucherLine: undefined,
                // Add guideVoucherLine if it's a guide
                guideVoucherLine: undefined,
                otherTransportVoucherLine: {
                    ...otherTransportVoucherLine,
                    otherTransportId: selectedOtherTransport.id,
                    transportVoucherId: 'transportVoucher.id',
                }
            });
            setIsPopupOpen(false);

        }
    }

    const handleExistingVoucherDelete = async () => {
        if (
          selectedVoucher?.voucher.guideId === null &&
          selectedVoucher.voucher.status
        ) {
          if (selectedVoucher.voucher.status != "inprogress") {
            toast({
              title: "Uh Oh",
              description: `You cant delete this voucher. It's already ${selectedVoucher.voucher.status}!. Please go to proceed vouchers and send the cancellation voucher first`,
            });
            return;
          }
          try {
            setIsDeleting(true);
            const deletedData = await deleteOtherTransportVoucher(
              selectedVoucher?.voucher?.id ?? "",
              "",
            );
            updateTriggerRefetch();
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
    return (
        <div className="card w-full space-y-6">
            <div className="card-title">Transport Information</div>
            <OtherTransportForm
                onSearchTransport={searchOtherTransportData}
                cities={otherTransports.map((t) => t.city)}
                setOtherTransportVoucherLine={setOtherTransportVoucherLine}
            />
            <div className="w-full space-y-2">
                <div className="flex flex-row items-center justify-between">
                    <div>{`${searchDetails?.transportType} - ${searchDetails?.vehicleType}`}</div>
                    <div className="flex flex-row items-center gap-2 rounded-lg border px-4 py-2">
                        <SearchIcon size={18} color="#697077" />
                        <div className="font-sans text-sm font-light text-[#697077]">
                            Search for a name here
                        </div>
                    </div>
                </div>
                <DataTable
                    columns={otherTransportColumns}
                    data={otherTransports.filter(
                        (t) =>
                            t.city.id === searchDetails?.cityId &&
                            t.vehicleType === searchDetails?.vehicleType &&
                            t.transportMethod === searchDetails?.transportType,
                    )
                    }
                    onRowClick={handleRowClick} // onRowClick={handleRowClick}
                />
            </div>
            <div className="w-full">
                <DataTableWithActions
                    columns={otherTransportVoucherLineColumns as ColumnDef<TransportVoucher>[]}
                    data={bookingDetails.transport.filter(
                        (t) => t.otherTransport !== null && t.voucher.status !== "cancelled",
                    )}
                    onEdit={() => {
                        console.log("edit");
                    }}
                    onDelete={onDelete}
                    onRowClick={() => {
                        console.log("row");
                    }}
                />
            </div>
            <div className="flex w-full justify-end gap-2">
                <Button
                    variant={"primaryGreen"}
                    onClick={onSaveClick}
                    disabled={saving}
                >
                    {saving ? (
                        <div className="flex flex-row gap-1">
                            <div>
                                <LoaderCircle className="animate-spin" size={10} />
                            </div>
                            Saving
                        </div>
                    ) : (
                        "Save"
                    )}
                </Button>
                <Link href={`${pathname.split("edit")[0]}/tasks?tab=transport`}>
                    <Button variant={"primaryGreen"}>Send Vouchers</Button>
                </Link>
            </div>
            {/* a shadcn dialog asking if you want to add this other transport to vouchers */}
            <Dialog open={isPopupOpen} onOpenChange={() => setIsPopupOpen(!isPopupOpen)}>
                <DialogContent className='min-w-fit'>
                    <DialogHeader title="Add Voucher">
                        <DialogTitle>{`Add Voucher - ${searchDetails?.transportType} | ${searchDetails?.vehicleType}`}</DialogTitle>
                        <DialogDescription>
                            Do you want to add this transport to the vouchers?
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <div>
                            {/* Show a html table with this transport data */}
                            <table className="w-full table-auto border-collapse">
                                <tbody>
                                    <tr className="bg-gray-200">
                                        <td className="border px-4 py-2 font-bold">Name</td>
                                        <td className="border px-4 py-2">{selectedOtherTransport?.name}</td>
                                    </tr>
                                    <tr className="bg-white">
                                        <td className="border px-4 py-2 font-bold">Transport Type</td>
                                        <td className="border px-4 py-2">{searchDetails?.transportType}</td>
                                    </tr>
                                    <tr className="bg-gray-200">
                                        <td className="border px-4 py-2 font-bold">Vehicle Type</td>
                                        <td className="border px-4 py-2">{searchDetails?.vehicleType}</td>
                                    </tr>
                                    <tr className="bg-white">
                                        <td className="border px-4 py-2 font-bold">City</td>
                                        <td className="border px-4 py-2">{selectedOtherTransport?.city.name}</td>
                                    </tr>
                                    <tr className="bg-gray-200">
                                        <td className="border px-4 py-2 font-bold">Date</td>
                                        <td className="border px-4 py-2">{otherTransportVoucherLine?.date ? format(new Date(otherTransportVoucherLine.date), 'dd/MM/yyyy') : ''}</td>
                                    </tr>
                                    <tr className="bg-white">
                                        <td className="border px-4 py-2 font-bold">Time</td>
                                        <td className="border px-4 py-2">{otherTransportVoucherLine?.time}</td>
                                    </tr>
                                    <tr className="bg-gray-200">
                                        <td className="border px-4 py-2 font-bold">Start Location</td>
                                        <td className="border px-4 py-2">{otherTransportVoucherLine?.startLocation}</td>
                                    </tr>
                                    <tr className="bg-white">
                                        <td className="border px-4 py-2 font-bold">End Location</td>
                                        <td className="border px-4 py-2">{otherTransportVoucherLine?.endLocation}</td>
                                    </tr>
                                    <tr className="bg-gray-200">
                                        <td className="border px-4 py-2 font-bold">Adults</td>
                                        <td className="border px-4 py-2">{otherTransportVoucherLine?.adultsCount}</td>
                                    </tr>
                                    <tr className="bg-white">
                                        <td className="border px-4 py-2 font-bold">Kids</td>
                                        <td className="border px-4 py-2">{otherTransportVoucherLine?.kidsCount}</td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>


                        <div className="flex flex-row gap-2 justify-end mt-3">
                            <Button
                                variant="primaryGreen"
                                onClick={onYesClick}
                            >
                                {isAdding ? (
                                    <div className="flex flex-row gap-1">
                                        <div>
                                            <LoaderCircle className="animate-spin" size={10} />
                                        </div>
                                        Adding
                                    </div>
                                ) : (
                                    "Yes"
                                )}
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    setIsPopupOpen(false);
                                }}
                            >
                                No
                            </Button>
                        </div>

                    </div>
                </DialogContent>


            </Dialog>

            <DeletePopup
                itemName={`Voucher for ${selectedVoucher?.otherTransport?.name}`}
                onDelete={deleteVoucherLineFromLocalContext}
                isOpen={isUnsavedVoucherDelete}
                setIsOpen={setIsUnsavedVoucherDelete}
                isDeleting={isDeleting}
            />

            <DeletePopup
                itemName={`Voucher for ${selectedVoucher?.otherTransport?.name}`}
                onDelete={handleExistingVoucherDelete}
                isOpen={isExistingVoucherDelete}
                setIsOpen={setIsExistingVoucherDelete}
                isDeleting={isDeleting}
            />

        </div>
    );
};

export default OtherTransportTab;