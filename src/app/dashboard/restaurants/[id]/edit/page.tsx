'use client'
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import TitleBar from '~/components/common/titleBar';
import GeneralTab from '~/components/restaurants/editRestaurant/forms/generalForm';
import SubmitForm from '~/components/restaurants/editRestaurant/forms/submitForm';
import { Button } from '~/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { getRestaurantVendorById } from '~/server/db/queries/restaurants';
import { RestaurantData } from '../../page';
import { EditRestaurantProvider, useEditRestaurant } from './context';


const EditRestaurant = ({ params }: { params: { id: string } }) => {
  const pathname = usePathname();
  const { setGeneralDetails } = useEditRestaurant();
  const [restaurant, setRestaurant] = useState<RestaurantData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    console.log('Edit Restaurant Component');
  }, []);

  useEffect(() => {
    async function fetchVendorData() {
      try {
        setLoading(true);
        const result = await getRestaurantVendorById(params.id);
        setRestaurant(result ?? null);
      } catch (error) {
        console.error("Failed to fetch activity data:", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    }

    fetchVendorData();
  }, []);
  console.log(restaurant)

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
  const { id } = useParams(); // Retrieve the ID from the URL params if you're using dynamic routing

  return (
    <EditRestaurantProvider>
      <EditRestaurant params={{ id: id as string }} />
    </EditRestaurantProvider>
  );
}
