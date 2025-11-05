import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import store from './store'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import EditProduct from './pages/EditProduct'
import './styles/global.less'

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/product/:id', element: <ProductDetails /> },
  { path: '/product/:id/edit', element: <EditProduct /> },
  { path: '*', element: <div style={{ padding: 20 }}>404 - Not Found</div> },
])

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
)