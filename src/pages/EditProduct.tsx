import React, { useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../utils/hooks'
import { fetchProductById, Product, upsertProduct } from '../features/products/productsSlice'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import '../styles/edit.less'

const EditSchema = z.object({
  title: z.string().min(1),
  price: z.number().nonnegative(),
  rating: z.number().min(0).max(5).optional(),
  discountPercentage: z.number().min(0).optional(),
})

type EditForm = z.infer<typeof EditSchema>

const EditProduct: React.FC = () => {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const product = useAppSelector((s) => (id ? s.products.byId[Number(id)] : undefined))
  const loggedIn = useAppSelector((s) => s.auth.loggedIn)

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
  })

  useEffect(() => {
    if (product) {
      reset({ title: product.title, price: product.price, rating: product.rating ?? undefined, discountPercentage: product.discountPercentage ?? undefined })
      editor?.commands.setContent(product.description ?? '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, reset])

  if (!loggedIn) return <Navigate to="/" replace />
  if (!product) return <div style={{ padding: 20 }}>Loading product…</div>

  const onSubmit = (data: EditForm) => {
    const updated: Product = { ...product, ...data, description: editor?.getHTML() ?? product.description }
    dispatch(upsertProduct(updated))
    alert('Saved in memory (Redux)')
  }

  return (
    <div className="edit-page">
      <h2>Edit: {product.title}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="edit-form">
        <label>
          Title
          <input {...register('title')} />
        </label>
        <label>
          Price
          <input type="number" step="0.01" {...register('price', { valueAsNumber: true })} />
        </label>
        <label>
          Rating
          <input type="number" step="0.1" {...register('rating', { valueAsNumber: true })} />
        </label>
        <label>
          Discount %
          <input type="number" step="0.1" {...register('discountPercentage', { valueAsNumber: true })} />
        </label>
        <label>
          Description (RTE)
          <div className="editor">
            <EditorContent editor={editor} />
          </div>
        </label>
        <div className="actions">
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  )
}

export default EditProduct