'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import TitleBar from '~/components/common/titleBar';
import GeneralTab from '~/components/restaurants/editRestaurant/forms/generalForm';
import SubmitForm from '~/components/restaurants/editRestaurant/forms/submitForm';
import { Button } from '~/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { EditRestaurantProvider, useEditRestaurant } from './context';


const EditRestaurant = () => {
  const pathname = usePathname();
  const { setGeneralDetails } = useEditRestaurant();

  useEffect(() => {
    console.log('Edit Restaurant Component');
  }, []);

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="flex flex-col gap-3">
          <div className="flex flex-row gap-1 w-full justify-between">
            <TitleBar title="Edit Restaurant" link="toEditRestaurant" />
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

export default function WrappedEditActivity() {
  return (
    <EditRestaurantProvider>
      <EditRestaurant />
    </EditRestaurantProvider>
  );
}
