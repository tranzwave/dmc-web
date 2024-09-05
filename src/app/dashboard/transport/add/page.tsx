'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import TitleBar from '~/components/common/titleBar';
import ChargesTab from '~/components/transports/addTransport/forms/chargesForm';
import DocumentsTab from '~/components/transports/addTransport/forms/documentsForm';
import GeneralTab from "~/components/transports/addTransport/forms/generalForm";
import SubmitForm from '~/components/transports/addTransport/forms/submitForm';
import VehiclesTab from '~/components/transports/addTransport/forms/vehiclesForm';
import { Button } from '~/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { AddTransportProvider, useAddTransport } from './context';

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

const AddTransport = () => {
  const pathname = usePathname();
  const { setGeneralDetails } = useAddTransport();

  useEffect(() => {
    console.log('Add Transport Component');
  }, []);

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="flex flex-col gap-3">
          <div className="flex flex-row gap-1 w-full justify-between">
            <TitleBar title="Add Driver & Guid" link="toAddTransport" />
            <div>
              <Link href={`${pathname}`}>
                <Button variant="link">Finish Later</Button>
              </Link>
            </div>
          </div>
          <div className='w-full'>
            <Tabs defaultValue="general" className="w-full border">
              <TabsList className='flex justify-evenly w-full'>
                <TabsTrigger value="general" statusLabel="Mandatory">General</TabsTrigger>
                <TabsTrigger value="vehicles" statusLabel="Mandatory">Vehicles</TabsTrigger>
                <TabsTrigger value="charges" statusLabel="Mandatory">Charges</TabsTrigger>
                <TabsTrigger value="documents" statusLabel="Mandatory">Documents</TabsTrigger>
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

export default function WrappedAddTransport() {
  return (
    <AddTransportProvider>
      <AddTransport />
    </AddTransportProvider>
  );
}
