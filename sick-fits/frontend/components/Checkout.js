import styled from 'styled-components'
import { loadStripe } from '@stripe/stripe-js'
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js'
import { useState } from 'react'
import nProgress from 'nprogress'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import SickButton from './styles/SickButton'

const CheckoutFormStyles = styled.form`
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 5px;
  padding: 1rem;
  display: grid;
  grid-gap: 1rem;
`

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)

const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
    checkout(token: $token) {
      id
      charge
      total
      items {
        id
        name
      }
    }
  }
`

function CheckoutForm() {
  const [error, setError] = useState()
  const [loading, setLoading] = useState()
  const stripe = useStripe()
  const elements = useElements()
  const [checkout, { error: graphQLError }] = useMutation(CREATE_ORDER_MUTATION)

  async function handleSubmit(e) {
    // 1 stop form from submitting and turn loader on
    e.preventDefault()
    setLoading(true)

    console.log('checkout')

    // 2 start page transition
    nProgress.start()

    // 3 create payment method via stripe
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    })
    console.log(paymentMethod, error)

    // 4 handle any errors from stripe
    if (error) {
      setError(error)
      nProgress.done()
      return // stops checkout from happening
    }

    // 5 send token from #3 (if no errors) to keystone via custom mutation
    const order = await checkout({
      variables: {
        token: paymentMethod.id,
      },
    })
    console.log('Finished with the order', order)

    // 6 change page to view the order
    // 7 close the cart

    // 8 turn the loader off
    setLoading(false)
    nProgress.done()
  }

  return (
    <CheckoutFormStyles onSubmit={handleSubmit}>
      {error && <p style={{ fontSize: 12 }}>{error.message}</p>}
      {graphQLError && <p style={{ fontSize: 12 }}>{graphQLError.message}</p>}
      <CardElement />
      <SickButton>Check Out Now</SickButton>
    </CheckoutFormStyles>
  )
}

// We have a special default export here so that the stripe prop is available
// before it is used in the CheckoutForm, ie the Provider is at a higher level than where it is used
export default function Checkout() {
  return (
    <Elements stripe={stripeLib}>
      <CheckoutForm />
    </Elements>
  )
}
