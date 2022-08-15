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
