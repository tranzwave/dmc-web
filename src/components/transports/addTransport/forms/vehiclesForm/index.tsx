import { useState } from "react";
import { useAddTransport } from "~/app/dashboard/transport/add/context";
import { DataTable } from "~/components/bookings/home/dataTable";
import { Button } from "~/components/ui/button";
import { columns, Vehicles } from "./columns";
import VehiclesForm from "./vehiclesForm";

const VehiclesTab = ()=>{
    const [addedVehicle, setAddedVehicle] =useState<Vehicles[]>([])

    const { addVehicles,transportDetails } = useAddTransport();

    const updateVehicles = (vehicles:Vehicles)=>{
        console.log(vehicles);
        addVehicles(vehicles);
    }

    return(
        <div className='flex flex-col gap-3 justify-center mx-9'>
            <div className='card w-[100%] space-y-6'>
                <div className='card-title'>Vehicle Information</div>
                <VehiclesForm onAddVehicles={updateVehicles}/>
            </div>
            <div className='flex flex-col gap-2 items-center justify-center w-[100%]'>
                <div className='w-full'>
                    <DataTable columns={columns} data={transportDetails.vehicles}/>
                </div>
                <div className="w-full flex justify-end">
                <Button variant={"primaryGreen"}>Next</Button>
            </div>
        </div>
        </div>
    );
}

export default VehiclesTab;