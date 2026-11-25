/// <reference types="node" />

import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Reads the site-wide block of public/_headers so `npm run preview` serves the same security
 * headers as production. HTTPS-only rules are dropped because preview runs on plain http.
 */
function productionHeaders() {
  const headers: Record<string, string> = {}
  let inSiteBlock = false
  for (const line of readFileSync(new URL('./public/_headers', import.meta.url), 'utf8').split(/\r?\n/)) {
    const text = line.trim()
    if (!text || text.startsWith('#')) continue
    if (!/^\s/.test(line)) {
      inSiteBlock = text === '/*'
      continue
    }
    if (!inSiteBlock) continue
    const colon = text.indexOf(':')
    headers[text.slice(0, colon).trim()] = text.slice(colon + 1).trim()
  }
  delete headers['Strict-Transport-Security']
  if (headers['Content-Security-Policy']) {
    headers['Content-Security-Policy'] = headers['Content-Security-Policy'].replace(/;\s*upgrade-insecure-requests/, '')
  }
  return headers
}

export default defineConfig({
  // React provides Fast Refresh in development. Tailwind compiles the utility styles.
  plugins: [react(), tailwindcss()],
  preview: { headers: productionHeaders() },
})
