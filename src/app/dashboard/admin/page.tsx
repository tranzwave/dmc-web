
import { redirect } from 'next/navigation'
import { SearchUsers } from './_search-users'
import { clerkClient } from '@clerk/nextjs/server'
import { setRole } from './_actions'
import { checkRole } from '~/lib/utils/roles'
import { Permissions } from '~/lib/types/global'
import { OrganizationRolesAndPermissions } from '~/components/organization/managePermissions'
import { OrganizationSwitcher } from '@clerk/nextjs'
import { toast } from '~/hooks/use-toast'

export default async function AdminDashboard(params: { searchParams: { search?: string } }) {
  // if (!checkRole('admin')) {
  //   console.log('You are not authenticated')
  //   //Toast
  //   const targetUrl = '/dashboard/overview?unauthenticated=true';
  //   redirect(targetUrl);
  // }



  return (
    <>
    <OrganizationRolesAndPermissions/>
    </>
  )
}