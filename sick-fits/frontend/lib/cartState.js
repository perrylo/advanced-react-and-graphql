import PropTypes from 'prop-types'
import { createContext, useContext, useState } from 'react'

const LocalStateContext = createContext()
const LocalStateProvider = LocalStateContext.Provider

function CartStateProvider({ children }) {
  // This is our own custom Provider!  We will store data(state) and functionality (updaters) in here
  // and anyone can access it via the Consumer!

  const [cartOpen, setCartOpen] = useState(false)

  function toggleCart() {
    setCartOpen(!cartOpen)
  }

  function closeCart() {
    setCartOpen(false)
  }

  function openCart() {
    setCartOpen(true)
  }

  return (
    <LocalStateProvider value={{ cartOpen, setCartOpen, toggleCart, openCart, closeCart }}>
      {children}
    </LocalStateProvider>
  )
}

// Make a Custom Hook for accessing the cart local state
function useCart() {
  // We use a Consumer here to access the local state
  // We put this into it's own custom hook so that when we want to access the cart
  // we don't need to import useContex and LocalStateContext - we just use our nice hook
  // to internally access
  const all = useContext(LocalStateContext)
  return all
}

CartStateProvider.propTypes = {
  children: PropTypes.any,
}

export { CartStateProvider, useCart }
