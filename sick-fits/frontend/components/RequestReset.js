import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import Form from './styles/Form'
import useForm from '../lib/useForm'
import DisplayError from './ErrorMessage'

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    sendUserPasswordResetLink(email: $email) {
      code
      message
    }
  }
`

export default function RequestReset() {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
  })

  const [signup, { data, loading, error }] = useMutation(REQUEST_RESET_MUTATION, {
    variables: inputs,
  })

  /* const error =
    data?.authenticateUserWithPassword.__typename === 'UserAuthenticationWithPasswordFailure'
      ? data?.authenticateUserWithPassword
      : undefined */

  async function handleSubmit(e) {
    e.preventDefault() // stop form from submitting

    await signup().catch(console.error)
    resetForm()

    // Send the email and password to the graplhqlAPI
  }

  if (data?.createUser) {
    return <p>Signed up with {data.createUser.email} - Please go ahead and Sign In!</p>
  }

  return (
    <Form method="post" onSubmit={handleSubmit}>
      <h2>Request password reset</h2>

      <DisplayError error={error} />

      <fieldset>
        {data?.sendUserPasswordResetLink === null && <p>Success! Check your email for a link!</p>}

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
        <button type="submit">Request Reset</button>
      </fieldset>
    </Form>
  )
}
