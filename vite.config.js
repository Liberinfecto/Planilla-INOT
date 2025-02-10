import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Planilla-INOT/',
  server: {
    port: 5174
  }
})