"use client"
import { List } from '@radix-ui/react-navigation-menu';
import React, { useState } from 'react';
import { AlertDialogAction } from '~/components/ui/alert-dialog';
import { Button } from '~/components/ui/button';
import { Dialog, DialogTitle, DialogContent, DialogHeader, DialogDescription } from '~/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { updateBookingMarketingTeam } from '~/server/db/queries/booking';
import { SelectMarketingTeam } from '~/server/db/schemaTypes';
import { BookingDTO } from '../columns';
import { toast } from '~/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface AssignTeamModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectTeam: (team: string) => void;
    marketingTeams: SelectMarketingTeam[];
    booking: BookingDTO;
}

const AssignTeamModal: React.FC<AssignTeamModalProps> = ({ isOpen, onClose, onSelectTeam, marketingTeams, booking }) => {
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(booking.booking.marketingTeam?.id ?? null);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const router = useRouter();

    const handleSelectTeam = (teamId: string) => {
        setSelectedTeamId(teamId);
    };

    const handleConfirm = async () => {
        if (selectedTeamId) {
            try {
                setIsSaving(true);
                const response = await updateBookingMarketingTeam(booking.bookingId, selectedTeamId);

                if (!response) {
                    throw new Error('Failed to update booking marketing team');
                }

                booking.booking.marketingTeam = marketingTeams.find((team) => team.id === selectedTeamId) ?? null;

                setIsSaving(false);

                toast({
                    title: 'Booking marketing team updated',
                    description: 'The booking marketing team has been updated successfully.',
                });

                onClose();

            } catch (error) {
                console.error('Failed to update booking marketing team:', error);
                toast({
                    title: 'Failed to update booking marketing team',
                    description: 'An error occurred while updating the booking marketing team. Please try again.',
                })
                setIsSaving(false);
            }
        }
    };

    const redirectToAddTeam = () => {
        onClose();
        router.push('/dashboard/admin?tab=marketing-teams');
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose} >
            <DialogContent className="max-w-fit max-h-[90%] overflow-y-scroll">
                <DialogHeader>
                    <DialogTitle>Assign a Marketing Team | {booking.id}</DialogTitle>
                    <DialogDescription>
                        You can assign this booking to a marketing team
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <Select
                        onValueChange={(value) => {
                            setSelectedTeamId(value);
                        }}
                        value={selectedTeamId ?? ''}
                    >
                        <SelectTrigger className="bg-slate-100 shadow-md">
                            <SelectValue placeholder="Select a team" />
                        </SelectTrigger>
                        <SelectContent>
                            {marketingTeams.map((team) => (
                                <SelectItem
                                    key={team.id}
                                    value={team.id}
                                >
                                    {`${team.name} | ${team.country}`}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className='text-[12px] text-zinc-500 mt-2'>
                        Can't find the team you're looking for? <span className='text-primary cursor-pointer underline' onClick={redirectToAddTeam}>Click here to create a new team</span>
                    </div>
                </div>
                <div className='flex flex-row w-full justify-end'>
                    <Button
                        onClick={handleConfirm}
                        disabled={!selectedTeamId || isSaving}
                        variant={'primaryGreen'}
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </Button>

                    <Button
                        variant='outline'
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AssignTeamModal;



