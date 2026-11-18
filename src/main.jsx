import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'

function App() {
  return <main className="min-h-dvh bg-paper p-8 text-ink type-body">Orasan scaffold</main>
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
