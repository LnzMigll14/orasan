import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // React provides Fast Refresh in development. Tailwind compiles the utility styles.
  plugins: [react(), tailwindcss()],
})
