import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'

import { FiltersSchema } from '../../schemas/filterSchema'

import './filterSidebar.less'

const FilterSidebar: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const initial = Object.fromEntries(searchParams.entries())
  const { register, watch, handleSubmit, setValue } = useForm({ resolver: zodResolver(FiltersSchema), defaultValues: initial })
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // keep form in sync when url changes
    for (const [k, v] of searchParams.entries()) setValue(k as any, v)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const onSubmit = (vals: Record<string, any>) => {
    const clean: Record<string, string> = {}
    Object.entries(vals).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') clean[k] = String(v)
    })
    setSearchParams(clean)
    setOpen(false)
  }

  const discountedOnly = watch('discountedOnly')
  const minPrice = watch('minPrice')

  const resetAll = () => {
    setSearchParams({})
    window.location.reload()
  }

  return (
    <aside className={`filter-sidebar ${open ? 'open' : ''}`} aria-hidden={!open && window.innerWidth < 700}>
      <button className="toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        Filters
      </button>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Search
          <input {...register('q')} placeholder="title" />
        </label>
        <label>
          Categories (comma)
          <input {...register('categories')} placeholder="e.g. smartphones, laptops" />
        </label>
        <label>
          Min price
          <input type="number" {...register('minPrice')} />
        </label>
        <label>
          Max price
          <input type="number" {...register('maxPrice')} disabled={minPrice === undefined || minPrice === ''} />
        </label>
        <label>
          Rating
          <select {...register('rating')}>
            <option value="">Any</option>
            <option value="4">4+</option>
            <option value="3">3+</option>
            <option value="2">2+</option>
          </select>
        </label>
        <label>
          <input type="checkbox" {...register('discountedOnly')} /> Discounted only
        </label>
        {discountedOnly && (
          <label>
            Min discount %
            <input type="number" {...register('minDiscountPercent')} />
          </label>
        )}
        <div className="actions">
          <button type="submit">Apply</button>
          <button type="button" onClick={resetAll}>
            Reset
          </button>
        </div>
      </form>
    </aside>
  )
}

export default FilterSidebar