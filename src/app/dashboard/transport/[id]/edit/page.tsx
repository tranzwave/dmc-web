"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingLayout from "~/components/common/dashboardLoading";
import TitleBar from "~/components/common/titleBar";
import ChargesTab from "~/components/transports/addTransport/forms/chargesForm";
import DocumentsTab from "~/components/transports/addTransport/forms/documentsForm";
import GeneralTab from "~/components/transports/addTransport/forms/generalForm";
import EditTransportSubmitForm from "~/components/transports/addTransport/forms/submitForm/editTransportSubmit";
import VehiclesTab from "~/components/transports/addTransport/forms/vehiclesForm";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Driver } from "~/lib/api";
import { getAllLanguages, getAllVehicles, getDriverDataById } from "~/server/db/queries/transport";
import {
  SelectCity,
  SelectDriver,
  SelectDriverLanguage,
  SelectDriverVehicle,
  SelectLanguage,
  SelectVehicle,
} from "~/server/db/schemaTypes";
import { AddTransportProvider, useAddTransport } from "../../add/context";
import { useOrganization } from "@clerk/nextjs";

export type DriverData = SelectDriver & {
  city: SelectCity;
  vehicles: (SelectDriverVehicle & {
    vehicle: SelectVehicle;
  })[];
  languages: (SelectDriverLanguage & {
    language: SelectLanguage;
  })[];
};

const EditTransport = ({ id }: { id: string }) => {
  const pathname = usePathname();
  const [transport, setTransport] = useState<Driver | null>(null);
  const {
    setGeneralDetails,
    addVehicles,
    setChargesDetails,
    setDocumetsDetails,
    transportDetails,
    setActiveTab,
    activeTab,
  } = useAddTransport();
  const isDriver = transportDetails.general.type === 'Driver'
  const [data, setData] = useState<Driver[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [driverData, setDriverData] = useState<DriverData>();
  const [isFetchingLanguages, setIsFetchingLanguages] = useState<boolean>(false);
  const [languages, setLanguages] = useState<SelectLanguage[]>([]);
  const [vehicles, setVehicles] = useState<SelectVehicle[]>([]);
  const { organization, isLoaded } = useOrganization();

  useEffect(() => {
    async function fetchDriverDetails() {
      try {
        setLoading(true);
        const selectedDriver = await getDriverDataById(id);
        if (!selectedDriver) {
          throw new Error("Couldn't find driver");
        }

        console.log("Selected driver:", selectedDriver);

        setDriverData(selectedDriver);
        setGeneralDetails({
          name: selectedDriver.name,
          city: selectedDriver.cityId.toString(),
          type: selectedDriver.type,
          includes: {
            charges: true,
            documents: true,
            vehicles: true,
          },
          languages: selectedDriver.languages.map(l => l.language.name),
          primaryContactNumber: selectedDriver.primaryContactNumber,
          primaryEmail: selectedDriver.primaryEmail,
          province: selectedDriver.province,
          streetName: selectedDriver.streetName,
        });

        selectedDriver.vehicles.forEach((v) => {
          addVehicles({
            vehicle: v.vehicle.vehicleType,
            make: v.vehicle.make,
            model: v.vehicle.model,
            numberPlate: v.vehicle.numberPlate,
            seats: v.vehicle.seats,
            vrl: v.vehicle.revenueLicense,
            year: v.vehicle.year.toString(),
            id: v.vehicleId,
          });
        });

        setChargesDetails({
          accommodationAllowance: selectedDriver.accommodationAllowance,
          feePerKm: selectedDriver.feePerKM,
          fuelAllowance: selectedDriver.fuelAllowance,
          mealAllowance: selectedDriver.mealAllowance,
          feePerDay: selectedDriver.feePerDay,
        });

        setDocumetsDetails({
          driverLicense: selectedDriver.driversLicense,
          guideLicense: selectedDriver.guideLicense ?? "",
          insurance: selectedDriver.insurance,
          vehicleEmissionTest: "N/A",
        });
      } catch (error) {
        console.error("Failed to fetch driver details:", error);
        setError("Failed to load driver details.");
      } finally {
        setLoading(false);
      }
    }
    async function fetchLanguages() {
      try {
        setIsFetchingLanguages(true);
        const response = await getAllLanguages();
        
        if (!response) {
          throw new Error("No languages found");
        }


        setLanguages(response);
        setIsFetchingLanguages(false);
      } catch (error) {
        console.error("Error fetching languages:", error);
        setIsFetchingLanguages(false);
      }
    }
    async function fetchVehicles() {
      try {
        if (!transport || !organization) return;
        setLoading(true);

        const response = await getAllVehicles(organization.id);

        if (!response) {
          throw new Error("No vehicles found");
        }

        setVehicles(response);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        setLoading(false);
      }
    }

    fetchDriverDetails();
    fetchLanguages();
    fetchVehicles();
  }, [id]);

  if (loading || isFetchingLanguages) {
    return (
      <div>
        <LoadingLayout />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const isGuide = transportDetails.general?.type === "Guide";

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="flex flex-col gap-3">
          <div className="flex w-full flex-row justify-between gap-1">
            <TitleBar title={isGuide ? 'Edit Guide' : 'Edit Driver'} link="toAddTransport" />
            <div>
              <Link href={`${pathname}`}>
                <Button variant="link">Finish Later</Button>
              </Link>
            </div>
          </div>
          <div className="w-full">
            <Tabs
              defaultValue="general"
              className="w-full border"
              value={activeTab}
            >
              <TabsList className="flex w-full justify-evenly">
                <TabsTrigger
                  value="general"
                  isCompleted={false}
                  onClick={() => setActiveTab("general")}
                  inProgress={activeTab == "general"}
                >
                  General
                </TabsTrigger>
                {!isGuide && (
                  <>
                    <TabsTrigger
                      value="vehicles"
                      statusLabel="Mandatory"
                      isCompleted={transportDetails.vehicles.length > 0}
                      inProgress={activeTab == "vehicles"}
                      disabled={!transportDetails.general.name}
                    >
                      Vehicles
                    </TabsTrigger>
                    <TabsTrigger
                      value="charges"
                      statusLabel="Mandatory"
                      isCompleted={transportDetails.charges.feePerKm > 0}
                      inProgress={activeTab == "charges"}
                      disabled={transportDetails.vehicles.length == 0}
                    >
                      Charges
                    </TabsTrigger>
                    <TabsTrigger
                      value="documents"
                      statusLabel="Mandatory"
                      isCompleted={
                        transportDetails.documents.vehicleEmissionTest.length >
                        1
                      }
                      inProgress={activeTab == "documents"}
                      disabled={
                        transportDetails.charges.accommodationAllowance! > 0 ||
                        transportDetails.charges.feePerKm == 0 ||
                        transportDetails.charges.fuelAllowance! > 0 ||
                        transportDetails.charges.mealAllowance! > 0
                      }
                    >
                      Documents
                    </TabsTrigger>
                  </>
                )}
                <TabsTrigger
                  value="submit"
                  isCompleted={transportDetails.vehicles.length > 0}
                  inProgress={activeTab == "vehicles"}
                  disabled={
                    !transportDetails.documents.driverLicense ||
                    !transportDetails.documents.guideLicense ||
                    !transportDetails.documents.insurance ||
                    !transportDetails.documents.vehicleEmissionTest
                  }
                >
                  Submit
                </TabsTrigger>
              </TabsList>
              <TabsContent value="general">
                {/* <GeneralTab onSetDetails={setGeneralDetails} /> */}
                <GeneralTab />
              </TabsContent>
              {!isGuide && (
                <>
              <TabsContent value="vehicles">
                <VehiclesTab vehicles={vehicles}/>
              </TabsContent>
              <TabsContent value="charges">
                <ChargesTab />
              </TabsContent>
              <TabsContent value="documents">
                <DocumentsTab isDriver={isDriver} />
              </TabsContent>
              </>
              )}
              <TabsContent value="submit">
                <EditTransportSubmitForm
                  id={id}
                  originalDriverData={driverData ?? null}
                  languages={languages}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function WrappedEditTransport() {
  const { id } = useParams();
  return (
    <AddTransportProvider>
      {id ? (
        <EditTransport id={id as string} />
      ) : (
        <div>No transport ID provided.</div>
      )}
    </AddTransportProvider>
  );
}
