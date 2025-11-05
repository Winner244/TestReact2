import React, { useEffect, useState } from 'react'
import { z } from 'zod'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEditor, EditorContent, EditorContext } from '@tiptap/react'
import { MarkButton } from '@/components/tiptap-ui/mark-button'
import { ListButton } from '@/components/tiptap-ui/list-button/list-button'
import StarterKit from '@tiptap/starter-kit'

import { useAppDispatch, useAppSelector } from '../../utils/hooks'
import { fetchProductById, Product, upsertProduct } from '../../features/products/productsSlice'

import '../../styles/_variables.scss';
import '../../styles/_keyframe-animations.scss';
import './productEdit.less'

const EditSchema = z.object({
    title: z.string().min(1),
    price: z.number().nonnegative(),
    discountPercentage: z.number().min(0).optional(),
})

type EditForm = z.infer<typeof EditSchema>

const ProductEdit: React.FC = () => {
    const { id } = useParams()
    const dispatch = useAppDispatch()
    const product = useAppSelector((s) => (id ? s.products.byId[Number(id)] : undefined))
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!id) return
        if (product) return
        setLoading(true)
        dispatch(fetchProductById(Number(id))).finally(() => setLoading(false))
    }, [dispatch, id, product])

    const { register, handleSubmit, reset } = useForm<EditForm>({
        resolver: zodResolver(EditSchema),
        defaultValues: { title: '', price: 0 },
    })

    // TipTap editor for description RTE
    const editor = useEditor({
        immediatelyRender: false,
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
            reset({ 
                title: product.title, 
                price: product.price, 
                discountPercentage: product.discountPercentage ?? 0 
            })
            editor?.commands.setContent(product.description ?? '')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product, reset])

    if (loading) return <div className='p-5'>Loading product...</div>
    if (!product) return <div className='p-5'>Product not found</div>

    const onSubmit = (data: EditForm) => {
        const updated: Product = { ...product, ...data, description: editor?.getHTML() ?? product.description }
        dispatch(upsertProduct(updated));
        console.log('updated', updated);
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
                            Discount %
                            <input className="form-control" type="number" step="0.1" {...register('discountPercentage', { valueAsNumber: true })} />
                        </label>
                    </div>

                    <div className="form-group">
                        <label className='product-edit-page__form-label'>
                            Description
                            <EditorContext.Provider value={{ editor }}>
                                <div className='product-edit-page__form-editor-buttons'>
                                    <MarkButton type="bold" />
                                    <MarkButton type="italic" />
                                    <MarkButton type="strike" />
                                    <MarkButton type="underline" />
                                    <ListButton type="bulletList"/>
                                    <ListButton type="orderedList"/>
                                </div>
                                <EditorContent editor={editor} role="presentation" />
                            </EditorContext.Provider>
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