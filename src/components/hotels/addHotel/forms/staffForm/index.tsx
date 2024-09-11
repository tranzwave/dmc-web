'use client';
import { useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import { columns } from "./columns";
import StaffForm from "./staffForm";
import { useAddHotel } from "~/app/dashboard/hotels/add/context"; // Assuming this context exists
import { Button } from "~/components/ui/button";
import { HotelStaffType } from "../generalForm/columns";

const StaffTab = () => {
  const [addedStaff, setAddedStaff] = useState<HotelStaffType[]>([]);
  const { addHotelStaff, hotelStaff, setActiveTab } = useAddHotel(); // Assuming useAddStaff context

  const handleAddStaff = (staff: HotelStaffType) => {
    setAddedStaff([...addedStaff, staff]);
    addHotelStaff(staff); // Call context to add staff
  };

  return (
    <div className="flex flex-col gap-3 justify-center items-center">
      <div className="w-full flex flex-row gap-2 justify-center">
        <div className="card w-[90%] space-y-6">
          <div className="card-title">Add Staff</div>
          <StaffForm onAddStaff={handleAddStaff} />
        </div>
      </div>
      <div className="flex flex-col gap-2 items-center justify-center w-[90%]">
        <div className="w-full">
          <DataTable columns={columns} data={hotelStaff} />
        </div>
        <div className="w-full flex justify-end">
          <Button variant={"primaryGreen"} onClick={()=>{hotelStaff.length > 0 ? setActiveTab("submit") : alert("Please add staff members")}}>Next</Button>
        </div>
      </div>
    </div>
  );
};

export default StaffTab;
