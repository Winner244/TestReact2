import React from 'react'
import { createBrowserRouter, redirect } from 'react-router-dom'
import AppLayout from './ui/AppLayout'
import ProductListPage from './pages/ProductList'
import ProductDetailsPage from './pages/ProductDetails'
import ProductEditPage from './pages/ProductEdit'
import NotFoundPage from './pages/NotFound'
import { requireAuth } from './auth/requireAuth'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <ProductListPage /> },
      { path: 'product/:id', element: <ProductDetailsPage /> },
      {
        path: 'product/:id/edit',
        element: requireAuth(<ProductEditPage />)
      },
      { path: '*', element: <NotFoundPage /> }
    ]
  }
])