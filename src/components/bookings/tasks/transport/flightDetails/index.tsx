"use client"

import { LoaderCircle } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { toast } from '~/hooks/use-toast';
import { BookingLineWithAllData } from '~/lib/types/booking';
import { updateFlightDetails, updateTourInvoice } from '~/server/db/queries/booking';
import { SelectBookingLine } from '~/server/db/schemaTypes';

interface FlightDetailsProps {
    initialArrivalFlight?: string;
    initialDepartureFlight?: string;
    bookingLine: BookingLineWithAllData
    // onUpdate: (arrivalFlight: string, departureFlight: string) => void;
}

const FlightDetails: React.FC<FlightDetailsProps> = ({
    initialArrivalFlight = '',
    initialDepartureFlight = '',
    bookingLine
    // onUpdate,
}) => {
    const [arrivalFlight, setArrivalFlight] = useState(initialArrivalFlight);
    const [departureFlight, setDepartureFlight] = useState(initialDepartureFlight);
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdate = async () => {
        try {
            setIsLoading(true);
            // Simulate an API call
            const response = await updateFlightDetails(bookingLine.id, {
                flightDetails: {
                    arrivalFlight,
                    departureFlight,
                    arrivalDate: "",
                    departureDate: "",
                    arrivalTime: "",
                    departureTime: "",
                }
            });

            console.log("Flight details updated successfully:", response);

            setIsLoading(false);

            toast({
                title: "Flight details updated successfully",
                description: "Flight details have been updated.",
            })

            bookingLine.flightDetails = {
                arrivalFlight,
                departureFlight,
                arrivalDate: "",
                departureDate: "",
                arrivalTime: "",
                departureTime: "",
            }

        } catch (error) {
            console.error("Error updating flight details:", error);
            toast({
                title: "Error updating flight details",
                description: "There was an error updating the flight details.",
            })

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='flex flex-col gap-3'>
            <div className='w-full grid grid-cols-2 gap-3 justify-between items-center text-[10px]'>
                Ex : March 19th, MU231 Pudong Colombo 13:55-19:00
            </div>
            <div className='w-full grid grid-cols-1 gap-3 justify-between items-center text-[13px]'>
                <div>
                    <div>
                        Arrival Flight
                    </div>
                    <Input
                        type="text"
                        value={arrivalFlight}
                        onChange={(e) => setArrivalFlight(e.target.value)}
                    />
                </div>
                <div>
                    <div>
                        Departure Flight
                    </div>
                    <Input
                        type="text"
                        value={departureFlight}
                        onChange={(e) => setDepartureFlight(e.target.value)}
                    />
                </div>

            </div>
            <div className='flex flex-row justify-end items-center'>
                <Button variant={"primaryGreen"} onClick={handleUpdate} disabled={isLoading}>
                    {isLoading ? (<div className='flex flex-row items-center gap-2'>
                        <LoaderCircle className='animate-spin' size={16} />
                        <span className='ml-2'>Updating...</span>
                    </div>) : "Update Flight Details"}
                </Button>
            </div>
        </div>
    );
};

export default FlightDetails;