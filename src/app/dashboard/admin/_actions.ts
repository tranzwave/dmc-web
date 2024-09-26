'use server'

import { clerkClient } from '@clerk/nextjs/server'
import { checkRole } from '~/lib/utils/roles'


export async function getUserById(userId: string) {
  // Check if the current user has the appropriate role to access this function
  if (!checkRole('admin')) {
    return { message: 'Not Authorized' }
  }

  try {
    // Use Clerk's client to fetch user details by user ID
    const user = await clerkClient().users.getUser(userId)
    console.log(user)
    return { message: 'User fetched successfully', user }
  } catch (err) {
    return { message: `Error fetching user: ${err}` }
  }
}

export async function setRole(formData: FormData) {

  if (!checkRole('admin')) {
    return { message: 'Not Authorized' }
  }

  try {
    const res = await clerkClient().users.updateUser(formData.get('id') as string, {
      publicMetadata: { role: formData.get('role') },
    })
    return { message: res.publicMetadata }
  } catch (err) {
    return { message: err }
  }
}


export async function updatePermissions(userId: string, permissions: string[]) {
    const isAdmin = await checkRole('admin')
  
    if (!isAdmin) {
      return { message: 'Not Authorized' }
    }
  
    try {
      const res = await clerkClient.users.updateUser(userId, {
        publicMetadata: { permissions },
      })
  
      return { message: 'Permissions updated successfully', permissions: res.publicMetadata.permissions }
    } catch (err) {
      return { message: err }
    }
  }