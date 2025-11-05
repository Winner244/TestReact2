import { createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import EditProduct from './pages/EditProduct'
import './styles/global.less'

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/product/:id', element: <ProductDetails /> },
  { path: '/product/:id/edit', element: <EditProduct /> },
  { path: '*', element: <div style={{ padding: 20 }}>404 - Not Found</div> },
])