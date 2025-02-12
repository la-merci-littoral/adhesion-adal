import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import dotenv from 'dotenv'
var serverConfig = {}
if (process.env.NODE_ENV === 'development') {
  serverConfig = {
    port: 5173
  }
  dotenv.config({path: '../.env.development'})
} else if (process.env.NODE_ENV === 'production') {
  serverConfig = {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5174',
        changeOrigin: true,
      }
    }
  }
  dotenv.config({path: '../.env.production'})
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: serverConfig,
  envDir: '../',
  define: {
    'import.meta.env.AMOUNT': JSON.stringify(parseInt(process.env.AMOUNT!)),
    'import.meta.env.STRIPE_PK': JSON.stringify(process.env.STRIPE_PK),
    'import.meta.env.BASE_URL': JSON.stringify(process.env.BASE_URL),
  }
})
