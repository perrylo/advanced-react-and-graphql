import { useRouter } from 'next/dist/client/router'
import Products from '../../components/Products'
import Pagination from '../../components/Pagination'

export default function ProductsPage() {
  const { query } = useRouter()

  return (
    <div>
      <Pagination page={parseInt(query.page) || 1} />
      <Products page={parseInt(query.page) || 1} />
      <Pagination page={parseInt(query.page) || 1} />
    </div>
  )
}
