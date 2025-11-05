import React from 'react'
import { Link } from 'react-router-dom'

import { Product } from '../../features/products/productsSlice'

import './productCard.less'

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
  <article className="product-card" role="article">
      <div className="thumb">
        <img src={product.thumbnail ?? product.images?.[0]} alt={product.title} />
      </div>
      <div className="body">
        <h3>
          <Link to={`/product/${product.id}`}>{product.title}</Link>
        </h3>
        <div className="meta">
          {product.category} · ${product.price}
        </div>
        <div className="rating">Rating: {product.rating ?? '—'}</div>
      </div>
    </article>
  )
}

export default ProductCard