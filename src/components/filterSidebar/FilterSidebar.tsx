import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { customZodResolver } from '../../hooks/useUrlFilters'

import { FiltersSchema } from './filterSchema'

import './filterSidebar.less'

const FilterSidebar: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const initial: any = {};
    const empty: any = {};
    searchParams.forEach((value, key) => {
        initial[key] = value
        empty[key] = ''
    });
    const { register, watch, handleSubmit, setValue, reset, getValues, formState: { errors } } 
        = useForm({ resolver: customZodResolver(FiltersSchema) as any, defaultValues: empty })
    const [open, setOpen] = useState(false)

    useEffect(() => {
        reset(initial)
    }, [searchParams])

    const onSubmit = (vals: Record<string, any>) => {
        //set to url only inputs with value
        const clean: Record<string, string> = {}
        Object.entries(vals).forEach(([k, v]) => {
            if (v !== undefined && v !== null && v !== '' && v !== false)
                clean[k] = String(v).trim()
        })
        setSearchParams(clean)

        setOpen(false)
    }

    const resetAll = () => {
        setSearchParams({})
        reset(empty)
        setOpen(false)
    }

    const discountedOnly = watch('discountedOnly')
    const minPrice = watch('minPrice')
    const maxPrice = watch('maxPrice')

    // clear maxPrice when minPrice is empty
    useEffect(() => {
        if (maxPrice && !minPrice) {
            setValue('maxPrice', '')

            const vals = getValues()
            onSubmit(vals)
            reset(vals)
        }
    }, [minPrice, setValue, getValues])

    // clear minDiscountPercent when discountedOnly is false
    useEffect(() => {
        if (discountedOnly === false) {
            setValue('minDiscountPercent', '')
            
            const vals = getValues()
            onSubmit(vals)
            reset(vals)
        }
    }, [discountedOnly, setValue, getValues])


    return (
        <div>
            <button className="filter-sidebar__toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
                Filters
            </button>

            <aside className={`filter-sidebar ${open ? 'filter-sidebar--open' : ''}`} aria-hidden={!open && window.innerWidth < 700}>
                <form className='filter-sidebar__form' onSubmit={handleSubmit(onSubmit)}>

                    <div className="form-group">
                        <label className='filter-sidebar__form-label'>
                            Search
                            <input className={`form-control ${errors.q ? 'is-invalid' : ''}`} {...register('q')} placeholder="title" />
                            {errors.q && <span className="invalid-feedback d-block">{(errors.q as any).message}</span>}
                        </label>
                    </div>

                    <div className="form-group">
                        <label className='filter-sidebar__form-label'>
                            Categories (comma)
                            <input className={`form-control ${errors.categories ? 'is-invalid' : ''}`} {...register('categories')} placeholder="e.g. smartphones, laptops" />
                            {errors.categories && <span className="invalid-feedback d-block">{(errors.categories as any).message}</span>}
                        </label>
                    </div>

                    <div className="form-group">
                        <label className='filter-sidebar__form-label'>
                            Min price
                            <input className={`form-control ${errors.minPrice ? 'is-invalid' : ''}`} type="number" {...register('minPrice')} />
                            {errors.minPrice && <span className="invalid-feedback d-block">{(errors.minPrice as any).message}</span>}
                        </label>
                    </div>

                    <div className="form-group">
                        <label className='filter-sidebar__form-label'>
                            Max price
                            <input className={`form-control ${errors.maxPrice ? 'is-invalid' : ''}`} type="number" {...register('maxPrice')} disabled={minPrice === undefined || minPrice === ''} />
                            {errors.maxPrice && <span className="invalid-feedback d-block">{(errors.maxPrice as any).message}</span>}
                        </label>
                    </div>

                    <div className="form-group">
                        <label className='filter-sidebar__form-label'>
                            Rating
                            <select className={`form-control ${errors.rating ? 'is-invalid' : ''}`} {...register('rating')}>
                                <option value="">Any</option>
                                <option value="4">4+</option>
                                <option value="3">3+</option>
                                <option value="2">2+</option>
                            </select>
                            {errors.rating && <span className="invalid-feedback d-block">{(errors.rating as any).message}</span>}
                        </label>
                    </div>

                    <div className="form-check">
                        <label className="form-check-label">
                            Discounted only
                            <input className={`form-check-input ${errors.discountedOnly ? 'is-invalid' : ''}`} type="checkbox" {...register('discountedOnly')} />
                            {errors.discountedOnly && <span className="invalid-feedback d-block">{(errors.discountedOnly as any).message}</span>}
                        </label>
                    </div>

                    {discountedOnly && (
                        <div className="form-group">
                            <label className='filter-sidebar__form-label'>
                                Min discount %
                                <input className={`form-control ${errors.minDiscountPercent ? 'is-invalid' : ''}`} type="number" {...register('minDiscountPercent')} />
                                {errors.minDiscountPercent && <span className="invalid-feedback d-block">{(errors.minDiscountPercent as any).message}</span>}
                            </label>
                        </div>
                    )}

                    <div className="filter-sidebar__form-actions">
                        <button className='btn btn-success' type="submit">Apply</button>
                        <button className='btn btn-danger' type="reset" onClick={resetAll}>
                            Reset
                        </button>
                    </div>
                </form>
            </aside>
        </div>
    )
}

export default FilterSidebar