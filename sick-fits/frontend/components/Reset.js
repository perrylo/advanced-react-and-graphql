import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import Form from './styles/Form'
import useForm from '../lib/useForm'
import DisplayError from './ErrorMessage'

const RESET_MUTATION = gql`
  mutation RESET_MUTATION($email: String!, $token: String!, $password: String!) {
    redeemUserPasswordResetToken(email: $email, token: $token, password: $password) {
      code
      message
    }
  }
`

export default function Reset({ token }) {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    password: '',
    token,
  })

  const [reset, { data, error }] = useMutation(RESET_MUTATION, {
    variables: inputs,
  })
  const successfulError = data?.redeemUserPasswordResetToken?.code ? data?.redeemUserPasswordResetToken : undefined

  async function handleSubmit(e) {
    e.preventDefault() // stop form from submitting

    await reset().catch(console.error)
    resetForm()

    // Send the email and password to the graplhqlAPI
  }

  if (data?.createUser) {
    return <p>Signed up with {data.createUser.email} - Please go ahead and Sign In!</p>
  }

  return (
    <Form method="post" onSubmit={handleSubmit}>
      <h2>Reset your password</h2>

      <DisplayError error={error || successfulError} />

      <fieldset>
        {data?.redeemUserPasswordResetToken === null && <p>Success! You can now sign in!</p>}

        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            placeholder="Your Email Address"
            autoComplete="email"
            value={inputs.email}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="password"
            value={inputs.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Request Reset</button>
      </fieldset>
    </Form>
  )
}

Reset.propTypes = {
  token: PropTypes.string.isRequired,
}
