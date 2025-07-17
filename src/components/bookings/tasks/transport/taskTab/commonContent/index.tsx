import React from 'react';
import Link from 'next/link';
import { Button } from '~/components/ui/button';
import { DataTable } from "~/components/bookings/home/dataTable";
import Popup from "~/components/common/popup";
import { ProceedContent } from '../index';
import TourExpenseTrigger from "../../tourExpenseSheetTemplate/tourExpenseTrigger";
import DeletePopup from "~/components/common/deletePopup";
import DeleteReasonPopup from "~/components/common/deleteReasonPopup";
import CancellationReasonPopup from "~/components/common/deleteReasonPopup/cancellationReasonPopup";
import { LoaderCircle } from 'lucide-react';
import ContactContent from '~/components/common/tasksTab/contactContent';
import { BookingLineWithAllData } from '~/lib/types/booking';
import { TransportVoucherData } from '../..';
import { ColumnDef } from '@tanstack/react-table';
import { otherTransportVoucherLineColumns } from '~/components/bookings/editBooking/forms/transportForm/otherTransportTab/otherTransportColumns';
import { TransportVoucher } from '~/app/dashboard/bookings/[id]/edit/context';
import FlightDetails from '../../flightDetails';

interface VoucherInformationProps {
    pathname: string;
    vouchers: TransportVoucher[];
    voucherColumns: ColumnDef<TransportVoucher>[];
    onVoucherRowClick: (row: TransportVoucher) => void;
    selectedVoucher: TransportVoucher | null;
    bookingData: BookingLineWithAllData | null;
    handleConfirm: () => void;
    setStatusChanged: React.Dispatch<React.SetStateAction<boolean>>;
    renderCancelContent: () => void;
    isDeleting: boolean;
    contactButton: React.ReactNode;
    isConfirming: boolean;
    handleInProgressVoucherDelete: () => void;
    isInProgressVoucherDelete: boolean;
    setIsInProgressVoucherDelete: React.Dispatch<React.SetStateAction<boolean>>;
    handleProceededVoucherDelete: (reason: string) => void;
    isProceededVoucherDelete: boolean;
    setIsProceededVoucherDelete: React.Dispatch<React.SetStateAction<boolean>>;
    isVoucherDelete: boolean;
    setIsVoucherDelete: React.Dispatch<React.SetStateAction<boolean>>;
    activeTab: string;
}

const TransportTaskTabContent: React.FC<VoucherInformationProps> = ({
    pathname,
    vouchers,
    voucherColumns,
    onVoucherRowClick,
    selectedVoucher,
    bookingData,
    handleConfirm,
    setStatusChanged,
    renderCancelContent,
    isDeleting,
    contactButton,
    isConfirming,
    handleInProgressVoucherDelete,
    isInProgressVoucherDelete,
    setIsInProgressVoucherDelete,
    handleProceededVoucherDelete,
    isProceededVoucherDelete,
    setIsProceededVoucherDelete,
    isVoucherDelete,
    setIsVoucherDelete,
    activeTab
}) => {
    return (
        <div className="card w-full space-y-6">
            <div className="flex justify-between">
                <div className="card-title">Voucher Information</div>
                {bookingData?.status !== "cancelled" && (
                    <Link href={`${pathname.replace("/tasks", "")}/edit?tab=transport`}>
                        <Button variant={"outline"}>Add Vouchers</Button>
                    </Link>
                )}
            </div>
            <div className='flex flex-row justify-between items-end'>
                <div className="text-sm font-normal">
                    Click the line to send the voucher
                </div>

                {bookingData && (
                    <Popup
                        title={"Flight Details"}
                        description="You can update the flight details here"
                        trigger={<Button variant={"primaryGreen"}>Update Flight Details</Button>}
                        onConfirm={handleConfirm}
                        onCancel={() => console.log("Cancelled")}
                        dialogContent={<FlightDetails bookingLine={bookingData} initialArrivalFlight={bookingData.flightDetails?.arrivalFlight} initialDepartureFlight={bookingData.flightDetails?.departureFlight}/>}
                        size="small"
                    />
                )}


            </div>
            {activeTab === "driverAndGuide" && (
                <DataTable
                    data={vouchers.filter((voucher) => voucher.otherTransport === null)}
                    columns={voucherColumns}
                    onRowClick={onVoucherRowClick}
                />
            )}
            {activeTab === "otherTransport" && (
                <DataTable
                    data={vouchers.filter((voucher) => voucher.otherTransport !== null)}
                    columns={otherTransportVoucherLineColumns}
                    onRowClick={onVoucherRowClick}
                />
            )}

            <div className="flex flex-row items-center justify-between">
                <div className="text-sm font-normal">
                    {selectedVoucher
                        ? `${selectedVoucher.driver?.name ?? selectedVoucher.guide?.name} - Voucher`
                        : "Select a voucher from above table"}
                </div>

                {selectedVoucher && bookingData && activeTab === "driverAndGuide" && (
                    <div className="flex flex-row gap-2">
                        {selectedVoucher.driver && (
                            <Popup
                                title={"Log Sheet"}
                                description="Please click on preview button to get the document"
                                trigger={<Button variant={"primaryGreen"}>Log Sheet</Button>}
                                onConfirm={handleConfirm}
                                onCancel={() => console.log("Cancelled")}
                                dialogContent={
                                    <ProceedContent
                                        voucherColumns={voucherColumns}
                                        voucher={selectedVoucher}
                                        setStatusChanged={setStatusChanged}
                                        bookingData={bookingData}
                                        type="driver"
                                    />
                                }
                                size="large"
                            />
                        )}

                        {selectedVoucher && (selectedVoucher.guide ?? (selectedVoucher.driver && selectedVoucher.driver.type === "Chauffeur")) && (
                            <Popup
                                title={"Guide Settlement Form"}
                                description="Please click on preview button to get the document"
                                trigger={<Button variant={"primaryGreen"}>Guide Settlement</Button>}
                                onConfirm={handleConfirm}
                                onCancel={() => console.log("Cancelled")}
                                dialogContent={
                                    <ProceedContent
                                        voucherColumns={voucherColumns}
                                        voucher={selectedVoucher}
                                        setStatusChanged={setStatusChanged}
                                        bookingData={bookingData}
                                        type="guide"
                                    />
                                }
                                size="large"
                            />
                        )}

                        <TourExpenseTrigger bookingData={bookingData} />
                    </div>
                )}

            </div>

            {activeTab === "driverAndGuide" && (
                <DataTable
                    data={selectedVoucher ? selectedVoucher.voucher.status !== "cancelled" ? selectedVoucher.otherTransport === null ? [selectedVoucher] : [] : [] : []}
                    columns={voucherColumns}
                    onRowClick={onVoucherRowClick}
                />
            )}
            {activeTab === "otherTransport" && (
                <DataTable
                    data={selectedVoucher ? selectedVoucher.voucher.status !== "cancelled" ? selectedVoucher.otherTransport ? [selectedVoucher] : [] : [] : []}
                    columns={otherTransportVoucherLineColumns}
                    onRowClick={onVoucherRowClick}
                />
            )}

            <div
                className={`flex flex-row items-end justify-end ${!selectedVoucher ? "hidden" : ""}`}
            >
                <div className="flex flex-row gap-2">
                    {selectedVoucher ? (
                        <div className="flex flex-row gap-2">
                            <Button
                                variant={"outline"}
                                className="border-red-600"
                                onClick={renderCancelContent}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <div className="flex flex-row gap-2">
                                        <LoaderCircle size={16} />{" "}
                                        <div>
                                            {selectedVoucher.voucher.status === "cancelled"
                                                ? "Loading"
                                                : "Cancelling"}
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        {selectedVoucher.voucher.status === "cancelled"
                                            ? "Reason"
                                            : "Cancel"}
                                    </div>
                                )}
                            </Button>

                            <Popup
                                title="Contact"
                                description="Loading Contact Details"
                                trigger={contactButton}
                                onConfirm={handleConfirm}
                                onCancel={() => console.log("Cancelled")}
                                dialogContent={ContactContent(
                                    selectedVoucher?.driver?.primaryContactNumber ??
                                    selectedVoucher?.guide?.primaryContactNumber ??
                                    "N/A",
                                    selectedVoucher?.driver?.primaryEmail ??
                                    selectedVoucher?.guide?.primaryEmail ??
                                    "N/A",
                                )}
                                size="small"
                            />
                            <Button
                                variant={"primaryGreen"}
                                onClick={handleConfirm}
                                disabled={isConfirming}
                            >
                                {selectedVoucher.driver ? "Confirm Driver" : selectedVoucher.guide ? "Confirm Guide" : "Confirm Transport"}
                            </Button>
                            <DeletePopup
                                itemName={`Voucher for ${selectedVoucher?.driver?.name}`}
                                onDelete={handleInProgressVoucherDelete}
                                isOpen={isInProgressVoucherDelete}
                                setIsOpen={setIsInProgressVoucherDelete}
                                isDeleting={isDeleting}
                                description="You haven't confirmed with the driver yet. You can delete the
                voucher straight away"
                            />
                            <DeleteReasonPopup
                                itemName={`Voucher for ${selectedVoucher?.driver?.name}`}
                                onDelete={handleProceededVoucherDelete}
                                isOpen={isProceededVoucherDelete}
                                setIsOpen={setIsProceededVoucherDelete}
                                isDeleting={isDeleting}
                                description={`You have already proceeded with this driver/guide, and it's in the status of ${selectedVoucher.voucher.status} \n
                Are you sure you want to cancel this driver/guide? This will delete the driver from this booking`}
                            />

                            <CancellationReasonPopup
                                itemName={`Voucher for ${selectedVoucher?.driver?.name ?? selectedVoucher?.guide?.name}`}
                                cancellationReason={
                                    selectedVoucher?.voucher.reasonToDelete ??
                                    "No reason provided. This is cancelled before confirm."
                                }
                                isOpen={isVoucherDelete}
                                setIsOpen={setIsVoucherDelete}
                            />
                        </div>
                    ) : (
                        ""
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransportTaskTabContent;