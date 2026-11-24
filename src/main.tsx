import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { router } from './app/router'
import './shared/styles/index.css'

// index.html provides the element where React mounts the app.
const root = document.getElementById('root')
if (!root) throw new Error('Missing root element')

// StrictMode runs extra development checks for render and Effect bugs.
createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
