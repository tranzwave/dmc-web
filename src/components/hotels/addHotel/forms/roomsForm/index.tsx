'use client';

import { useState } from "react";
import { HotelRoom, useAddHotel } from "~/app/dashboard/hotels/add/context";
import { DataTableWithActions } from "~/components/common/dataTableWithActions";
import { Button } from "~/components/ui/button";
import { HotelRoomType } from "../generalForm/columns";
import { columns } from "./columns";
import RoomsForm from "./roomsForm";

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

    const updateRooms = (room: HotelRoomType) => {
        console.log("Hereeee");
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

    const onRowDelete = (row: HotelRoomType) => {
        alert(row.typeName);
        deleteRoom(row.typeName, row.roomType, row.count, row.amenities, row.floor, row.bedCount);
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
                                onDuplicate={onRowDuplicate} />
                </div>
                <div className="w-full flex justify-end">
                    <Button variant={"primaryGreen"} onClick={()=>{hotelRooms.length > 0 ? setActiveTab("staff"): alert("Please add rooms")}}>Next</Button>
                </div>
            </div>
        </div>
    );
};

export default RoomsTab;
