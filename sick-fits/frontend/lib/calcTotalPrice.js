export default function calcTotalPrice(cart) {
  return cart.reduce((tally, cartItem) => {
    // Edge case: Products can be deleted but could remain in card
    if (!cartItem.product) return tally

    return tally + cartItem.quantity * cartItem.product.price
  }, 0)
}
