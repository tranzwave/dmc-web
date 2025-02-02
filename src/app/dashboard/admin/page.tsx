"use client"
import { useOrganization } from '@clerk/nextjs';
import { useEffect } from 'react';
import LoadingLayout from '~/components/common/dashboardLoading';
import { OrganizationRolesAndPermissions } from '~/components/organization/managePermissions'
import BankDetailsForm from '~/components/settings/payment'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'

export default function AdminDashboard(params: { searchParams: { search?: string } }) {
  const {organization, isLoaded} = useOrganization();

  useEffect(() => {
    console.log('Organization:', organization);
  }
  , [organization]);
  if (!isLoaded) {
    return <LoadingLayout />
  }

  return (
    <div className='w-full h-full'>
      <Tabs defaultValue={'rolesAndPermissions'} className='w-full h-[97%] pb-4'>
        <TabsList className='flex w-full justify-evenly'>
          <TabsTrigger value='rolesAndPermissions'>Roles and Permissions</TabsTrigger>
          <TabsTrigger value='payment'>Bank Details</TabsTrigger>
          {/* <TabsTrigger value='settings'>Settings</TabsTrigger> */}
        </TabsList>
        <TabsContent value='rolesAndPermissions'>
          <OrganizationRolesAndPermissions />
        </TabsContent>
        <TabsContent value='payment'>
          {organization && <BankDetailsForm organization={organization}/>}
        </TabsContent>
      </Tabs>
    </div>
    // <>
    // <OrganizationRolesAndPermissions/>
    // </>
  )
}