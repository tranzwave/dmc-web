
import { redirect } from 'next/navigation'
import { SearchUsers } from './_search-users'
import { clerkClient } from '@clerk/nextjs/server'
import { setRole } from './_actions'
import { checkRole } from '~/lib/utils/roles'
import { Permissions } from '~/lib/types/global'
import { OrganizationRolesAndPermissions } from '~/components/organization/managePermissions'
import { OrganizationSwitcher } from '@clerk/nextjs'

export default async function AdminDashboard(params: { searchParams: { search?: string } }) {
  if (!checkRole('admin')) {
    alert("Not aut")
    redirect('/dashboard/overview')
  }



  return (
    <>
    <OrganizationRolesAndPermissions/>
      {/* <h1>This is the admin dashboard</h1>
      <p>This page is restricted to users with the 'admin' role.</p>

      <SearchUsers /> */}

      {/* {users.map((user) => {
        return (
          <div key={user.id}>
            <div>
              {user.firstName} {user.lastName}
            </div>
            <div>
              {
                user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)
                  ?.emailAddress
              }
            </div>
            <div>{user.publicMetadata.role as string}</div>
            <div>{user.publicMetadata?.permissions as string[]}</div>
            <div>
              <form action={setRole}>
                <input type="hidden" value={user.id} name="id" />
                <input type="hidden" value="admin" name="role" />
                <button type="submit">Make Admin</button>
              </form>
            </div>
            <div>
              <form action={setRole}>
                <input type="hidden" value={user.id} name="id" />
                <input type="hidden" value="moderator" name="role" />
                <button type="submit">Make Moderator</button>
              </form>
            </div>
          </div>
        )
      })} */}
    </>
  )
}