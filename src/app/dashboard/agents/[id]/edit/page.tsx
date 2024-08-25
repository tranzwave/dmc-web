'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import GeneralTab from '~/components/agents/editAgent/forms/generalForm';
import TitleBar from '~/components/common/titleBar';
import { Button } from '~/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { EditAgentProvider, useEditAgent } from './context';

const SubmitForm = () => {
  const { agentDetails: agentDetails } = useEditAgent();

  const handleSubmit = () => {
    // Handle the submission of agentDetails
    console.log('Submitting agent details:', agentDetails);
  };

  return (
    <div className='flex flex-col gap-3'>
      <div className='card w-full h-10'>
        <p>Review all the details and submit your agent.</p>
      </div>
      <div className='flex w-full justify-center'>
        <Button variant="primaryGreen" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
};

const EditAgent = () => {
  const pathname = usePathname();
  const { setGeneralDetails } = useEditAgent();

  useEffect(() => {
    console.log('Edit Agent Component');
  }, []);

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="flex flex-col gap-3">
          <div className="flex flex-row gap-1 w-full justify-between">
            <TitleBar title="Edit Agent" link="toEditAgent" />
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
                <TabsTrigger value="submit">Submit</TabsTrigger>
              </TabsList>
              <TabsContent value="general">
                {/* <GeneralTab onSetDetails={setGeneralDetails} /> */}
                <GeneralTab/>
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

export default function WrappedAddAgent() {
  return (
    <EditAgentProvider>
      <EditAgent />
    </EditAgentProvider>
  );
}
