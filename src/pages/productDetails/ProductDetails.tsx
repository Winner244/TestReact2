import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import moment from 'moment'

import { useAppDispatch, useAppSelector } from '../../utils/hooks'
import { fetchProductById } from '../../features/products/productsSlice'
import EmblaCarousel from '../../components/carousel/EmblaCarousel'

import './productDetails.less'


const ProductDetails: React.FC = () => {
    const { id } = useParams()
    const dispatch = useAppDispatch()
    const product = useAppSelector((s) => (id ? s.products.byId[Number(id)] : undefined))
    const loggedIn = useAppSelector((s) => s.auth.loggedIn)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!id) return
        if (product) return
        setLoading(true)
        dispatch(fetchProductById(Number(id))).finally(() => setLoading(false))
    }, [dispatch, id, product])

    if (loading) return <div className='p-5 text-center'>Loading product...</div>
    if (!product) return <div className='p-5 text-center'>Product not found</div>

    return (
        <div className="product-details container">
            <div className="card">
                <div className="card-header d-flex justify-content-between">
                    <h3>{product.title}</h3>
                    {loggedIn && (
                        <Link className='btn btn-success' to={`/product/${product.id}/edit`}>Edit</Link>
                    )}
                </div>
                <div className="card-body">
                    <div className="product-details__images" >
                        <EmblaCarousel slides={product.images ?? []} />
                    </div>

                    <p className="card-text" dangerouslySetInnerHTML={{ __html: product.description ?? '' }} />
                    <div>Category: {product.category}</div>
                    <div>Price: ${product.price}  {product.discountPercentage && <span>({product.discountPercentage}% off)</span>}</div> 
                    <div>Rating: {product.rating ?? '—'}</div>

                    <section className="product-details__reviews">
                        <h5>Reviews</h5>
                        {product.reviews && product.reviews.length > 0 ? (
                            <ul className="product-details__reviews-list">
                                {product.reviews.map((review, idx) => (
                                    <li key={idx} className="product-details__review">
                                        <div className="product-details__review-header">
                                            <strong>{review.reviewerName || 'Anonymous'}</strong>
                                            {review.rating !== undefined && <span className="product-details__review-rating"> — {review.rating}/5</span>}
                                        </div>
                                        <div className="product-details__review-date">{moment(review.date).format('MMMM Do YYYY')}</div>
                                        <div className="product-details__review-body">{review.comment}</div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="product-details__no-reviews">No reviews</div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    )
}

export default ProductDetails