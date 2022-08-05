import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import Router from 'next/router'
import useForm from '../lib/useForm'
import Form from './styles/Form'
import DisplayError from './ErrorMessage'
import { ALL_PRODUCTS_QUERY } from './Products'

// REMEMBER - BELOW STRING IS GRAPHQL NOTATION, NOT JS!!!
// with this tagged template literal can just copy and paste from GraphQL inteface tool to here
const CREATE_PRODUCT_MUTATION = gql`
  mutation CREATE_PRODUCT_MUTATION(
    # Which variables are getting passed in?  And what types are they? (just like a function)
    $name: String!
    $description: String!
    $price: Int!
    $image: Upload
  ) {
    # photo or productImage is its own type, in Keystone we can do a nested-create to
    # create a productImage at the same time as the product
    createProduct(
      data: {
        name: $name
        description: $description
        price: $price
        status: "AVAILABLE"
        photo: { create: { image: $image, altText: $name } }
      }
    ) {
      # only really need id as we plan for forward user to product page on success
      id
      price
      description
      name
    }
  }
`

export default function CreateProduct() {
  // Hooking up form inputs to state
  // Use our custom useForm general handler to stay DRY
  const { inputs, handleChange, resetForm, clearForm } = useForm({
    name: 'Nice shoes',
    price: 1234,
    description: 'best shoes',
    image: '',
  })

  // useMutation is a hook from Apollo client
  // @ return [ function, obj ]
  const [createProduct, { loading, error, data }] = useMutation(CREATE_PRODUCT_MUTATION, {
    variables: inputs,
    refetchQueries: [{ query: ALL_PRODUCTS_QUERY }], // As part of this request, refetch all product data when done, so that product list page remains up to date
  })

  return (
    <Form
      onSubmit={async (e) => {
        e.preventDefault()

        // Submit the input fields to the BE
        // We're not passing arguments as the handler was initialized to use our state
        const res = await createProduct()
        clearForm()

        // Go to that product's page
        Router.push({
          pathname: `/product/${res.data.createProduct.id}`,
        })
      }}
    >
      <DisplayError error={error} />
      {/*
        Can't set disabled on a form to disable an entire for but can set disabled
        on a fieldset to disable all children
      */}
      <fieldset aria-busy={loading} disabled={loading}>
        {/* Use Aria attributes when possible to style, for accessibility and usability at same time */}
        <label htmlFor="image">
          Image
          <input type="file" id="image" name="image" onChange={handleChange} required />
        </label>
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
        <button type="submit">+ Add Product</button>
      </fieldset>

      {/* Just for dev testing useForm exports
      <button onClick={clearForm} type="button">
        Clear Form
      </button>
      <button onClick={resetForm} type="button">
        Reset Form
      </button>
      */}
    </Form>
  )
}
