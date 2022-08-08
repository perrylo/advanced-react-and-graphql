/* eslint-disable */
import { KeystoneContext } from '@keystone-next/types'
import { CartItemCreateInput } from '../.keystone/schema-types'
import { Session } from '../types'

export async function addToCart(
  root: any,
  { productId }: { productId: string },
  context: KeystoneContext
): Promise<CartItemCreateInput> {
  console.log(`Adding ${productId} to cart`)
  // 1 Query current user to see if they are signed in
  const sesh = context.session as Session
  if (!sesh.itemId) {
    throw new Error('You must be logged in to do this!')
  }

  // 2 Query the current user's cart
  const allCartItems = await context.lists.CartItem.findMany({
    where: { user: { id: sesh.itemId }, product: { id: productId } },
    resolveFields: 'id, quantity',
  })

  const [existingCartItem] = allCartItems

  if (existingCartItem) {
    console.log(`There are already ${existingCartItem.quantity}, inc by 1`)

    // 3 See if the current item is in their cart
    // 4 if it is then inc by 1
    return await context.lists.CartItem.updateOne({
      id: existingCartItem.id,
      data: { quantity: existingCartItem.quantity + 1 },
      resolveFields: false,
    })
  }

  // 5 if it isn't then create new cart item
  return await context.lists.CartItem.createOne({
    data: {
      product: { connect: { id: productId } },
      user: { connect: { id: sesh.itemId } },
    },
    resolveFields: false,
  })
}
