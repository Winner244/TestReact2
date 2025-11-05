import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { z } from 'zod'

export const ProductSchema = z.object({
    id: z.number(),
    title: z.string(),
    description: z.string().optional(),
    category: z.string().optional(),
    price: z.number(),
    discountPercentage: z.number().optional(),
    rating: z.number().optional(),
    stock: z.number().optional(),
    tags: z.array(z.string()).optional(),
    brand: z.string().optional(),
    images: z.array(z.string()).optional(),
    reviews: z.array(z.object({
        id: z.number(),
        reviewerName: z.string(),
        rating: z.number().min(0).max(5),
        comment: z.string().max(500),
        date: z.string()
    })).optional(),
    thumbnail: z.string().optional(),
})

export type Product = z.infer<typeof ProductSchema>

export const fetchProducts = createAsyncThunk('products/fetchAll', async () => {
    const res = await axios.get('https://dummyjson.com/products')
    return res.data.products as Product[]
})

export const fetchProductById = createAsyncThunk('products/fetchById', async (id: number) => {
    const res = await axios.get(`https://dummyjson.com/products/${id}`)
    return res.data as Product
})

type ProductsState = {
    items: Product[]
    byId: Record<number, Product>
    status: 'idle' | 'loading' | 'error'
    error?: string
}

const initialState: ProductsState = {
    items: [],
    byId: {},
    status: 'idle',
}

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        updateProduct(state, action: PayloadAction<Product>) {
            const p = action.payload
            const existingIndex = state.items.findIndex((i) => i.id === p.id)
            if (existingIndex >= 0) state.items[existingIndex] = p
            else state.items.push(p)
            state.byId[p.id] = p
        },
        replaceAll(state, action: PayloadAction<Product[]>) {
            state.items = action.payload
            state.byId = action.payload.reduce((acc, p) => ({ ...acc, [p.id]: p }), {})
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchProducts.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(fetchProducts.fulfilled, (state, action) => {
            state.status = 'idle'
            state.items = action.payload
            state.byId = action.payload.reduce((acc, p) => ({ ...acc, [p.id]: p }), {})
        })
        builder.addCase(fetchProducts.rejected, (state, action) => {
            state.status = 'error'
            state.error = action.error.message
        })
        builder.addCase(fetchProductById.fulfilled, (state, action) => {
            state.byId[action.payload.id] = action.payload
            if (!state.items.find((i) => i.id === action.payload.id)) state.items.push(action.payload)
        })
    },
})

export const { updateProduct, replaceAll } = productsSlice.actions
export default productsSlice.reducer