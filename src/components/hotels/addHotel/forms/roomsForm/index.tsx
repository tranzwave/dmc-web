'use client';

import { useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import { columns } from "./columns";
import RoomsForm from "./roomsForm";
import { useAddHotel } from "~/app/dashboard/hotels/add/context";
import { Button } from "~/components/ui/button";
import { HotelRoomType } from "../generalForm/columns";

const RoomsTab = () => {
    const [addedRooms, setAddedRooms] = useState<HotelRoomType[]>([]); // State to handle added rooms
    const { addHotelRoom, hotelRooms } = useAddHotel(); // Assuming similar context structure

    const updateRooms = (room: HotelRoomType) => {
        console.log("Hereeee");
        addHotelRoom(room); // Adding the room to the context
        setAddedRooms((prevRooms) => [...prevRooms, room]); // Update local state
    };

    return (
        <div className="flex flex-col gap-3 justify-center items-center">
            <div className='w-full flex flex-row gap-2 justify-center'>
                <div className='card w-[90%] space-y-6'>
                    <div className='card-title'>Room Information</div>
                    <RoomsForm onAddRoom={updateRooms} />
                </div>
            </div>
            <div className='flex flex-col gap-2 items-center justify-center w-[90%]'>
                <div className='w-full'>
                    <DataTable columns={columns} data={hotelRooms} />
                </div>
                <div className="w-full flex justify-end">
                    <Button variant={"primaryGreen"}>Next</Button>
                </div>
            </div>
        </div>
    );
};

export default RoomsTab;
