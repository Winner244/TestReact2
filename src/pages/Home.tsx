import React, { useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '../utils/hooks'
import { fetchProducts } from '../features/products/productsSlice'
import ProductCard from '../components/ProductCard'
import FilterSidebar from '../components/FilterSidebar'
import Header from '../components/Header'
import '../styles/home.less'
import { useSearchParams } from 'react-router-dom'

const Home: React.FC = () => {
  const dispatch = useAppDispatch()
  const products = useAppSelector((s) => s.products.items)
  const status = useAppSelector((s) => s.products.status)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const filtered = useMemo(() => {
    if (!products) return []
    const q = searchParams.get('q')?.toLowerCase() ?? ''
    const categories = (searchParams.get('categories') ?? '').split(',').map((s) => s.trim()).filter(Boolean)
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined
    const rating = searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined
    const discountedOnly = searchParams.get('discountedOnly') === 'true'
    const minDiscountPercent = searchParams.get('minDiscountPercent') ? Number(searchParams.get('minDiscountPercent')) : undefined

    return products.filter((p) => {
      if (q && !p.title.toLowerCase().includes(q)) return false
      if (categories.length && (!p.category || !categories.includes(p.category))) return false
      if (minPrice !== undefined && p.price < minPrice) return false
      if (maxPrice !== undefined && p.price > maxPrice) return false
      if (rating !== undefined && (p.rating ?? 0) < rating) return false
      if (discountedOnly) {
        if (p.discountPercentage === undefined) return false
        if (minDiscountPercent !== undefined && p.discountPercentage < minDiscountPercent) return false
      }
      return true
    })
  }, [products, searchParams])

  return (
    <div className="page-home">
      <Header />
      <FilterSidebar />
      <main className="product-grid">
        {status === 'loading' && <div className="empty">Loading products…</div>}
        {status === 'idle' && filtered.length === 0 && <div className="empty">No products found</div>}
        {status === 'idle' && filtered.length > 0 && (
          <div className="grid">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Home