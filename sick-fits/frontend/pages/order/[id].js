import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { PropTypes } from 'prop-types'
import Head from 'next/head'
import formatMoney from '../../lib/formatMoney'
import DisplayError from '../../components/ErrorMessage'
import OrderStyles from '../../components/styles/OrderStyles'

export const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY($id: ID!) {
    order: Order(where: { id: $id }) {
      id
      total
      charge
      user {
        id
      }
      items {
        id
        name
        description
        photo {
          image {
            publicUrlTransformed
          }
        }
        price
        quantity
      }
    }
  }
`

export default function SingleOrderPage({ query }) {
  const { data, loading, error } = useQuery(SINGLE_ORDER_QUERY, {
    variables: { id: query.id },
  })

  if (loading) return <p>loading...</p>

  if (error) return <DisplayError error={error} />

  const { order } = data
  const { id: orderId, total, charge, items } = order

  return (
    <OrderStyles>
      <Head>
        <title>Sick Fits - {orderId}</title>
      </Head>
      <p>
        <span>Order Id:</span>
        <span>{orderId}</span>
      </p>
      <p>
        <span>Charge:</span>
        <span>{charge}</span>
      </p>
      <p>
        <span>Order Total:</span>
        <span>{formatMoney(total)}</span>
      </p>
      <p>
        <span>Item Count:</span>
        <span>{items.length}</span>
      </p>
      <div className="items">
        {items.map((item) => (
          <div className="order-item" key={item.id}>
            <img src={item.photo.image.publicUrlTransformed} alt={item.title} />
            <div className="item-details">
              <h2>{item.name}</h2>
              <p>Qty: {item.quantity}</p>
              <p>Each: {formatMoney(item.price)}</p>
              <p>Subtotal: {formatMoney(item.price * item.quantity)}</p>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </OrderStyles>
  )
}

SingleOrderPage.propTypes = {
  query: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
}
