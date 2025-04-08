import { auth } from '@clerk/nextjs/server'
import { Permissions, Roles } from '../types/global'

export const checkRole = (role: Roles) => {
  const { sessionClaims } = auth() // Removed `await`
  return sessionClaims?.metadata.role === role
}

export const checkPermission = (requiredPermissions: Permissions[]) => {
  const { sessionClaims } = auth() // Removed `await`
  const userPermissions = sessionClaims?.metadata.permissions ?? [] // Changed `||` to `??`
  return requiredPermissions.some(permission => 
    (userPermissions as Permissions[]).includes(permission)
  )
}
