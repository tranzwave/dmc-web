'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import GeneralTab from '~/components/activities/addActivity/forms/generalForm';
import TitleBar from '~/components/common/titleBar';
import { Button } from '~/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { AddActivityProvider, useAddActivity } from './context';

const SubmitForm = () => {
  const { activityDetails } = useAddActivity();

  const handleSubmit = () => {
    // Handle the submission of activityDetails
    console.log('Submitting activity details:', activityDetails);
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

const AddActivity = () => {
  const pathname = usePathname();
  const { setGeneralDetails } = useAddActivity();

  useEffect(() => {
    console.log('Add Activity Component');
  }, []);

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="flex flex-col gap-3">
          <div className="flex flex-row gap-1 w-full justify-between">
            <TitleBar title="Add Activity" link="toAddActivity" />
            <div>
              <Link href={`${pathname}`}>
                <Button variant="link">Finish Later</Button>
              </Link>
            </div>
          </div>
          <div className='w-full'>
            <Tabs defaultValue="general" className="w-full border">
              <TabsList className='flex justify-evenly w-full'>
                <TabsTrigger value="general" statusLabel="Mandastory">General</TabsTrigger>
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

export default function WrappedAddActivity() {
  return (
    <AddActivityProvider>
      <AddActivity />
    </AddActivityProvider>
  );
}
