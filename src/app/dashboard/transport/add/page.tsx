"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import TitleBar from "~/components/common/titleBar";
import ChargesTab from "~/components/transports/addTransport/forms/chargesForm";
import DocumentsTab from "~/components/transports/addTransport/forms/documentsForm";
import GeneralTab from "~/components/transports/addTransport/forms/generalForm";
import SubmitForm from "~/components/transports/addTransport/forms/submitForm";
import VehiclesTab from "~/components/transports/addTransport/forms/vehiclesForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { AddTransportProvider, useAddTransport } from "./context";

const AddTransport = () => {
  const pathname = usePathname();
  const { setGeneralDetails, activeTab, setActiveTab, transportDetails } =
    useAddTransport();

    const isDriver = transportDetails.general.type === 'Driver'
  useEffect(() => {
    console.log("Add Transport Component");
  }, []);

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="flex flex-col gap-3">
          <div className="flex w-full flex-row justify-between gap-1">
            <TitleBar title="Add Driver" link="toAddTransport" />
            {/* <div>
              <Link href={`${pathname}`}>
                <Button variant="link">Finish Later</Button>
              </Link>
            </div> */}
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
                  inProgress={activeTab === "general"}
                >
                  General
                </TabsTrigger>
                <TabsTrigger
                  value="vehicles"
                  statusLabel="Mandatory"
                  isCompleted={transportDetails.vehicles.length > 0}
                  inProgress={activeTab === "vehicles"}
                  disabled={!transportDetails.general.name}
                >
                  Vehicles
                </TabsTrigger>
                <TabsTrigger
                  value="charges"
                  statusLabel="Mandatory"
                  isCompleted={transportDetails.charges.feePerKm > 0}
                  inProgress={activeTab === "charges"}
                  disabled={transportDetails.vehicles.length === 0}
                >
                  Charges
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  statusLabel="Mandatory"
                  isCompleted={
                    transportDetails.documents.vehicleEmissionTest.length > 1
                  }
                  inProgress={activeTab === "documents"}
                  disabled={
                    transportDetails.charges.accommodationAllowance <= 0 ||
                    transportDetails.charges.feePerKm === 0 ||
                    transportDetails.charges.fuelAllowance <= 0 ||
                    transportDetails.charges.mealAllowance <= 0
                  }
                >
                  Documents
                </TabsTrigger>
                <TabsTrigger
                  value="submit"
                  isCompleted={transportDetails.vehicles.length > 0}
                  inProgress={activeTab === "submit"}
                  disabled={
                    !transportDetails.documents.driverLicense ||
                    !transportDetails.documents.guideLicense
                  }
                >
                  Submit
                </TabsTrigger>
              </TabsList>
              <TabsContent value="general">
                <GeneralTab />
              </TabsContent>

              <TabsContent value="vehicles">
                <VehiclesTab />
              </TabsContent>
              <TabsContent value="charges">
                <ChargesTab />
              </TabsContent>
              <TabsContent value="documents">
                <DocumentsTab isDriver={isDriver}/>
              </TabsContent>
              <TabsContent value="submit">
                <SubmitForm />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function WrappedAddTransport() {
  return (
    <AddTransportProvider>
      <AddTransport />
    </AddTransportProvider>
  );
}
