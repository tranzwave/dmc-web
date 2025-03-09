'use client';

import { useState } from "react";
import { HotelRoom, useAddHotel } from "~/app/dashboard/hotels/add/context";
import { DataTableWithActions } from "~/components/common/dataTableWithActions";
import { Button } from "~/components/ui/button";
import { HotelRoomType } from "../generalForm/columns";
import { columns } from "./columns";
import RoomsForm from "./roomsForm";
import { deleteHotelRoom } from "~/server/db/queries/hotel";
import { toast } from "~/hooks/use-toast";

const RoomsTab = () => {
    const [addedRooms, setAddedRooms] = useState<HotelRoomType[]>([]); // State to handle added rooms
    const { addHotelRoom, hotelRooms,setActiveTab, deleteRoom, duplicateHotelRoom } = useAddHotel(); // Assuming similar context structure
    const [selectedHotelRoom, setSelectedHotelRoom] = useState<HotelRoomType>({
        roomType: "",
        typeName: "",
        count: 1,
        amenities: "",
        floor: 1,
        bedCount: 1,
        hotelId:""
      });
    const [isDeleting, setIsDeleting] = useState(false);

    console.log({hotelRooms: hotelRooms});

    const updateRooms = (room: HotelRoomType) => {
        console.log("Hereeee");
        console.log("Adding Room ", room);
        addHotelRoom(room); // Adding the room to the context
        setSelectedHotelRoom({
            roomType: "",
            typeName: "",
            count: 1,
            amenities: "",
            floor: 1,
            bedCount: 1,
            hotelId:""
          });
        setAddedRooms((prevRooms) => [...prevRooms, room]); // Update local state
    };

    const onRowEdit = (row: HotelRoomType) => {
        console.log(row);
        setSelectedHotelRoom(row);
      };


      const onRowDuplicate = (row: HotelRoom) => {
        duplicateHotelRoom(row.typeName, row.roomType, row.count, row.amenities, row.floor, row.bedCount);
    };

    const onRowDelete = async (row: HotelRoomType) => {
        if(isDeleting) {
            toast({
                title: "Error",
                description: "Please wait for the previous action to complete",
            });
            return;
        };
        setIsDeleting(true);
        try {
            if(row.id){
                const response = await deleteHotelRoom(row.id);

                if (!response) {
                    throw new Error(`Error: Failed to delete the room`);
                }
                toast({
                    title: "Success",
                    description: "Room deleted successfully",
                });
            }
            deleteRoom(row.typeName, row.roomType, row.count, row.amenities, row.floor, row.bedCount);
            setIsDeleting(false);
        } catch (error) {
            console.error("Failed to delete room:", error);
            toast({
                title: "Error",
                description: "Failed to delete room",
            })
            setIsDeleting(false);
        }
      };

      
    return (
        <div className="flex flex-col gap-3 justify-center items-center">
            <div className='w-full flex flex-row gap-2 justify-center'>
                <div className='card w-[90%] space-y-6'>
                    <div className='card-title'>Room Information</div>
                    <RoomsForm onAddRoom={updateRooms} selectedRoom={selectedHotelRoom} />
                </div>
            </div>
            <div className='flex flex-col gap-2 items-center justify-center w-[90%]'>
                <div className='w-full'>
                    <DataTableWithActions columns={columns} data={hotelRooms}
                                onDelete={onRowDelete}
                                onEdit={onRowEdit}
                                onRowClick={onRowEdit}
                                // onDuplicate={onRowDuplicate}
                                isDeleting={isDeleting} />
                </div>
                <div className="w-full flex justify-end">
                    <Button variant={"primaryGreen"} onClick={()=>{hotelRooms.length > 0 ? setActiveTab("staff"): alert("Please add rooms")}}>Next</Button>
                </div>
            </div>
        </div>
    );
};

export default RoomsTab;
