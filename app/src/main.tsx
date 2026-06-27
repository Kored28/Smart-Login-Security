import { createRoot } from 'react-dom/client'
import { createHashRouter } from 'react-router'

import './index.css'
import App from './App.tsx'
import { RouterProvider } from 'react-router/dom'

const router = createHashRouter([
  {
    path: '/',
    element: <App />
  }
])

createRoot(document.getElementById('smart-login-root')!).render(
  <RouterProvider router={router} />
)
