'use client'
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import TitleBar from '~/components/common/titleBar';
import ChargesTab from '~/components/transports/editTransport/forms/chargesForm';
import DocumentsTab from '~/components/transports/editTransport/forms/documentsForm';
import GeneralTab from "~/components/transports/editTransport/forms/generalForm";
import VehiclesTab from '~/components/transports/editTransport/forms/vehiclesForm';
import { Button } from '~/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Driver, getTransportData } from '~/lib/api';
import { EditTransportProvider, useEditTransport } from './context';

const SubmitForm = () => {
  const { transportDetails } = useEditTransport();

  const handleSubmit = () => {
    // Handle the submission of activityDetails
    console.log('Submitting booking details:', transportDetails);
  };

  return (
    <div className='flex flex-col gap-3'>
      <div className='card w-full h-10'>
        <p>Review all the details and submit your activity.</p>
      </div>
      <div className='flex w-full justify-center'>
        <Button variant="primaryGreen" onClick={handleSubmit}>
          Submit
        </Button>
      </div>

    </div>
  );
};

const EditTransport = ({ id }: { id: string }) => {
  const pathname = usePathname();
  const [transport, setTransport] = useState<Driver | null>(null);
  const { setGeneralDetails } = useEditTransport();
  const [data, setData] = useState<Driver[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTransportDetails() {
      try {
        setLoading(true);
        const transports = await getTransportData();
        const selectedTransport = transports.find(
          (transport) => transport.id.toString() === id,
        );
        setTransport(selectedTransport ?? null);
      } catch (error) {
        console.error("Failed to fetch activity details:", error);
        setError("Failed to load activity details.");
      } finally {
        setLoading(false);
      }
    }

    fetchTransportDetails();
  }, [id]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const result = await getTransportData();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch activity data:", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!transport) {
    return <div>No activity found with the given ID.</div>;
  } 

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="flex flex-col gap-3">
          <div className="flex flex-row gap-1 w-full justify-between">
            <TitleBar title={`Edit Driver & Guid ${id}`} link="toEditTransport" />
            <div>
              <Link href={`${pathname}`}>
                <Button variant="link">Finish Later</Button>
              </Link>
            </div>
          </div>
          <div className='w-full'>
            <Tabs defaultValue="general" className="w-full border">
              <TabsList className='flex justify-evenly w-full'>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
                <TabsTrigger value="charges">Charges</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="submit">Submit</TabsTrigger>
              </TabsList>
              <TabsContent value="general">
                {/* <GeneralTab onSetDetails={setGeneralDetails} /> */}
                <GeneralTab/>
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
                <SubmitForm />
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
    <EditTransportProvider>
      {id ? <EditTransport id={id as string} /> : <div>No transport ID provided.</div>}

    </EditTransportProvider>
  );
}
