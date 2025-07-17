"use client";
import dynamic from 'next/dynamic';

// Dynamically load the components that may cause SSR issues
const GeneralTab = dynamic(() => import('~/components/bookings/addBooking/forms/generalForm'), { ssr: false });
const HotelsTab = dynamic(() => import('~/components/bookings/addBooking/forms/hotelsForm'), { ssr: false });
const RestaurantsTab = dynamic(() => import('~/components/bookings/addBooking/forms/restaurantsForm'), { ssr: false });
const ActivitiesTab = dynamic(() => import('~/components/bookings/addBooking/forms/activitiesForm'), { ssr: false });
const TransportTab = dynamic(() => import('~/components/bookings/addBooking/forms/transportForm'), { ssr: false });
const ShopsTab = dynamic(() => import('~/components/bookings/addBooking/forms/shopsForm'), { ssr: false });
const AddBookingSubmitTab = dynamic(() => import('~/components/bookings/addBooking/forms/submitForm'), { ssr: false });



import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import TitleBar from "~/components/common/titleBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { AddBookingProvider, useAddBooking } from "./context";
import { PartialClerkUser } from '~/lib/types/marketingTeam';
import { getAllClerkUsersByOrgId } from '~/server/auth';
import { useOrganization, useUser } from '@clerk/nextjs';
import LoadingLayout from '~/components/common/dashboardLoading';
import { SelectMarketingTeam } from '~/server/db/schemaTypes';
import { getAllMarketingTeams } from '~/server/db/queries/marketingTeams';
import { ClerkUserPublicMetadata } from '~/lib/types/payment';

const AddBooking = () => {
  const pathname = usePathname();
  const {
    setGeneralDetails,
    addHotelVoucher,
    addRestaurantVoucher: addRestaurant,
    addActivity,
    addTransport,
    addShop,
    activeTab,
    setActiveTab,
    bookingDetails,
    statusLabels,
  } = useAddBooking();

  const [allUsers, setAllUsers] = useState<PartialClerkUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const {organization, isLoaded } = useOrganization();
  const [marketingTeams, setMarketingTeams] = useState<SelectMarketingTeam[]>([]);
  const { user, isLoaded: isUserLoaded } = useUser();

  useEffect(() => {
    const fetchAllUsers = async () => {
      setLoading(true);
      try {
        // Fetch all users
        if(!organization){
          return
        }
        const users = await getAllClerkUsersByOrgId(organization.id);
        setAllUsers(users);
        const marketingTeamsResponse = await getAllMarketingTeams(organization.id);
        setMarketingTeams(marketingTeamsResponse);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    }
    console.log("Add Booking Component");
    fetchAllUsers();
  }, []);

  if (!isLoaded || loading || !isUserLoaded || !user || !organization) {
    return <div><LoadingLayout/></div>
  }

  const usersTeams = (user?.publicMetadata as ClerkUserPublicMetadata)?.teams.filter(team => team.orgId == organization.id);

  if(!usersTeams || usersTeams.length == 0){
    return (
      <div className='flex flex-col justify-center items-center'> 
        <h1>You are not a part of any marketing team</h1>
        <h2>Please contact your admin to add you to a team</h2>
      </div>
    )
  }

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="flex flex-col gap-3">
          <div className="flex w-full flex-row justify-between gap-1">
            <TitleBar title="Add Booking" link="toAddBooking" />
            {/* <div>
              <Link href={`${pathname}`}>
                <Button variant="link">Finish Later</Button>
              </Link>
            </div> */}
          </div>
          <div className="w-full">
            <Tabs
              defaultValue="general"
              className="w-full"
              value={activeTab}
            >
              <TabsList className="flex w-full justify-evenly">
                <TabsTrigger
                  value="general"
                  onClick={() => setActiveTab("general")}
                  isCompleted = {false}
                  inProgress = {activeTab == "general"}
                >
                  General
                </TabsTrigger>
                
              </TabsList>
              <TabsContent value="general">
                <GeneralTab allUsers={allUsers} marketingTeams={marketingTeams}/>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function WrappedAddBooking() {
  return (
    <AddBookingProvider>
      <AddBooking />
    </AddBookingProvider>
  );
}
