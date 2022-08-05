import { gql, useMutation, useQuery } from '@apollo/client'
import { PropTypes } from 'prop-types'
import useForm from '../lib/useForm'
import DisplayError from './ErrorMessage'
import { SINGLE_ITEM_QUERY } from './SingleProduct'
import Form from './styles/Form'

const UPDATE_PRODUCT_MUTATION = gql`
  mutation UPDATE_PRODUCT_MUTATION($id: ID!, $name: String, $description: String, $price: Int) {
    updateProduct(id: $id, data: { name: $name, description: $description, price: $price }) {
      id
      name
      description
      price
    }
  }
`

export default function UpdateProduct({ id }) {
  // 1 Get existing product
  const { data, error, loading } = useQuery(SINGLE_ITEM_QUERY, {
    variables: {
      id,
    },
  })

  // 2 Get mutation to update product
  const [updateProduct, { data: updateDate, error: updateError, loading: updateLoading }] =
    useMutation(UPDATE_PRODUCT_MUTATION)

  // Hooking up form inputs to state
  // Use our custom useForm general handler to stay DRY
  const { inputs, handleChange, resetForm, clearForm } = useForm(data?.Product)

  if (loading) return <p>Loading...</p>

  // 3 From to handle updates
  return (
    <Form
      onSubmit={async (e) => {
        e.preventDefault()

        const res = updateProduct({
          variables: {
            id,
            name: inputs.name,
            description: inputs.description,
            price: inputs.price,
          },
        })

        /*
        // Submit the input fields to the BE
        // We're not passing arguments as the handler was initialized to use our state
        const res = await createProduct()
        clearForm()

        // Go to that product's page
        Router.push({
          pathname: `/product/${res.data.createProduct.id}`,
        }) */
      }}
    >
      <DisplayError error={error || updateError} />
      {/*
        Can't set disabled on a form to disable an entire for but can set disabled
        on a fieldset to disable all children
      */}
      <fieldset aria-busy={updateLoading} disabled={updateLoading}>
        {/* Use Aria attributes when possible to style, for accessibility and usability at same time */}
        <label htmlFor="name">
          Name
          <input type="text" id="name" name="name" placeholder="name" value={inputs.name} onChange={handleChange} />
        </label>
        <label htmlFor="price">
          Price
          <input
            type="number"
            id="price"
            name="price"
            placeholder="price"
            value={inputs.price}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="description">
          Description
          <textarea
            id="description"
            name="description"
            placeholder="Description"
            value={inputs.description}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Update Product</button>
      </fieldset>
    </Form>
  )
}

UpdateProduct.propTypes = {
  id: PropTypes.string.isRequired,
}
