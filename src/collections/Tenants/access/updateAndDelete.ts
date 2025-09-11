import { isSuperAdmin } from '../../../access/superAdmin'
import { getUserTenantIDs } from '../../../utilities/getUserTenantIDs'
import { Access } from 'payload'

export const updateAndDelete: Access = ({ req }) => {
  if (!req.user) {
    return false
  }

  if (isSuperAdmin(req.user)) {
    return true
  }

  return {
    id: {
      in: getUserTenantIDs(req.user, 'tenant-admin'),
    },
  }
}
