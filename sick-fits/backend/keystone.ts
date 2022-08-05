import { createAuth } from '@keystone-next/auth'
import { config, createSchema } from '@keystone-next/keystone/schema'
import { withItemData, statelessSessions } from '@keystone-next/keystone/session'
import { User } from './schemas/User'
import { Product } from './schemas/Product'
import { ProductImage } from './schemas/ProductImage'
import 'dotenv/config' // load local .env file
import { insertSeedData } from './seed-data'

const databaseURL = process.env.DATABASE_URL || 'mongodb://localhost/keystone-sick-fits-tutorial'

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360, // how long they should stay signed in
  secret: process.env.COOKIE_SECRET,
}

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
    // todo: add in initial roles here
  },
})

export default withAuth(
  config({
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL],
        credentials: true,
      },
    },
    db: {
      adapter: 'mongoose',
      url: databaseURL,
      // todo: add data seeding here
      async onConnect(keystone) {
        if (process.argv.includes('--seed-data')) {
          await insertSeedData(keystone)
        }
      },
    },
    lists: createSchema({
      // Schema items go here
      User,
      Product,
      ProductImage,
    }),
    ui: {
      // Show the UI only for people who pass this test
      isAccessAllowed: ({ session }) => !!session?.data,
    },
    session: withItemData(statelessSessions(sessionConfig), {
      // GraphQL query
      User: 'id name email',
    }),
  })
)
