import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../utils/hooks'
import { fetchProductById } from '../../features/products/productsSlice'

import './productDetails.less'

const ProductDetails: React.FC = () => {
    const { id } = useParams()
    const dispatch = useAppDispatch()
    const product = useAppSelector((s) => (id ? s.products.byId[Number(id)] : undefined))

    useEffect(() => {
        if (id) dispatch(fetchProductById(Number(id)))
    }, [dispatch, id])

    if (!product) return <div style={{ padding: 20 }}>Product not found</div>

    return (
        <div className="product-details container">
            <div className="card">
                <div className="card-header d-flex justify-content-between">
                    {product.title}
                    <Link className='btn btn-secondary' to={`/product/${product.id}/edit`}>Edit</Link>
                </div>
                <div className="card-body">
                    <div className="images">
                        {(product.images ?? []).map((src, i) => (
                            <img key={i} src={src} alt={`${product.title} ${i}`} />
                        ))}
                    </div>
                    <div>{product.category}</div>
                    <div>Price: ${product.price}</div>
                    <div>Rating: {product.rating ?? '—'}</div>
                    <p className="card-text" dangerouslySetInnerHTML={{ __html: product.description ?? '' }} />
                </div>
            </div>
        </div>
    )
}

export default ProductDetails