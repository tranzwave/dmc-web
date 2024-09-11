'use client'
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import TitleBar from '~/components/common/titleBar';
import { Button } from '~/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Driver } from '~/lib/api';
import { getDriverDataById } from '~/server/db/queries/transport';
import { SelectCity, SelectDriver, SelectDriverLanguage, SelectDriverVehicle, SelectLanguage, SelectVehicle } from '~/server/db/schemaTypes';
import { AddTransportProvider, useAddTransport } from '../../add/context';
import LoadingLayout from '~/components/common/dashboardLoading';
import VehiclesTab from '~/components/transports/addTransport/forms/vehiclesForm';
import ChargesTab from '~/components/transports/addTransport/forms/chargesForm';
import DocumentsTab from "~/components/transports/addTransport/forms/documentsForm";
import GeneralTab from '~/components/transports/addTransport/forms/generalForm';
import SubmitForm from '~/components/transports/addTransport/forms/submitForm';
import EditTransportSubmitForm from '~/components/transports/addTransport/forms/submitForm/editTransportSubmit';

export type DriverData = SelectDriver & {
  city:SelectCity;
  vehicles: (SelectDriverVehicle & {
    vehicle: SelectVehicle;
  })[];
  languages: (SelectDriverLanguage & {
    language: SelectLanguage;
  })[];
};

// const SubmitForm = () => {
//   const { transportDetails } = useAddTransport();

//   const handleSubmit = () => {
//     // Handle the submission of activityDetails
//     console.log('Submitting booking details:', transportDetails);
//   };

//   return (
//     <div className='flex flex-col gap-3'>
//       <div className='card w-full h-10'>
//         <p>Review all the details and submit your activity.</p>
//       </div>
//       <div className='flex w-full justify-center'>
//         <Button variant="primaryGreen" onClick={handleSubmit}>
//           Submit
//         </Button>
//       </div>

//     </div>
//   );
// };

const EditTransport = ({ id }: { id: string }) => {
  const pathname = usePathname();
  const [transport, setTransport] = useState<Driver | null>(null);
  const { setGeneralDetails,addVehicles,setChargesDetails,setDocumetsDetails,transportDetails,setActiveTab,activeTab } = useAddTransport();
  const [data, setData] = useState<Driver[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null)
  const [driverData, setDriverData] = useState<DriverData>()

  useEffect(() => {
    async function fetchDriverDetails() {
      try {
        setLoading(true);
        const selectedDriver = await getDriverDataById(id);
        if(!selectedDriver){
          throw new Error("Couldn't find driver")

        }

        setDriverData(selectedDriver);
        setGeneralDetails({
          name:selectedDriver.name,
          city:selectedDriver.cityId.toString(),
          guide:selectedDriver.isGuide,
          includes:{
            charges:true,
            documents:true,
            vehicles:true
          },
          language:selectedDriver.languages[0]?.language.id.toString() ?? "",
          primaryContactNumber:selectedDriver.primaryContactNumber,
          primaryEmail:selectedDriver.primaryEmail,
          province:selectedDriver.province,
          streetName:selectedDriver.streetName
        })
        
        selectedDriver.vehicles.forEach(v => {
          addVehicles({
            vehicle:v.vehicle.vehicleType,
            make:v.vehicle.make,
            model:v.vehicle.model,
            numberPlate:v.vehicle.numberPlate,
            seats:v.vehicle.seats,
            vrl:v.vehicle.revenueLicense,
            year:v.vehicle.year.toString()
          })})

        setChargesDetails({
          accommodationAllowance:selectedDriver.accommodationAllowance,
          feePerKm:selectedDriver.feePerKM,
          fuelAllowance:selectedDriver.fuelAllowance,
          mealAllowance:selectedDriver.mealAllowance
        })

        setDocumetsDetails({
          driverLicense:selectedDriver.driversLicense,
          guideLicense:selectedDriver.guideLicense ?? "",
          insurance:selectedDriver.insurance,
          vehicleEmissionTest:"N/A"
        })
      
      } catch (error) {
        console.error("Failed to fetch driver details:", error);
        setError("Failed to load driver details.");
      } finally {
        setLoading(false);
      }
    }

    fetchDriverDetails();
  }, [id]);

  if (loading) {
    return <div><LoadingLayout/></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }


  return (
    <div className="flex">
      <div className="flex-1">
        <div className="flex flex-col gap-3">
          <div className="flex w-full flex-row justify-between gap-1">
            <TitleBar title="Add Driver" link="toAddTransport" />
            <div>
              <Link href={`${pathname}`}>
                <Button variant="link">Finish Later</Button>
              </Link>
            </div>
          </div>
          <div className="w-full">
            <Tabs defaultValue="general" className="w-full border" value={activeTab}>
              <TabsList className="flex w-full justify-evenly">
                <TabsTrigger
                  value="general"
                  isCompleted={false}
                  onClick={() => setActiveTab("general")}
                  inProgress={activeTab == "general"}
                >
                  General
                </TabsTrigger>
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
                    transportDetails.documents.vehicleEmissionTest.length > 1
                  }
                  inProgress={activeTab == "documents"}
                  disabled={
                    transportDetails.charges.accommodationAllowance !> 0 ||
                    transportDetails.charges.feePerKm == 0 ||
                    transportDetails.charges.fuelAllowance !> 0 ||
                    transportDetails.charges.mealAllowance !> 0
                  }
                >
                  Documents
                </TabsTrigger>
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
              <TabsContent value="vehicles">
                <VehiclesTab />
              </TabsContent>
              <TabsContent value="charges">
                <ChargesTab />
              </TabsContent>
              <TabsContent value="documents">
                <DocumentsTab />
              </TabsContent>
              <TabsContent value="submit">
                <EditTransportSubmitForm id={id} originalDriverData={driverData ?? null}/>
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
      {id ? <EditTransport id={id as string} /> : <div>No transport ID provided.</div>}

    </AddTransportProvider>
  );
}
