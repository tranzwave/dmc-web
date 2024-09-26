import { auth } from '@clerk/nextjs/server'
import { Permissions, Roles } from '../types/global'

export const checkRole = async (role: Roles) => {
  const { sessionClaims } = await auth()

  return sessionClaims?.metadata.role === role
}

export const checkPermission = async (requiredPermissions: Permissions[]) => {
  const { sessionClaims } = await auth()

  const userPermissions = sessionClaims?.metadata.permissions || []

  return requiredPermissions.some(permission => userPermissions.includes(permission))
}
