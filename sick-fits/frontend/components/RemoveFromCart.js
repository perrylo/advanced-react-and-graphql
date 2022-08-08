import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import styled from 'styled-components'
import { CURRENT_USER_QUERY } from './User'

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: var(--red);
    cursor: pointer;
  }
`

const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($cartItemId: ID!) {
    deleteCartItem(id: $cartItemId) {
      id
    }
  }
`

function update(cache, payload) {
  cache.evict(cache.identify(payload.data.deleteCartItem))
}

export default function RemoveFromCart({ cartItemId }) {
  const [removeFromCart, { loading }] = useMutation(REMOVE_FROM_CART_MUTATION, {
    variables: { cartItemId },

    // We could do refetchQueries to update cart, but there is a faster way...
    // refetchQueries: [{ query: CURRENT_USER_QUERY }],

    // The faster way is to just update Apollo in-mem cache
    update,

    // Optimistic Response - when we're pretty confident about how the server will respond
    // so we just act ahead of time instead of waiting for server...  So here the update function
    // above will immediately run with the optimisticResponse data below (as we're sure server will give us this)
    // Note: when server does respond it will try to run update again, but nothing will happen since action
    // was already completed
    // AS OF LATEST VIDEO THIS DOESN'T WORK...
    /*
    optimisticResponse: {
      deleteCartItem: {
        __typename: 'CartItem',
        id: cartItemId,
      },
    },
    */
  })

  return (
    <BigButton title="Remove from cart" aria-disabled={loading} type="button" onClick={removeFromCart}>
      &times;
    </BigButton>
  )
}

RemoveFromCart.propTypes = {
  cartItemId: PropTypes.string.isRequired,
}
