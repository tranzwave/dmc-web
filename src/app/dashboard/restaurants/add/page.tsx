'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import TitleBar from '~/components/common/titleBar';
import GeneralTab from '~/components/restaurants/addRestaurant/forms/generalForm';
import MealsOfferedTab from '~/components/restaurants/addRestaurant/forms/mealsOfferedForm';
import SubmitForm from '~/components/restaurants/addRestaurant/forms/submitForm';
import { Button } from '~/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { AddRestaurantProvider, useAddRestaurant } from './context';


const AddRestaurant = () => {
  const pathname = usePathname();
  const { setGeneralDetails } = useAddRestaurant();

  useEffect(() => {
    console.log('Add Restaurant Component');
  }, []);

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="flex flex-col gap-3">
          <div className="flex flex-row gap-1 w-full justify-between">
            <TitleBar title="Add Restaurant" link="toAddRestaurant" />
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
                <TabsTrigger value="mealsOffered" statusLabel="Mandatory">Meals Offered</TabsTrigger>
                <TabsTrigger value="submit">Submit</TabsTrigger>
              </TabsList>
              <TabsContent value="general">
                <GeneralTab/>
              </TabsContent>
              <TabsContent value="mealsOffered">
                <MealsOfferedTab/>
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
    <AddRestaurantProvider>
      <AddRestaurant />
    </AddRestaurantProvider>
  );
}
