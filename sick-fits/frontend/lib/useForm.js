import { useEffect, useState } from 'react'

export default function useForm(initial = {}) {
  // create state obj for our inputs
  const [inputs, setInputs] = useState(initial)
  const initialValues = Object.values(initial).join('')

  // We need this hook (ie onmounted) to update initial data when data is loaded from server
  useEffect(() => {
    // This function runs when the things we are watching change
    setInputs(initial)
  }, [initialValues])

  /*
  sample state:
  {
    name: 'perry',
    description: 'ehllo',
    price: 1000
  }
  */

  function handleChange(e) {
    let { value, name, type } = e.target

    // HTML inputs always return a string... if type is number then change to a number
    if (type === 'number') {
      value = parseInt(value)
    }

    // Special treatment for file type inputs
    if (type === 'file') {
      ;[value] = e.target.files
    }

    setInputs({
      // copy existing state
      ...inputs,
      // update part of state that changed
      [name]: value,
    })
  }

  function resetForm() {
    setInputs(initial)
  }

  function clearForm() {
    const blankState = Object.fromEntries(Object.entries(inputs).map(([k, v]) => [k, '']))
    setInputs(blankState)
  }

  // return the things we want to surface from this custom hook
  return {
    inputs,
    handleChange,
    resetForm,
    clearForm,
  }
}
