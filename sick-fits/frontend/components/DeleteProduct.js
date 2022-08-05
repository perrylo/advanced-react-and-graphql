import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import DisplayError from './ErrorMessage'

const DELETE_PRODUCT_MUTATION = gql`
  mutation DELETE_PRODUCT_MUTATION($id: ID!) {
    deleteProduct(id: $id) {
      id
      name
    }
  }
`

// Create an 'update' function that gets called (by Apollo) when a mutation is completed
// This is a cleaner viable alternative to forcing the products list page to reload/refresh data
function update(cache, payload) {
  cache.evict(cache.identify(payload.data.deleteProduct))
}

export default function DeleteProduct({ id, children }) {
  const [deleteProduct, { loading }] = useMutation(DELETE_PRODUCT_MUTATION, {
    variables: {
      id,
    },
    update,
  })

  if (loading) return <p>Loading...</p>

  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => {
        if (confirm('Delete item?')) {
          deleteProduct().catch((err) => alert(err.message)) // Alternative way of catching and showing errors
        }
      }}
    >
      {children}
    </button>
  )
}

DeleteProduct.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.any,
}
