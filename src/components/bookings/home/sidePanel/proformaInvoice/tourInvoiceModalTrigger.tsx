import React, { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "~/components/ui/dialog";
import { BookingLineWithAllData, TourExpense } from '~/lib/types/booking';
import { OrganizationResource, UserResource } from '@clerk/types';
import { useOrganization, useUser } from '@clerk/nextjs';
import LoadingLayout from '~/components/common/dashboardLoading';
import { updateTourExpenses } from '~/server/db/queries/booking';
import { SelectBookingLine } from '~/server/db/schemaTypes';
import VoucherButton from '~/components/bookings/tasks/hotelsTaskTab/taskTab/VoucherButton';
import TourInvoiceModal from './tourInvoiceModal';
import { BookingDTO } from '../../columns';
import TourInvoicePDF from './tourInvoiceDocument';
import { FileTextIcon, FolderCheckIcon } from 'lucide-react';

interface TourInvoiceModalTriggerProps {
    bookingData: BookingDTO;
    isInTable?: boolean;
}

const TourInvoiceModalTrigger: React.FC<TourInvoiceModalTriggerProps> = ({ bookingData, isInTable }) => {
    const [isOpen, setIsOpen] = useState(false);

    const { organization, isLoaded: isOrgLoaded } = useOrganization();
    const { isLoaded, user } = useUser();

    if (!isLoaded || !isOrgLoaded) {
        if (isInTable) {
            return (
                <div>
                    ...
                </div>
            )
        }
        return (
            <LoadingLayout />
        )
    }



    return (
        <div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild className='w-full'>
                    {isInTable ? (
                        <FileTextIcon size={24} className='cursor-pointer text-primary-green p-1 border rounded-md hover:bg-gray-100 hover:cursor-pointer' onClick={() => setIsOpen(true)} />
                    ) : (
                        <Button variant={'primaryGreen'} onClick={() => setIsOpen(true)}>Tour Invoice</Button>
                    )}
                </DialogTrigger>
                <DialogContent className='min-w-fit max-h-[90%] overflow-y-scroll'>
                    <DialogTitle>Tour Proforma Invoice - {bookingData.id}</DialogTitle>
                    <DialogDescription>
                        Here you can manage your entries for the invoice.
                    </DialogDescription>
                    <div className='space-y-4'>
                        {organization && user &&
                            <div className='w-full flex flex-row justify-end'>
                                <VoucherButton buttonText='Download Tour Proforma Invoice as PDF' voucherComponent={
                                    <div>
                                        <TourInvoicePDF organization={organization} user={user as UserResource} bookingData={bookingData} />
                                    </div>
                                } title={`${bookingData.id}-${bookingData.booking.client.name}-Tour-Invoice`} />
                            </div>
                        }
                        <TourInvoiceModal bookingData={bookingData} />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TourInvoiceModalTrigger;