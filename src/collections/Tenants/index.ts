import type { CollectionConfig } from 'payload'

import { superAdmin } from '../../access/superAdmin'
import { updateAndDelete } from './access/updateAndDelete'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  labels: {
    singular: 'Website',
    plural: 'Websites',
  },
  access: {
    create: superAdmin,
    delete: updateAndDelete,
    read: ({ req }) => Boolean(req.user),
    update: updateAndDelete,
  },
  admin: {
    group: 'System',
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'domain',
      type: 'text',
      admin: {
        description: 'Used for domain-based tenant handling',
      },
    },
    {
      name: 'slug',
      type: 'text',
      admin: {
        description: 'Used for url paths, example: /tenant-slug/page-slug',
      },
      index: true,
      required: true,
    },
    {
      name: 'allowPublicRead',
      type: 'checkbox',
      admin: {
        description:
          'If checked, logging in is not required to read. Useful for building public pages.',
        position: 'sidebar',
      },
      defaultValue: false,
      index: true,
    },
  ],
}
