import { PropTypes } from 'prop-types'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import Head from 'next/head'
import Link from 'next/link'
import DisplayError from './ErrorMessage'
import PaginationStyles from './styles/PaginationStyles'
import { perPage } from '../config.js'

export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    _allProductsMeta {
      count
    }
  }
`

export default function Pagination({ page = 1 }) {
  const { data, loading, error } = useQuery(PAGINATION_QUERY)

  if (loading) return <p>Loading...</p>

  const { count } = data._allProductsMeta
  const pageCount = Math.ceil(count / perPage)

  if (loading) return <DisplayError error={error} />

  return (
    <PaginationStyles>
      <Head>
        <title>
          Sick Fits - Page {page} of {pageCount}
        </title>
      </Head>
      <Link href={`/products/${page - 1}`}>
        {/* NextJS doesn't allow aria-disabled attribute on Link tags */}
        <a aria-disabled={page === 1}>&lt; Prev</a>
      </Link>
      <p>
        Page {page} of {pageCount}
      </p>
      <p>{count} Items Total</p>
      <Link href={`/products/${page + 1}`}>
        <a aria-disabled={page === pageCount}>Next &gt;</a>
      </Link>
    </PaginationStyles>
  )
}

Pagination.propTypes = {
  page: PropTypes.number,
}
