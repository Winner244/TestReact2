import { createBrowserRouter } from 'react-router-dom'

import Home from './pages/home/Home'
import ProductDetails from './pages/productDetails/ProductDetails'
import ProductEdit from './pages/productEdit/ProductEdit'
import NotFound from './pages/notFound/NotFound'

import Authorize from './components/authorization/Authorization'

import CommonLayout from './layouts/CommonLayout/CommonLayout'

export const router = createBrowserRouter([
    {
        element: <CommonLayout />,
        children: [
            { path: '/', element: <Home /> },
            { path: '/product/:id', element: <ProductDetails /> },
            { path: '/product/:id/edit', element: <Authorize><ProductEdit /></Authorize> },
            { path: '*', element: <NotFound/> },
        ],
    },
])