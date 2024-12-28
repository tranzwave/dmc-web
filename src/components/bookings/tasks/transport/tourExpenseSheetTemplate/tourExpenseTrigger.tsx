import React, { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "~/components/ui/dialog";
import TourExpenseSheetTemplate from '.';
import { BookingLineWithAllData, TourExpense } from '~/lib/types/booking';
import { OrganizationResource, UserResource } from '@clerk/types';
import { useOrganization, useUser } from '@clerk/nextjs';
import LoadingLayout from '~/components/common/dashboardLoading';
import TourExpenseCreator from './tourExpenseCreator';
import VoucherButton from '../../hotelsTaskTab/taskTab/VoucherButton';
import { updateTourExpenses } from '~/server/db/queries/booking';
import { SelectBookingLine } from '~/server/db/schemaTypes';

interface TourExpenseTriggerProps {
    bookingData: BookingLineWithAllData;
}

const TourExpenseTrigger: React.FC<TourExpenseTriggerProps> = ({ bookingData }) => {
    const [isOpen, setIsOpen] = useState(false);

    const { organization, isLoaded: isOrgLoaded } = useOrganization();
    const { isLoaded, user } = useUser();

    if (!isLoaded || !isOrgLoaded) {
        return (
            <LoadingLayout />
        )
    }
    


    return (
        <div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant={'primaryGreen'} onClick={() => setIsOpen(true)}>Tour Expenses</Button>
                </DialogTrigger>
                <DialogContent className='min-w-fit max-h-[90%] overflow-y-scroll'>
                    <DialogTitle>Tour Expense Sheet</DialogTitle>
                    <DialogDescription>
                        Here you can manage your tour expenses.
                    </DialogDescription>
                    <div className='space-y-4'>
                        {organization && user && 
                        <div className='w-full flex flex-row justify-end'>
                            <VoucherButton buttonText='Download Tour Expenses Sheet as PDF' voucherComponent={
                            <div>
                                <TourExpenseSheetTemplate bookingData={bookingData} organization={organization} user={user as UserResource} />
                            </div>
                        } title={`${bookingData.id}-${bookingData.booking.client.name}-Tour-Expenses`}/>
                        </div>
                            }
                        <TourExpenseCreator bookingData={bookingData}/>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TourExpenseTrigger;