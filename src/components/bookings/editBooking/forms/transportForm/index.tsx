"use client";
import { ColumnDef } from "@tanstack/react-table";
import { LoaderCircle, SearchIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useEditBooking } from "~/app/dashboard/bookings/[id]/edit/context";
import { DataTable } from "~/components/bookings/home/dataTable";
import { DataTableWithActions } from "~/components/common/dataTableWithActions";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { useToast } from "~/hooks/use-toast";
import { DriverSearchParams, GuideSearchParams } from "~/lib/api";
import { addTransportVouchersToBooking } from "~/server/db/queries/booking";
import {
  getAllChauffeurByVehicleTypeAndLanguage,
  getAllDriversByVehicleTypeAndLanguage,
  getAllGuidesByLanguage,
  getAllLanguages,
  getAllVehicleTypes,
} from "~/server/db/queries/transport";
import {
  SelectDriver,
  SelectDriverLanguage,
  SelectDriverVehicle,
  SelectGuide,
  SelectGuideLanguage,
  SelectLanguage,
  SelectVehicle,
} from "~/server/db/schemaTypes";
import { columns, Transport } from "./columns";
import TransportForm from "./transportsForm";

type DriverWithoutVehiclesAndLanguages = Omit<
  DriverData,
  "languages" | "vehicles"
>;

type GuideWithoutLanguages = Omit<GuideData, "languages">;

export type DriverData = SelectDriver & {
  vehicles: (SelectDriverVehicle & {
    vehicle: SelectVehicle;
  })[];
  languages: (SelectDriverLanguage & {
    language: SelectLanguage;
  })[];
};

export type GuideData = SelectGuide & {
  languages: (SelectGuideLanguage & {
    language: SelectLanguage;
  })[];
};

const TransportTab = () => {
  const { addTransport, bookingDetails, setActiveTab } = useEditBooking();
  const [drivers, setDrivers] = useState<DriverData[]>([]);
  const [guides, setGuides] = useState<GuideData[]>([]);
  const [currentSearchType, setCurrentSearchType] = useState<
    "Driver" | "Guide" | "Chauffeur" | null
  >(null);
  const [searchDetails, setSearchDetails] = useState<Transport | null>(null);
  const [error, setError] = useState<string | null>();
  const [loading, setLoading] = useState(false);
  const [vehicleTypes, setVehicleTypes] = useState<string[]>([]);
  const [languages, setLanguages] = useState<SelectLanguage[]>([]);
  const { toast } = useToast();

  const [saving, setSaving] = useState(false);

  const pathname = usePathname();
  const bookingLineId = pathname.split("/")[3];

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
    console.log('Booking Details: ',bookingDetails)
    if (!bookingDetails.general.includes.transport) {
      setActiveTab("shops");
      return () => {
        console.log("Return");
      };
    }
    fetchData();
  }, []);

  const handleRowClick = (type: DriverData | GuideData) => {
    const {
      vehicles,
      languages,
      ...driverOrGuideWithoutExtraFields
    }: DriverWithoutVehiclesAndLanguages | GuideWithoutLanguages | any = type;
  
    if (searchDetails) {
      const isDriver = "vehicles" in type; 
      addTransport({
        driver: isDriver ? driverOrGuideWithoutExtraFields : null,
        guide: !isDriver ? driverOrGuideWithoutExtraFields : null,
        voucher: {
          bookingLineId: bookingLineId ?? "",
          coordinatorId: bookingDetails.general.marketingManager,
          driverId: isDriver ? type.id : undefined,
          guideId: !isDriver ? type.id : undefined, 
          startDate: searchDetails.startDate,
          endDate: searchDetails.endDate,
          language: searchDetails.languageCode,
          remarks: searchDetails.remarks,
        },
        driverVoucherLine: isDriver
          ? {
              transportVoucherId: 'transportVoucher.id',
              vehicleType: searchDetails.vehicleType,
            }
          : undefined, 
        guideVoucherLine: !isDriver 
          ? {
              transportVoucherId: 'transportVoucher.id',
            } 
          : undefined,
      });
    }
  };

  const updateSearchData = (transport: Transport) => {
    setSearchDetails(transport);
    const searchParams = {
      vehicleType: transport.vehicleType,
      language: transport.languageCode,
      type: transport.type,
    };

    if (transport.type === "Guide") {
      setCurrentSearchType("Guide");
      searchGuides({ language: transport.languageCode, type: transport.type });
    } else if(transport.type === "Driver") {
      setCurrentSearchType("Driver");
      searchDrivers(searchParams);
    }else if(transport.type === "Chauffeur") {
      setCurrentSearchType("Chauffeur");
      searchChauffeur(searchParams);
    }
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
        if (searchParams.type === "Driver") {
          return driver.type;
        } else {
          return !driver.type;
        }
      });

      console.log(filteredDrivers);
      setDrivers(filteredDrivers);
    } catch (error) {
      console.error("Error searching for drivers:", error);
    }
  };

  const searchChauffeur = async (searchParams: DriverSearchParams) => {
    console.log(searchParams);
    try {
      const results = await getAllChauffeurByVehicleTypeAndLanguage(
        searchParams.vehicleType,
        searchParams.language,
      );

      console.log(results);
      const filteredChauffeurs = results.filter((driver) => {
        if (searchParams.type === "Chauffeur") {
          return driver.type;
        } else {
          return !driver.type;
        }
      });

      console.log(filteredChauffeurs);
      setDrivers(filteredChauffeurs);
    } catch (error) {
      console.error("Error searching for Chauffeurs:", error);
    }
  };

  const searchGuides = async (searchParams: GuideSearchParams) => {
    console.log(searchParams);
    try {
      const results = await getAllGuidesByLanguage(searchParams.language);

      console.log(results);
      const filteredGuides = results.filter((guide) => {
        return guide.type;
      });

      console.log(filteredGuides);
      setGuides(filteredGuides);
    } catch (error) {
      console.error("Error searching for guides:", error);
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

  const onSaveClick = async () => {
    console.log(bookingDetails.transport);
  
    const newVouchers = bookingDetails.transport.filter((v) => !v.voucher?.id);
  
    if (newVouchers.length === 0) {
      toast({
        title: "Uh Oh!",
        description: "No new vouchers to add!",
      });
  
      return;
    }
  
    try {
      setSaving(true);
      const newResponse = await addTransportVouchersToBooking(
        newVouchers,
        bookingLineId ?? "",
        bookingDetails.general.marketingManager
      );
  
      if (!newResponse) {
        throw new Error("Error: Couldn't add transport vouchers");
      }
  
      console.log("Fetched Transport:", newResponse);
      setSaving(false);
      toast({
        title: "Success",
        description: "Transport Vouchers Added!",
      });
    } catch (error) {
      setSaving(false);
      toast({
        title: "Uh Oh!",
        description: "Couldn't add transport!",
      });
      console.error("Error:", error);
    }
  };
  

  return (
    <div className="flex flex-col gap-3">
      <div className="mx-9 flex flex-row justify-center gap-3">
        <div className="flex flex-col gap-3">
          <Calendar
            mode="range"
            selected={{
              from: new Date(bookingDetails.general.startDate),
              to: new Date(bookingDetails.general.endDate),
            }}
            className="rounded-md"
          />
          {/* <div className="border card"></div> */}
        </div>
        <div className="card w-full space-y-6">
          <div className="card-title">Transport Information</div>
          <TransportForm
            onSearchTransport={updateSearchData}
            vehicleTypes={vehicleTypes}
            languages={languages}
          />
          <div className="w-full space-y-2">
            <div className="flex flex-row items-center justify-between">
              {searchDetails?.type !== "Guide" ? (
              <div>
                {searchDetails?.type} - {searchDetails?.vehicleType}
              </div>
              ) : (
                <div>{searchDetails?.type}</div>
              )
}
              <div className="flex flex-row items-center gap-2 rounded-lg border px-4 py-2">
                <SearchIcon size={18} color="#697077" />
                <div className="font-sans text-sm font-light text-[#697077]">
                  Search for a name here
                </div>
              </div>
            </div>
            <DataTable
              columns={dataColumns}
              data={
                currentSearchType === "Driver"
                  ? drivers
                  : currentSearchType === "Chauffeur"
                  ? drivers
                  : currentSearchType === "Guide"
                    ? guides
                    : []
              }
              onRowClick={handleRowClick} // onRowClick={handleRowClick}
            />
          </div>
          <div className="w-full">
            <DataTableWithActions columns={columns} data={bookingDetails.transport}
             onEdit={()=>{console.log("edit")}}
             onDelete={()=>{console.log("delete")}}
             onRowClick={() => {console.log("row");}}  />    
          </div>
          <div className="flex w-full justify-end">
            <Button
              variant={"primaryGreen"}
              onClick={onSaveClick}
              disabled={saving}
            >
              {saving ? (
                <div className="flex flex-row gap-1">
                  <div>
                    <LoaderCircle className="animate-spin" size={10} />
                  </div>
                  Saving
                </div>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportTab;

export const dataColumns: ColumnDef<DriverData | GuideData>[] = [
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

export const guideDataColumns: ColumnDef<GuideData>[] = [
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
