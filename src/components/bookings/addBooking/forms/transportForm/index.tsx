'use client'
import { useEffect, useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import { columns, Transport } from "./columns";
import TransportForm from "./transportsForm";
import { SearchIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Driver, driverColumns } from "~/lib/types/driver/type";
import { DriverSearchParams } from "~/lib/api";
import { useAddBooking } from "~/app/dashboard/bookings/add/context";
import { getAllDriversByVehicleTypeAndLanguage, getAllLanguages, getAllVehicleTypes } from "~/server/db/queries/transport";
import { SelectDriver, SelectDriverLanguage, SelectDriverVehicle, SelectLanguage, SelectVehicle } from "~/server/db/schemaTypes";

type DriverWithoutVehiclesAndLanguages = Omit<DriverData, "languages" | "vehicles">

export type DriverData = SelectDriver & {
    vehicles: (SelectDriverVehicle & {
      vehicle: SelectVehicle;
    })[];
    languages: (SelectDriverLanguage & {
      language: SelectLanguage;
    })[];
  };

const TransportTab = () => {
    const { addTransport, bookingDetails } = useAddBooking();
    const [drivers, setDrivers] = useState<DriverData[]>([]);
    const [searchDetails, setSearchDetails] = useState<Transport | null>(null);
    const [error, setError] = useState<string | null>();
    const [loading, setLoading] = useState(false);
    const [vehicleTypes, setVehicleTypes] = useState<string[]>([])
    const [languages, setLanguages] = useState<SelectLanguage[]>([])

    const fetchData = async () => {
        try {
          // Run both requests in parallel
          setLoading(true);
          //TODO: Dynamic country code
          const [vehicleResponse, languagesResponse] = await Promise.all([
            getAllVehicleTypes(),
            getAllLanguages(),
          ]);
    
          // Check for errors in the responses
          if (!vehicleResponse) {
            throw new Error("Error fetching vehicle types");
          }
    
          if (!languagesResponse) {
            throw new Error("Error fetching languages");
          }
    
          console.log("Fetched Shop Types:", vehicleResponse);
          console.log("Fetched Cities:", languagesResponse);
    
          // Set states after successful fetch
          setVehicleTypes(vehicleResponse);
          setLanguages(languagesResponse);
    
          setLoading(false);
        } catch (error) {
          if (error instanceof Error) {
            setError(error.message);
          } else {
            setError("An unknown error occurred");
          }
          console.error("Error fetching data:", error);
        }
      };
    
      useEffect(() => {
        fetchData();
      }, []);
    
    const handleRowClick = (driver: DriverData) => {
        const {vehicles, languages, ...driverWithoutVehiclesAndLanguages}: DriverWithoutVehiclesAndLanguages | any = driver
        if (searchDetails) {
            addTransport({
                driver:driverWithoutVehiclesAndLanguages,
                voucher:{
                    bookingLineId: "",
                    coordinatorId: bookingDetails.general.marketingManager,
                    driverId: driver.id,
                    startDate: searchDetails.startDate,
                    endDate: searchDetails.endDate,
                    language: searchDetails.languageCode,
                    vehicleType:searchDetails.vehicleType,
                    remarks:searchDetails.remarks
                }
            });
        }
    };

    const updateSearchData = (transport: Transport) => {
        setSearchDetails(transport);
        const searchParams: DriverSearchParams = {
            vehicleType: transport.vehicleType,
            language: transport.languageCode,
            type: transport.type
        };
        searchDrivers(searchParams);
        
    };

    // Function to search for drivers based on transport data
    const searchDrivers = async (searchParams: DriverSearchParams) => {
        console.log(searchParams)
        try {
            const results = await getAllDriversByVehicleTypeAndLanguage(searchParams.vehicleType,searchParams.language);

            console.log(results)
            const filteredDrivers = results.filter((driver) => {
                if(searchParams.type === "Chauffer"){
                   return driver.isGuide
                } else{
                    return !driver.isGuide
                }
            })

            console.log(filteredDrivers)
            setDrivers(filteredDrivers);
        } catch (error) {
            console.error("Error searching for drivers:", error);
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <div className='flex flex-row gap-2 justify-center mx-9'>
                <div className='w-[25%]'>
                    <div className='card'>
                        Calendar
                    </div>
                    <div className='card'>
                        Profile
                    </div>
                </div>
                <div className='card w-[70%] space-y-6'>
                    <div className='card-title'>Transport Information</div>
                    <TransportForm onSearchTransport={updateSearchData} vehicleTypes={vehicleTypes} languages={languages} />
                    <div className='w-full space-y-2'>
                        <div className="flex flex-row justify-between items-center">
                            <div>
                                {searchDetails?.type} - {searchDetails?.vehicleType}
                            </div>
                            <div className="flex flex-row gap-2 items-center rounded-lg border px-4 py-2">
                                <SearchIcon size={18} color="#697077"/>
                                <div className="font-sans font-light text-[#697077] text-sm">
                                    Search for a name here
                                </div>
                            </div>
                        </div>
                        <DataTable columns={driverColumns} data={drivers} onRowClick={handleRowClick}/>
                    </div>
                    <div className='w-full'>
                        <DataTable columns={columns} data={bookingDetails.transport} />
                    </div>
                    <div className="w-full flex justify-end">
                        <Button variant={"primaryGreen"}>Next</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TransportTab;
