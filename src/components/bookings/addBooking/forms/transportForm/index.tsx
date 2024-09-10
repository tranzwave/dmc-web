"use client";
import { useEffect, useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import { columns, Transport } from "./columns";
import TransportForm from "./transportsForm";
import { SearchIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Driver, driverColumns } from "~/lib/types/driver/type";
import { DriverSearchParams } from "~/lib/api";
import { useAddBooking } from "~/app/dashboard/bookings/add/context";
import {
  getAllDriversByVehicleTypeAndLanguage,
  getAllLanguages,
  getAllVehicleTypes,
} from "~/server/db/queries/transport";
import {
  SelectDriver,
  SelectDriverLanguage,
  SelectDriverVehicle,
  SelectLanguage,
  SelectVehicle,
} from "~/server/db/schemaTypes";
import { useToast } from "~/hooks/use-toast";
import { Calendar } from "~/components/ui/calendar";
import { ColumnDef } from "@tanstack/react-table";

type DriverWithoutVehiclesAndLanguages = Omit<
  DriverData,
  "languages" | "vehicles"
>;

export type DriverData = SelectDriver & {
  vehicles: (SelectDriverVehicle & {
    vehicle: SelectVehicle;
  })[];
  languages: (SelectDriverLanguage & {
    language: SelectLanguage;
  })[];
};

const TransportTab = () => {
  const { addTransport, bookingDetails, setActiveTab } = useAddBooking();
  const [drivers, setDrivers] = useState<DriverData[]>([]);
  const [searchDetails, setSearchDetails] = useState<Transport | null>(null);
  const [error, setError] = useState<string | null>();
  const [loading, setLoading] = useState(false);
  const [vehicleTypes, setVehicleTypes] = useState<string[]>([]);
  const [languages, setLanguages] = useState<SelectLanguage[]>([]);
  const { toast } = useToast();

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
    if(!bookingDetails.general.includes.transport){
      setActiveTab("shops")
      return ()=>{console.log("Return")};
    }
    fetchData();
  }, []);

  const handleRowClick = (driver: DriverData) => {
    const {
      vehicles,
      languages,
      ...driverWithoutVehiclesAndLanguages
    }: DriverWithoutVehiclesAndLanguages | any = driver;
    if (searchDetails) {
      addTransport({
        driver: driverWithoutVehiclesAndLanguages,
        voucher: {
          bookingLineId: "",
          coordinatorId: bookingDetails.general.marketingManager,
          driverId: driver.id,
          startDate: searchDetails.startDate,
          endDate: searchDetails.endDate,
          language: searchDetails.languageCode,
          vehicleType: searchDetails.vehicleType,
          remarks: searchDetails.remarks,
        },
      });
    }
  };

  const updateSearchData = (transport: Transport) => {
    setSearchDetails(transport);
    const searchParams: DriverSearchParams = {
      vehicleType: transport.vehicleType,
      language: transport.languageCode,
      type: transport.type,
    };
    searchDrivers(searchParams);
  };

  // Function to search for drivers based on transport data
  const searchDrivers = async (searchParams: DriverSearchParams) => {
    console.log(searchParams);
    try {
      const results = await getAllDriversByVehicleTypeAndLanguage(
        searchParams.vehicleType,
        searchParams.language,
      );

      console.log(results);
      const filteredDrivers = results.filter((driver) => {
        if (searchParams.type === "Chauffer") {
          return driver.isGuide;
        } else {
          return !driver.isGuide;
        }
      });

      console.log(filteredDrivers);
      setDrivers(filteredDrivers);
    } catch (error) {
      console.error("Error searching for drivers:", error);
    }
  };

  const onNextClick = () => {
    console.log(bookingDetails);
    if (bookingDetails.transport.length > 0) {
      setActiveTab("shops");
    } else {
      toast({
        title: "Uh Oh!",
        description: "You must add hotel transport to continue",
      });
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="mx-9 flex flex-row justify-center gap-2">
        <div className="w-[25%]">
          <div className="card w-[85%]">
            <Calendar
              mode="range"
              selected={{
                from: new Date(bookingDetails.general.startDate),
                to: new Date(bookingDetails.general.endDate),
              }}
              className="rounded-md"
            />
          </div>
          <div className="card">Profile</div>
        </div>
        <div className="card w-[70%] space-y-6">
          <div className="card-title">Transport Information</div>
          <TransportForm
            onSearchTransport={updateSearchData}
            vehicleTypes={vehicleTypes}
            languages={languages}
          />
          <div className="w-full space-y-2">
            <div className="flex flex-row items-center justify-between">
              <div>
                {searchDetails?.type} - {searchDetails?.vehicleType}
              </div>
              <div className="flex flex-row items-center gap-2 rounded-lg border px-4 py-2">
                <SearchIcon size={18} color="#697077" />
                <div className="font-sans text-sm font-light text-[#697077]">
                  Search for a name here
                </div>
              </div>
            </div>
            <DataTable
              columns={driverDataColumns}
              data={drivers}
              onRowClick={handleRowClick}
            />
          </div>
          <div className="w-full">
            <DataTable columns={columns} data={bookingDetails.transport} />
          </div>
          <div className="flex w-full justify-end">
            <Button variant={"primaryGreen"} onClick={onNextClick}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportTab;


export const driverDataColumns: ColumnDef<DriverData>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "primaryEmail",
    header: "Primary Email",
  },
  {
    accessorKey: "primaryContactNumber",
    header: "Primary Contact Number",
  },
];
