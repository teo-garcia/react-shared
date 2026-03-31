import path from 'node:path'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const packageRoot = path.resolve(__dirname, '..')

export default defineConfig({
  root: __dirname,
  plugins: [
    tailwindcss(),
    react(),
    tsconfigPaths({
      projects: ['./tsconfig.json'],
      root: __dirname,
    }),
  ],
  resolve: {
    alias: {
      '@teo-garcia/react-shared': path.resolve(packageRoot, 'src/index.ts'),
    },
    dedupe: ['react', 'react-dom'],
  },
  server: {
    fs: {
      allow: [packageRoot],
    },
    port: 4100,
  },
  preview: {
    port: 4100,
  },
})
