export default function paginationField() {
  return {
    keyArgs: false, // Tells Apollo that we will manually take care of data/cache handling
    read(existing = [], { args, cache }) {
      const { skip, first } = args

      // Read the number of items on the page from cache

      // When asking Apollo for data it will first run this read function...
      // We can either do one of the two things:
      // First thing we can do is return the items becaue they are already int he cache
      // Second thing we can do is return false from, which leads to a network request
    },
    merge() {
      // This runs when the Apollo comes back from the network with our data...
      // this will define how we want data to be put into cache
    },
  }
}
