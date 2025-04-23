import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { configDotenv } from 'dotenv'

// https://vite.dev/config/
export default defineConfig({
  server:{
    proxy:{
      '/api':'http://localhost:5050'
    },
  },
  plugins: [react()],
})
