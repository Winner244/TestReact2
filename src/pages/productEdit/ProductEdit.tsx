import React, { useEffect } from 'react'
import { z } from 'zod'
import { useParams, Navigate, Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEditor, EditorContent } from '@tiptap/react'
import { FloatingMenu, BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'

import { useAppDispatch, useAppSelector } from '../../utils/hooks'
import { fetchProductById, Product, upsertProduct } from '../../features/products/productsSlice'

import './productEdit.less'

const EditSchema = z.object({
    title: z.string().min(1),
    price: z.number().nonnegative(),
    rating: z.number().min(0).max(5).optional(),
    discountPercentage: z.number().min(0).optional(),
})

type EditForm = z.infer<typeof EditSchema>

const ProductEdit: React.FC = () => {
    const { id } = useParams()
    const dispatch = useAppDispatch()
    const product = useAppSelector((s) => (id ? s.products.byId[Number(id)] : undefined))
    const loggedIn = useAppSelector((s) => s.auth.loggedIn)
    const navigate = useNavigate()

    useEffect(() => {
        if (id) dispatch(fetchProductById(Number(id)))
    }, [dispatch, id])

    const { register, handleSubmit, reset } = useForm<EditForm>({
        resolver: zodResolver(EditSchema),
        defaultValues: { title: '', price: 0 },
    })

    // TipTap editor for description RTE
    const editor = useEditor({
        extensions: [StarterKit],
        content: product?.description ?? '',
        editorProps: {
            attributes: {
                class: 'form-control',
            },
        },
    })

    useEffect(() => {
        if (product) {
            reset({ title: product.title, price: product.price, rating: product.rating ?? undefined, discountPercentage: product.discountPercentage ?? undefined })
            editor?.commands.setContent(product.description ?? '')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product, reset])

    if (!loggedIn) return <Navigate to={`/product/${product?.id}`} replace />
    if (!product) return <div style={{ padding: 20 }}>Product not found</div>

    const onSubmit = (data: EditForm) => {
        const updated: Product = { ...product, ...data, description: editor?.getHTML() ?? product.description }
        dispatch(upsertProduct(updated));
        navigate(`/product/${updated.id}`);
    }

    return (
        <div className="product-edit-page container">
            <div className='card'>
                <div className="card-header">
                    <h3>Edit: <Link className='text-decoration-none' to={`/product/${product.id}`}>{product.title}</Link></h3>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="product-edit-page__form card-body">

                    <div className="form-group">
                        <label className='product-edit-page__form-label'>
                            Title
                            <input className="form-control" {...register('title')} />
                        </label>
                    </div>

                    <div className="form-group">
                        <label className='product-edit-page__form-label'>
                            Price
                            <input className="form-control" type="number" step="0.01" {...register('price', { valueAsNumber: true })} />
                        </label>
                    </div>

                    <div className="form-group">
                        <label className='product-edit-page__form-label'>
                            Rating
                            <input className="form-control" type="number" step="0.1" {...register('rating', { valueAsNumber: true })} />
                        </label>
                    </div>


                    <div className="form-group">
                        <label className='product-edit-page__form-label'>
                            Discount %
                            <input className="form-control" type="number" step="0.1" {...register('discountPercentage', { valueAsNumber: true })} />
                        </label>
                    </div>

                    <div className="form-group">
                        <label className='product-edit-page__form-label'>
                            Description
                            <EditorContent editor={editor} />
                        </label>
                    </div>

                    <div className="product-edit-page__form-actions">
                        <button type="submit" className="btn btn-primary">Save</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ProductEdit