import { UniqueInputFieldNamesRule } from 'graphql'
import { PAGINATION_QUERY } from '../components/Pagination'

export default function paginationField() {
  return {
    keyArgs: false, // Tells Apollo that we will manually take care of data/cache handling
    read(existing = [], { args, cache }) {
      const { skip, first } = args

      // Read the number of items on the page from cache
      const data = cache.readQuery({ query: PAGINATION_QUERY })
      const count = data?._allProductsMeta?.count
      const page = skip / first + 1
      const pages = Math.ceil(count / first)

      // Check if we have existing items
      const items = existing.slice(skip, skip + first).filter((x) => x) // Trick: filter out undefined items

      // If there are items but there aren't enough to satisfy how many are requested and we're on last page
      // then just send it
      if (items.length && items.length !== first && page === pages) {
        return items
      }

      if (items.length !== first) {
        // We don't have any items, we must go to network to fetch
        return
      }

      // If there are items, just return them from the cache, and we don't need to go to the network.
      if (items.length) {
        console.log(`There are ${items.length} in the cache!  Gonna send them to Apollo`)
        return items
      }

      return false // fallback to network

      // When asking Apollo for data it will first run this read function...
      // We can either do one of the two things:
      // First thing we can do is return the items becaue they are already int he cache
      // Second thing we can do is return false from, which leads to a network request
    },
    merge(existing, incoming, { args }) {
      const { skip, first } = args

      // This runs when the Apollo comes back from the network with our data...
      // this will define how we want data to be put into cache
      console.log(`Merging items from the network ${incoming.length}`)

      const merged = existing ? existing.slice() : []
      for (let i = 0; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip]
      }

      // Finally we return the merged items from the cache
      return merged
    },
  }
}
