import { list } from '@keystone-next/keystone/schema'
import { integer, relationship, select, text, virtual } from '@keystone-next/fields'
import formatMoney from '../lib/formatMoney'

export const Order = list({
  // todo
  // access:
  fields: {
    label: virtual({
      graphQLReturnType: 'String',
      resolver(item) {
        return `Perry is cool ${formatMoney(item.total)}`
      },
    }),
    total: integer(),
    items: relationship({ ref: 'OrderItem.order', many: true }),
    user: relationship({ ref: 'User.orders' }),
    charge: text(),
  },
})
