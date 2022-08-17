// At it's simplest, access control returns a yes/no value depending on the user's session

import { ListAccessArgs } from './types'
import { permissionsList } from './schemas/fields'

// All these functions are given Context as first argument

export function isSignedIn({ session }: ListAccessArgs) {
  return !!session
  // ie if user is not logged in then there is no session
}

const generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function ({ session }: ListAccessArgs) {
      return !!session?.data.role?.[permission]
    },
  ])
)

// Permissions check if someone meets a critera
export const permissions = {
  ...generatedPermissions,
}

// Rule based functions
// Rules can return a boolean or a filter which limites which products they can CRUD
export const rules = {
  canManageProducts({ session }: ListAccessArgs) {
    // Check if user is signed in before doing any DB queries to prevent internal server error - vid 67 end
    if (!isSignedIn({ session })) {
      return false
    }

    // 1 do they have the permission of canManageProducts
    if (permissions.canManageProducts({ session })) {
      return true
    }

    // 2 If not, do they own this item?
    return { user: { id: session.itemId } }
  },
  canReadProducts({ session }: ListAccessArgs) {
    // Check if user is signed in before doing any DB queries to prevent internal server error - vid 67 end
    if (!isSignedIn({ session })) {
      return false
    }

    if (permissions.canManageProducts({ session })) {
      return true // They can read everything
    }

    // They should only see available products (based on status field)
    return { status: 'AVAILABLE' }
  },
  canOrder({ session }: ListAccessArgs) {
    // Check if user is signed in before doing any DB queries to prevent internal server error - vid 67 end
    if (!isSignedIn({ session })) {
      return false
    }

    // 1 do they have the permission of canManageProducts
    if (permissions.canManageCart({ session })) {
      return true
    }

    // 2 If not, do they own this item?
    return { user: { id: session.itemId } }
  },
  canManageOrderItems({ session }: ListAccessArgs) {
    // Check if user is signed in before doing any DB queries to prevent internal server error - vid 67 end
    if (!isSignedIn({ session })) {
      return false
    }

    // 1 do they have the permission of canManageProducts
    if (permissions.canManageCart({ session })) {
      return true
    }

    // 2 If not, do they own this item?
    return { order: { user: { id: session.itemId } } }
  },
  canManageUsers({ session }: ListAccessArgs) {
    // Check if user is signed in before doing any DB queries to prevent internal server error - vid 67 end
    if (!isSignedIn({ session })) {
      return false
    }

    // 1 do they have the permission of canManageProducts
    if (permissions.canManageUsers({ session })) {
      return true
    }

    // 2 Otherwise they may only update themselves!
    return { id: session.itemId }
  },
}
