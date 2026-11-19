import { createBrowserRouter } from 'react-router'
import { Home } from './pages/Home'

/**
 * Routes. Add pages here as you build them, e.g.
 *   { path: '/timer', element: <Timer /> },
 * Wrap app pages in a layout route once the shell (sidebar, tab bar) exists.
 */
export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
])
