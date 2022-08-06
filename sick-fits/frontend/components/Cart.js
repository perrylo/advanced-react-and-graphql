import PropTypes from 'prop-types'
import styled from 'styled-components'
import calcTotalPrice from '../lib/calcTotalPrice'
import formatMoney from '../lib/formatMoney'
import CartStyles from './styles/CartStyles'
import Supreme from './styles/Supreme'
import { useUser } from './User'

const CartItemStyles = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid var(--lightGrey);
  display: grid;
  grid-template-columns: auto 1fr auto;
  img {
    margin-right: 1rem;
  }
  h3,
  p {
    margin: 0;
  }
`

function CartItem({ cartItem }) {
  const { product } = cartItem
  if (!product) return null

  return (
    <CartItemStyles>
      {product.photo && <img width="100" src={product.photo.image.publicUrlTransformed} alt={product.name} />}
      <div>
        <h3>{product.name}</h3>
        <p>
          {formatMoney(product.price * cartItem.quantity)} &nbsp; - &nbsp;
          <em>
            {cartItem.quantity} &times; {formatMoney(product.price)} each
          </em>
        </p>
      </div>
    </CartItemStyles>
  )
}

export default function Cart() {
  const me = useUser()

  if (!me) return null // don't render cart if there is no logged in user

  // console.log(me)

  return (
    <CartStyles open>
      <header>
        <Supreme>{me.name}'s Cart</Supreme>
      </header>
      <ul>
        {me.cart.map((cartItem) => (
          <CartItem key={cartItem.id} cartItem={cartItem} />
        ))}
      </ul>
      <footer>
        <p>{formatMoney(calcTotalPrice(me.cart))}</p>
      </footer>
    </CartStyles>
  )
}

CartItem.propTypes = {
  cartItem: PropTypes.shape({
    id: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    product: {
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      id: PropTypes.string.isRequired,
      photo: PropTypes.shape({
        image: PropTypes.shape({
          publicUrlTransformed: PropTypes.string,
        }),
      }),
      price: PropTypes.number.isRequired,
    },
  }),
}