// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// React configuration
export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: './index.html',
    },
  },
  server: {
    port: 3000,
    open: '/index.html',
    fs: {
      // Allow serving files from project root
      strict: false,
    },
  },
})
