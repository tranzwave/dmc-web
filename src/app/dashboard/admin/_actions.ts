'use server'

import { clerkClient } from '@clerk/nextjs/server'
import { checkRole } from '~/lib/utils/roles'

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