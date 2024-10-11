"use client";
import { useState } from "react";
import { useAddHotel } from "~/app/dashboard/hotels/add/context"; // Assuming this context exists
import { DataTableWithActions } from "~/components/common/dataTableWithActions";
import { Button } from "~/components/ui/button";
import { HotelStaffType } from "../generalForm/columns";
import { columns } from "./columns";
import StaffForm from "./staffForm";

const StaffTab = () => {
  const [addedStaff, setAddedStaff] = useState<HotelStaffType[]>([]);

  const [selectedStaff, setSelectedStaff] = useState<HotelStaffType>({
    name: "",
    hotelId: "",
    email: "",
    contactNumber: "",
    occupation: "",
  });

  const { addHotelStaff, hotelStaff, setActiveTab, deleteStaff, duplicateHotelStaff } =
    useAddHotel(); // Assuming useAddStaff context

  const handleAddStaff = (staff: HotelStaffType) => {
    setAddedStaff([...addedStaff, staff]);
    addHotelStaff(staff); // Call context to add staff
    setSelectedStaff({
      name: "",
      hotelId: "",
      email: "",
      contactNumber: "",
      occupation: "",
    });
  };

  const onRowEdit = (row: HotelStaffType) => {
    console.log(row);
    setSelectedStaff(row);
  };

  const onRowDuplicate = (row: HotelStaffType) => {
    console.log(row);
    duplicateHotelStaff(row.name, row.email);
  };

  const onRowDelete = (row: HotelStaffType) => {
    alert(row.name);
    deleteStaff(row.name, row.email);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="flex w-full flex-row justify-center gap-2">
        <div className="card w-[90%] space-y-6">
          <div className="card-title">Add Staff</div>
          <StaffForm onAddStaff={handleAddStaff}
          selectedStaff={selectedStaff} />
        </div>
      </div>
      <div className="flex w-[90%] flex-col items-center justify-center gap-2">
        <div className="w-full">
          <DataTableWithActions
            columns={columns}
            data={hotelStaff}
            onDelete={onRowDelete}
            onEdit={onRowEdit}
            onRowClick={onRowEdit}
            onDuplicate={onRowDuplicate}
          />
        </div>
        <div className="flex w-full justify-end">
          <Button
            variant={"primaryGreen"}
            onClick={() => {
              hotelStaff.length > 0
                ? setActiveTab("submit")
                : alert("Please add staff members");
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StaffTab;
