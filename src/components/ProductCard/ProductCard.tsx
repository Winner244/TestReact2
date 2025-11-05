import React from 'react'
import { Link } from 'react-router-dom'

import { Product } from '../../features/products/productsSlice'

import './productCard.less'

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
  <article className="product-card" role="article">
      <div className="product-card__thumb">
        <img src={product.thumbnail ?? product.images?.[0]} alt={product.title} />
      </div>
      <div className="product-card__body">
        <h3>
          <Link to={`/product/${product.id}`}>{product.title}</Link>
        </h3>
        <div className="product-card__body-meta">
          {product.category} · ${product.price}
        </div>
        <div className="product-card__body-rating">Rating: {product.rating ?? '—'}</div>
      </div>
    </article>
  )
}

export default ProductCard