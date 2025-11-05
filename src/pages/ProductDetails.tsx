import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../utils/hooks'
import { fetchProductById } from '../features/products/productsSlice'
import '../styles/details.less'

const ProductDetails: React.FC = () => {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const product = useAppSelector((s) => (id ? s.products.byId[Number(id)] : undefined))

  useEffect(() => {
    if (id) dispatch(fetchProductById(Number(id)))
  }, [dispatch, id])

  if (!product) return <div style={{ padding: 20 }}>Product not found</div>

  return (
    <div className="details">
      <header>
        <h1>{product.title}</h1>
        <div className="meta">
          {product.category} · ${product.price} · Rating: {product.rating ?? '—'}
        </div>
      </header>
      <div className="images">
        {(product.images ?? []).map((src, i) => (
          <img key={i} src={src} alt={`${product.title} ${i}`} />
        ))}
        {product.thumbnail && <img src={product.thumbnail} alt="thumbnail" />}
      </div>
      <section className="desc" dangerouslySetInnerHTML={{ __html: product.description ?? '' }} />
      <div style={{ marginTop: 20 }}>
        <Link to={`/product/${product.id}/edit`}>Edit (protected)</Link>
      </div>
    </div>
  )
}

export default ProductDetails