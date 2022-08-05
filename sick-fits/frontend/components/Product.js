import PropTypes from 'prop-types'
import Link from 'next/link'
import ItemStyles from './styles/ItemStyles'
import TitleStyles from './styles/TitleStyles'
import PriceTag from './styles/PriceTag'
import formatMoney from '../lib/formatMoney'
import DeleteProduct from './DeleteProduct'

function Product({ product }) {
  return (
    <ItemStyles>
      <img src={product?.photo?.image?.publicUrlTransformed} alt={product.name} />
      <TitleStyles>
        <Link href={`/product/${product.id}`}>{product.name}</Link>
      </TitleStyles>
      <PriceTag>{formatMoney(product.price)}</PriceTag>
      <p>{product.description}</p>
      <div className="buttonList">
        <Link
          href={{
            pathname: 'update',
            query: {
              id: product.id,
            },
          }}
        >
          Edit
        </Link>

        <DeleteProduct id={product.id}>Delete</DeleteProduct>
      </div>
    </ItemStyles>
  )
}

Product.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    id: PropTypes.string.isRequired,
    photo: PropTypes.shape({
      id: PropTypes.string.isRequired,
      image: PropTypes.shape({
        publicUrlTransformed: PropTypes.string,
      }),
    }),
    price: PropTypes.number.isRequired,
  }),
}

export default Product
