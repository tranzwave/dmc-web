import { useState } from "react";
import { useAddTransport } from "~/app/dashboard/transport/add/context";
import { DataTableWithActions } from "~/components/common/dataTableWithActions";
import { Button } from "~/components/ui/button";
import { columns, Vehicles } from "./columns";
import VehiclesForm from "./vehiclesForm";

const VehiclesTab = () => {
  const [addedVehicle, setAddedVehicle] = useState<Vehicles[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicles>({
    vehicle: "",
    numberPlate: "",
    seats: 1,
    make: "",
    model: "",
    year: "",
    vrl: "",
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { addVehicles, transportDetails, setActiveTab, deleteVehicle, duplicateVehicle } =
    useAddTransport();

  const updateVehicles = (vehicles: Vehicles) => {
    console.log(vehicles);
    addVehicles(vehicles, isEditing, selectedVehicle.id);
    setSelectedVehicle({
      vehicle: "",
      numberPlate: "",
      seats: 1,
      make: "",
      model: "",
      year: "",
      vrl: "",
    });
    setIsEditing(false);
  };

  const onRowEdit = (row: Vehicles) => {
    console.log(row);
    setSelectedVehicle(row);
    setIsEditing(true);
  };

  const onRowDuplicate = (row: Vehicles) => {
    duplicateVehicle(row.numberPlate);
  };

  const onRowDelete = (row: Vehicles) => {
    alert(row.make);
    deleteVehicle(row.numberPlate);
  };

  return (
    <div className="mx-9 flex flex-col justify-center gap-3">
      <div className="card w-[100%] space-y-6">
        <div className="card-title">Vehicle Information</div>
        <VehiclesForm
          onAddVehicles={updateVehicles}
          selectedVehicle={selectedVehicle}
        />
      </div>
      <div className="flex w-[100%] flex-col items-center justify-center gap-2">
        <div className="w-full">
          <DataTableWithActions
            columns={columns}
            data={transportDetails.vehicles}
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
              transportDetails.vehicles.length > 0
                ? setActiveTab("charges")
                : alert("Please add a vehicle");
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VehiclesTab;
